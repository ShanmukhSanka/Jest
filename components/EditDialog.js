// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from '@mui/material';

// const EditDialog = ({ open, onClose, onSave, rowData, headerMapper }) => {
//   const [editedData, setEditedData] = useState({});

//   useEffect(() => {
//     if (rowData) {
//       setEditedData(rowData);
//     }
//   }, [rowData]);

//   const handleChange = (field, value) => {
//     setEditedData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSave = () => {
//     onSave(editedData);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Edit Row</DialogTitle>
//       <DialogContent>
//         {Object.entries(editedData).map(([field, value]) => (
//           headerMapper.isMapped(field) && (
//             <TextField
//               key={field}
//               fullWidth
//               label={headerMapper.getHeaderName(field)}
//               value={value || ''}
//               onChange={(e) => handleChange(field, e.target.value)}
//               margin="normal"
//             />
//           )
//         ))}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import portalParamStore from './portalParamStore';
import { getFieldType, getFieldOptions } from './columnMapper';

const EditDialog = observer(({ open, onClose, onSave, rowData, headerMapper }) => {
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData);
    }
    if (portalParamStore && typeof portalParamStore.fetchReturnJobParamsfunc === 'function') {
      portalParamStore.fetchReturnJobParamsfunc();
    } else {
      console.error('fetchReturnJobParamsfunc is not a function or portalParamStore is undefined');
    }
  }, [rowData]);

  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedData);
  };

  const renderField = (field, value) => {
    const fieldType = getFieldType(field);
    const fieldOptions = getFieldOptions(field);

    switch (fieldType) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={headerMapper.getHeaderName(field)}
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            margin="normal"
          />
        );
      case 'dropdown':
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>{headerMapper.getHeaderName(field)}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              label={headerMapper.getHeaderName(field)}
            >
              {fieldOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'multiselect':
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>{headerMapper.getHeaderName(field)}</InputLabel>
            <Select
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => handleChange(field, e.target.value)}
              renderValue={(selected) => selected.join(', ')}
              label={headerMapper.getHeaderName(field)}
            >
              {fieldOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={Array.isArray(value) && value.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent>
        {Object.entries(editedData).map(([field, value]) => (
          headerMapper && typeof headerMapper.isMapped === 'function' && headerMapper.isMapped(field) && (
            <React.Fragment key={field}>
              {renderField(field, value)}
            </React.Fragment>
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
});

export default EditDialog;
