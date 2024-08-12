import React, { useState } from 'react';
import { NoteAddTwoTone } from '@material-ui/icons';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function TestEditDialog({ open, handleClose, row, columns }) {

    function getEditableColumns(columns) {
        return columns.filter(column => column.enableEditing !== false);
    }

    const getValue = (obj, path) =>
        path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);

    console.log("columns passed to TestEditDialog:", columns);

    let values = row !== null ? row?.original : {};
    console.log("values:", values);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "20px 0"
                }}>
                <Avatar style={{ backgroundColor: "rgb(220,0,78)" }}><NoteAddTwoTone /></Avatar>
            </div>
            <DialogContent>
                <DialogContentText>
                    Edit your Record
                </DialogContentText>
                {
                    getEditableColumns(columns).map((column) => {
                        console.log("Rendering column:", column);
                        console.log("Column options:", column.options);
                        return (
                            column.options ? (
                                <FormControl variant="outlined" margin="normal" fullWidth key={column.accessorKey}>
                                    <InputLabel id={`${column.accessorKey}-label`}>{column.header}</InputLabel>
                                    <Select
                                        labelId={`${column.accessorKey}-label`}
                                        id={column.accessorKey}
                                        value={getValue(values, column.accessorKey) || ''}
                                        label={column.header}
                                        onChange={(e) => {
                                            // Handle dropdown change here
                                            console.log(`${column.accessorKey} selected:`, e.target.value);
                                        }}
                                        disabled={column.onEditDisabled}
                                    >
                                        {column.options.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <TextField
                                    id={column.accessorKey}
                                    key={column.accessorKey}
                                    name={column.accessorKey}
                                    label={column.header}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    disabled={column.onEditDisabled}
                                    value={getValue(values, column.accessorKey) || ''}
                                />
                            )
                        );
                    })
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={true} // Enable this when ready to handle edits
                >
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
