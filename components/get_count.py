import subprocess
import pandas as pd
import io
import sys
import re
import time

# Define a function to extract valid users based on the pattern
def extract_valid_users(command_output):
    # Regular expression to match the required formats:
    # 1. Two alphabets followed by 5 digits (e.g., AD30071)
    # 2. Two alphabets followed by 6 digits and two alphabets (e.g., AN300404AD)
    pattern = r'(?<![A-Za-z0-9])(\b[A-Z]{2}\d{5}\b|\b[A-Z]{2}\d{6}[A-Z]{2}\b)(?![A-Za-z0-9])'

    # Find all matching users in the command output
    matches = re.findall(pattern, command_output)
    
    return matches

def check_groups(group_list):
    present_groups = []
    not_present_groups = []
    user_counts = {}
    output = io.StringIO()

    old_stdout = sys.stdout
    sys.stdout = output

    try:
        for group in group_list:
            group_name = f"AEDL-ADFS-METADATA-{group}-ONSHR"
            print(f"Preparing to check group: {group_name}. Waiting for 5 seconds...")
            time.sleep(5)  # Wait for 5 seconds before running the command

            print(f"Checking group: {group_name}")
            try:
                # Run the 'net group' command for each group
                result = subprocess.run(
                    ['net', 'group', group_name, '/DOMAIN'],
                    capture_output=True, text=True
                )
                print(f"Command output: {result.stdout}")
                
                # Check if the group exists or not
                if "The specified group could not be found" in result.stdout:
                    not_present_groups.append(group_name)
                    user_counts[group_name] = 0  # Group not found, so user count is 0
                else:
                    present_groups.append(group_name)
                    
                    # Extract valid users based on the specified pattern
                    valid_users = extract_valid_users(result.stdout)
                    
                    # Count valid users
                    user_counts[group_name] = len(valid_users)
            except Exception as e:
                print(f"Error occurred: {e}")
                not_present_groups.append(group_name)
                user_counts[group_name] = 0  # Error occurred, so treat as group not found
    finally:
        sys.stdout = old_stdout

    console_output = output.getvalue()
    return present_groups, not_present_groups, user_counts, console_output


if __name__ == "__main__":
    # List of groups to check
    group_list = ['ABCD', 'ABCDE', 'ABCDEF']
    
    print(f"Initial group list: {group_list}")
    
    # Call the function to check groups
    present_groups, not_present_groups, user_counts, console_output = check_groups(group_list)

    # Prepare data for DataFrame
    data = {
        "Groups Present": present_groups,
        "User Count": [user_counts[group] for group in present_groups],
        "Groups Not Present": not_present_groups,
        "User Count (Not Present)": [user_counts[group] for group in not_present_groups]
    }

    # Ensure all lists are of equal length by padding with empty strings
    max_len = max(len(data['Groups Present']), len(data['Groups Not Present']))
    
    for key in data:
        data[key] += [''] * (max_len - len(data[key]))

    # Calculate total users in present groups and mark it in the DataFrame
    total_users_present = sum([count for group, count in user_counts.items() if group in present_groups])
    
    # Add total users row at the end of the DataFrame
    data["Total Users Present"] = [total_users_present] + [''] * (max_len - 1)

    # Create a DataFrame from the data dictionary
    df = pd.DataFrame(data)

    # Export results to an Excel file
    with pd.ExcelWriter('group_check_results.xlsx') as writer:
        df.to_excel(writer, sheet_name='group check results', index=False)

        # Also export console output to another sheet in Excel file
        console_output_df = pd.DataFrame({'Console Output': console_output.split('\n')})
        console_output_df.to_excel(writer, sheet_name='console output', index=False)

    print("Results exported successfully to 'group_check_results.xlsx'")
