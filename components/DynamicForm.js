import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import dropdownStore from './store';
import { TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { formConfig } from './formConfig';

const DynamicForm = observer(({ formState, setFormState, validationErrors, setValidationErrors }) => {
    useEffect(() => {
        dropdownStore.fetchDomainCodesFunc();
    }, []);

    const handleInputChange = (accessorKey, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [accessorKey]: value,
        }));
        const config = formConfig.find(field => field.accessorKey === accessorKey);
        if (config && config.validation) {
            const error = config.validation(value);
            setValidationErrors((prevState) => ({
                ...prevState,
                [accessorKey]: error,
            }));
        }
    };

    const renderInputField = (field) => {
        const value = formState[field.accessorKey] || '';
        switch (field.type) {
            case 'text':
                return (
                    <TextField
                        fullWidth
                        label={field.label}
                        value={value}
                        onChange={(e) => handleInputChange(field.accessorKey, e.target.value)}
                        error={!!validationErrors[field.accessorKey]}
                        helperText={validationErrors[field.accessorKey]}
                    />
                );
            case 'dropdown':
                return (
                    <FormControl fullWidth>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            value={value}
                            onChange={(e) => handleInputChange(field.accessorKey, e.target.value)}
                            error={!!validationErrors[field.accessorKey]}
                        >
                            {(field.options === 'faapcds' ? dropdownStore.faapcds : field.options).map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <div>{validationErrors[field.accessorKey]}</div>
                    </FormControl>
                );
            case 'multi-select':
                return (
                    <FormControl fullWidth>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            multiple
                            value={value}
                            onChange={(e) => handleInputChange(field.accessorKey, e.target.value)}
                            renderValue={(selected) => selected.join(', ')}
                            error={!!validationErrors[field.accessorKey]}
                        >
                            {dropdownStore[field.options]?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    <Checkbox checked={value.indexOf(option.value) > -1} />
                                    <ListItemText primary={option.label} />
                                </MenuItem>
                            ))}
                        </Select>
                        <div>{validationErrors[field.accessorKey]}</div>
                    </FormControl>
                );
            case 'date':
                return (
                    <DatePicker
                        label={field.label}
                        value={value}
                        onChange={(date) => handleInputChange(field.accessorKey, date)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                error={!!validationErrors[field.accessorKey]}
                                helperText={validationErrors[field.accessorKey]}
                            />
                        )}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            {dropdownStore.isLoading ? (
                <CircularProgress />
            ) : (
                formConfig.map((field) => (
                    <div key={field.accessorKey} style={{ marginBottom: '20px' }}>
                        {renderInputField(field)}
                    </div>
                ))
            )}
            {dropdownStore.error && <p>{dropdownStore.error}</p>}
        </>
    );
});

export default DynamicForm;
