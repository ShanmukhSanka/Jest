#!/bin/bash

# List of groups to check
group_list=("a" "b" "c" "d" "e")

present_groups=()
not_present_groups=()

# Function to check if a group exists
check_group() {
    local group=$1
    local group_name="Abcd-adda-match-$group-onshr"
    echo "Checking group: $group_name"
    output=$(net group "$group_name" /domain 2>&1)
    if [[ $output == *"The specified local group does not exist"* ]]; then
        not_present_groups+=("$group_name")
    else
        present_groups+=("$group_name")
    fi
}

# Iterate over each group in the list and check
for group in "${group_list[@]}"; do
    check_group "$group"
done

# Output results
echo "Groups Present: ${#present_groups[@]}"
for group in "${present_groups[@]}"; do
    echo "$group"
done

echo "Groups Not Present: ${#not_present_groups[@]}"
echo "Groups Not Present: "
for group in "${not_present_groups[@]}"; do
    echo "$group"
done
