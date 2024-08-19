// formConfig.js
export const formConfig = [
    {
        accessorKey: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        validation: (value) => value ? '' : 'Name is required',
    },
    {
        accessorKey: 'status',
        label: 'Status',
        type: 'dropdown',
        options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
        ],
        required: true,
        validation: (value) => value ? '' : 'Status is required',
    },
    {
        accessorKey: 'applicationCode',
        label: 'Application Code',
        type: 'dropdown',
        options: 'faapcds', // This refers to data from the MobX store
        required: true,
        validation: (value) => value ? '' : 'Application Code is required',
    },
    // Add more fields as needed
];
