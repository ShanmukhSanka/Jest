// // TestEditDialog.js
// import React, { useEffect } from 'react';
// import { observer } from 'mobx-react-lite';
// import dropdownStore from './store';
// import { Select, MenuItem, TextField, Dialog, DialogActions, DialogContent, DialogContentText, Button, Avatar, CircularProgress } from '@mui/material';
// import { NoteAddTwoTone } from '@material-ui/icons';

// const TestEditDialog = observer(({ open, handleClose, row, columns }) => {

//     useEffect(() => {
//         dropdownStore.fetchFaapcds(); // Fetch dropdown options when the component mounts
//     }, []);

//     function getEditableColumns(columns) {
//         return columns.filter(column => column.enableEditing !== false);
//     }

//     const getValue = (obj, path) =>
//         path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);

//     let values = row !== null ? row?.original : {};

//     return (
//         <Dialog
//             open={open}
//             onClose={handleClose}
//             aria-labelledby="form-dialog-title"
//             maxWidth="md"
//         >
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     margin: "20px 0"
//                 }}>
//                 <Avatar style={{ backgroundColor: "rgb(220,0,78)" }}><NoteAddTwoTone /></Avatar>
//             </div>
//             <DialogContent>
//                 <DialogContentText>
//                     Edit your Record
//                 </DialogContentText>
//                 {dropdownStore.isLoading ? (
//                     <CircularProgress /> // Show loading spinner while fetching data
//                 ) : (
//                     getEditableColumns(columns).map((column) => (
//                         <>
//                             {column.editVariant === 'select' && dropdownStore.faapcds.length > 0 ? (
//                                 <TextField
//                                     id={column.accessorKey}
//                                     key={column.accessorKey}
//                                     name={column.accessorKey}
//                                     label={column.header}
//                                     variant="outlined"
//                                     margin="normal"
//                                     fullWidth
//                                     select
//                                     error={!!validationErrors?.[column.accessorKey]}
//                                     helperText={validationErrors?.[column.accessorKey]}
//                                     value={getValue(values, column.accessorKey) || ''}
//                                     onChange={(event) => {
//                                         const value = event.target.value;
//                                         if (!value) {
//                                             setValidationErrors((prev) => ({
//                                                 ...prev,
//                                                 [column.accessorKey]: `${column.header} is required`
//                                             }));
//                                         } else {
//                                             delete validationErrors[column.accessorKey];
//                                             setValidationErrors({ ...validationErrors });
//                                         }
//                                     }}
//                                     SelectProps={{
//                                         children: dropdownStore.faapcds.map((option) => (
//                                             <MenuItem key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </MenuItem>
//                                         )),
//                                     }}
//                                 />
//                             ) : (
//                                 <TextField
//                                     id={column.accessorKey}
//                                     key={column.accessorKey}
//                                     name={column.accessorKey}
//                                     label={column.header}
//                                     variant="outlined"
//                                     margin="normal"
//                                     fullWidth
//                                     disabled={column.onEditDisabled}
//                                     value={getValue(values, column.accessorKey) || ''}
//                                 />
//                             )}
//                         </>
//                     ))
//                 )}
//                 {dropdownStore.error && <p>{dropdownStore.error}</p>} {/* Display error message if any */}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleClose} color="primary">
//                     Cancel
//                 </Button>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     disabled={true} // Enable this when ready to handle edits
//                 >
//                     Edit
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// });

// export default TestEditDialog;

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Dialog, DialogActions, DialogContent, DialogContentText, Button, Avatar } from '@mui/material';
import { NoteAddTwoTone } from '@mui/icons-material';
import DynamicForm from './DynamicForm';

const TestEditDialog = observer(({ open, handleClose, row }) => {
    const [formState, setFormState] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (row) {
            setFormState(row.original || {});
        }
    }, [row]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
        >
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <Avatar style={{ backgroundColor: "rgb(220,0,78)" }}><NoteAddTwoTone /></Avatar>
            </div>
            <DialogContent>
                <DialogContentText>Edit your Record</DialogContentText>
                <DynamicForm
                    formState={formState}
                    setFormState={setFormState}
                    validationErrors={validationErrors}
                    setValidationErrors={setValidationErrors}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button variant="contained" color="primary">Submit</Button>
            </DialogActions>
        </Dialog>
    );
});

export default TestEditDialog;
