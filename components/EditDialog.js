// // import React, { useState, useEffect } from 'react';
// // import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText } from '@mui/material';
// // import { observer } from 'mobx-react-lite';
// // import portalParamStore from './PortalParamStore';

// // const dropdownFields = ['domain_cd', 'aplctn_cd'];
// // const multiSelectFields = ['ownrshp_team'];
// // const textFields = ['clnt_id', 'S3_bkt_Key_cmbntn'];

// // const EditDialog = observer(({ open, onClose, rowData }) => {
// //   const [formData, setFormData] = useState({});

// //   useEffect(() => {
// //     if (open && rowData) {
// //       setFormData(rowData);
// //     }
// //   }, [open, rowData]);

// //   const handleChange = (field, value) => {
// //     setFormData(prevData => ({ ...prevData, [field]: value }));
// //   };

// //   const handleSave = () => {
// //     // Implement save logic here
// //     console.log('Saving:', formData);
// //     onClose();
// //   };

// //   const renderField = (field) => {
// //     if (dropdownFields.includes(field)) {
// //       const options = portalParamStore[field] || [];
// //       return (
// //         <FormControl fullWidth key={field}>
// //           <InputLabel>{field}</InputLabel>
// //           <Select
// //             value={formData[field] || ''}
// //             onChange={(e) => handleChange(field, e.target.value)}
// //             label={field}
// //           >
// //             {options.map((option) => (
// //               <MenuItem key={option} value={option}>{option}</MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>
// //       );
// //     } else if (multiSelectFields.includes(field)) {
// //       const options = portalParamStore[field] || [];
// //       return (
// //         <FormControl fullWidth key={field}>
// //           <InputLabel>{field}</InputLabel>
// //           <Select
// //             multiple
// //             value={formData[field] || []}
// //             onChange={(e) => handleChange(field, e.target.value)}
// //             renderValue={(selected) => selected.join(', ')}
// //             label={field}
// //           >
// //             {options.map((option) => (
// //               <MenuItem key={option} value={option}>
// //                 <Checkbox checked={(formData[field] || []).indexOf(option) > -1} />
// //                 <ListItemText primary={option} />
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>
// //       );
// //     } else {
// //       return (
// //         <TextField
// //           key={field}
// //           fullWidth
// //           label={field}
// //           value={formData[field] || ''}
// //           onChange={(e) => handleChange(field, e.target.value)}
// //         />
// //       );
// //     }
// //   };

// //   return (
// //     <Dialog open={open} onClose={onClose}>
// //       <DialogTitle>{rowData ? 'Edit' : 'Add'} Configuration</DialogTitle>
// //       <DialogContent>
// //         {[...dropdownFields, ...multiSelectFields, ...textFields].map(renderField)}
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={onClose}>Close</Button>
// //         <Button onClick={handleSave} color="primary">Save</Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // });

// // export default EditDialog;






// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Avatar } from '@mui/material';
// import { observer } from 'mobx-react-lite';
// import portalParamStore from './PortalParamStore';
// import { NoteAddTwoTone } from '@mui/icons-material';

// const fieldsConfig = [
//   { header: 'Domain Code', accessorKey: 'domain_cd', editVariant: 'select', storeKey: 'domain_cd' },
//   { header: 'Application Code', accessorKey: 'aplctn_cd', editVariant: 'select', storeKey: 'aplctn_cd' },
//   { header: 'Client ID', accessorKey: 'clnt_id', editVariant: 'text' },
//   { header: 'S3 Bucket Key Combination', accessorKey: 'S3_bkt_Key_cmbntn', editVariant: 'text' },
//   { header: 'Ownership Team', accessorKey: 'ownrshp_team', editVariant: 'multiSelect', storeKey: 'ownrshp_team' },
// ];

// const EditDialog = observer(({ open, onClose, rowData }) => {
//   const [formData, setFormData] = useState({});
//   const [validationErrors, setValidationErrors] = useState({});

//   useEffect(() => {
//     if (open) {
//       setFormData(rowData || {});
//       setValidationErrors({});
//       if (!portalParamStore.isLoading) {
//         portalParamStore.fetchReturnJobParamsfunc();
//       }
//     }
//   }, [open, rowData]);

//   const handleChange = (field, value) => {
//     setFormData(prevData => ({ ...prevData, [field]: value }));
//     handleValidation(value, field);
//   };

//   const handleValidation = (value, field) => {
//     if (!value) {
//       setValidationErrors(prev => ({ ...prev, [field]: `${field} is required` }));
//     } else {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   const handleSave = () => {
//     if (Object.keys(validationErrors).length === 0) {
//       console.log('Saving:', formData);
//       onClose();
//     }
//   };

//   const renderField = (field) => {
//     const { header, accessorKey, editVariant, storeKey } = field;
//     const options = storeKey ? portalParamStore[storeKey] || [] : [];

//     switch (editVariant) {
//       case 'select':
//         return (
//           <FormControl fullWidth key={accessorKey} error={!!validationErrors[accessorKey]}>
//             <InputLabel>{header}</InputLabel>
//             <Select
//               value={formData[accessorKey] || ''}
//               onChange={(e) => handleChange(accessorKey, e.target.value)}
//               label={header}
//             >
//               {options.map((option) => (
//                 <MenuItem key={option} value={option}>{option}</MenuItem>
//               ))}
//             </Select>
//             {validationErrors[accessorKey] && <span>{validationErrors[accessorKey]}</span>}
//           </FormControl>
//         );
//       case 'multiSelect':
//         return (
//           <FormControl fullWidth key={accessorKey} error={!!validationErrors[accessorKey]}>
//             <InputLabel>{header}</InputLabel>
//             <Select
//               multiple
//               value={formData[accessorKey] || []}
//               onChange={(e) => handleChange(accessorKey, e.target.value)}
//               renderValue={(selected) => selected.join(', ')}
//               label={header}
//             >
//               {options.map((option) => (
//                 <MenuItem key={option} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </Select>
//             {validationErrors[accessorKey] && <span>{validationErrors[accessorKey]}</span>}
//           </FormControl>
//         );
//       default:
//         return (
//           <TextField
//             key={accessorKey}
//             fullWidth
//             label={header}
//             value={formData[accessorKey] || ''}
//             onChange={(e) => handleChange(accessorKey, e.target.value)}
//             error={!!validationErrors[accessorKey]}
//             helperText={validationErrors[accessorKey]}
//           />
//         );
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md">
//       <DialogTitle>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <Avatar style={{ backgroundColor: "rgba(220,0,78)", marginRight: "10px" }}>
//             <NoteAddTwoTone />
//           </Avatar>
//           {rowData ? 'Edit' : 'Add'} Configuration
//         </div>
//       </DialogTitle>
//       <DialogContent>
//         {portalParamStore.isLoading ? (
//           <CircularProgress />
//         ) : (
//           fieldsConfig.map(renderField)
//         )}
//         {portalParamStore.error && <p>{portalParamStore.error}</p>}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//         <Button onClick={handleSave} color="primary" variant="contained" 
//                 disabled={Object.keys(validationErrors).length > 0}>
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// });

// export default EditDialog;





// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Grid
// } from '@mui/material';

// const EditDialog = ({ open, handleClose, rowData, columns, onSave }) => {
//   const [editedData, setEditedData] = useState(rowData);

//   const handleInputChange = (key, value) => {
//     setEditedData(prevData => ({
//       ...prevData,
//       [key]: value
//     }));
//   };

//   const handleSave = () => {
//     onSave(editedData);
//     handleClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle>Edit Row</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2}>
//           {columns.map(column => (
//             <Grid item xs={12} sm={6} key={column.accessorKey}>
//               <TextField
//                 fullWidth
//                 label={column.header}
//                 value={editedData[column.accessorKey] || ''}
//                 onChange={(e) => handleInputChange(column.accessorKey, e.target.value)}
//                 margin="normal"
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} color="primary">
//           Cancel
//         </Button>
//         <Button onClick={handleSave} color="primary">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditDialog;





import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const EditDialog = ({ open, onClose, onSave, rowData, headerMapper }) => {
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData);
    }
  }, [rowData]);

  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent>
        {Object.entries(editedData).map(([field, value]) => (
          headerMapper.isMapped(field) && (
            <TextField
              key={field}
              fullWidth
              label={headerMapper.getHeaderName(field)}
              value={value || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              margin="normal"
            />
          )
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
