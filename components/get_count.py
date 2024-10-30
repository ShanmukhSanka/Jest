import subprocess
import pandas as pd
import io
import sys

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
                    
                    # Extract the list of users from the command output
                    user_list = [line.strip() for line in result.stdout.split('\n') if line.strip() and 'Members' not in line]
                    
                    # Count users (excluding header lines)
                    user_counts[group_name] = len(user_list) - 2  # Subtract 2 for header lines (Group name and comment)
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
