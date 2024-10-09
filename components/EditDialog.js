// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Checkbox,
//   ListItemText,
// } from '@mui/material';
// import { observer } from 'mobx-react-lite';
// import portalParamStore from './portalParamStore';
// import { getFieldType, getFieldOptions } from './columnMapper';

// const EditDialog = observer(({ open, onClose, onSave, rowData, headerMapper }) => {
//   const [editedData, setEditedData] = useState({});

//   useEffect(() => {
//     if (rowData) {
//       setEditedData(rowData);
//     }
//     if (portalParamStore && typeof portalParamStore.fetchReturnJobParamsfunc === 'function') {
//       portalParamStore.fetchReturnJobParamsfunc();
//     } else {
//       console.error('fetchReturnJobParamsfunc is not a function or portalParamStore is undefined');
//     }
//   }, [rowData]);

//   const handleChange = (field, value) => {
//     setEditedData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSave = () => {
//     onSave(editedData);
//   };

//   const renderField = (field, value) => {
//     const fieldType = getFieldType(field);
//     const fieldOptions = getFieldOptions(field);

//     switch (fieldType) {
//       case 'text':
//         return (
//           <TextField
//             fullWidth
//             label={headerMapper.getHeaderName(field)}
//             value={value || ''}
//             onChange={(e) => handleChange(field, e.target.value)}
//             margin="normal"
//           />
//         );
//       case 'dropdown':
//         return (
//           <FormControl fullWidth margin="normal">
//             <InputLabel>{headerMapper.getHeaderName(field)}</InputLabel>
//             <Select
//               value={value || ''}
//               onChange={(e) => handleChange(field, e.target.value)}
//               label={headerMapper.getHeaderName(field)}
//             >
//               {fieldOptions.map((option) => (
//                 <MenuItem key={option} value={option}>{option}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         );
//       case 'multiselect':
//         return (
//           <FormControl fullWidth margin="normal">
//             <InputLabel>{headerMapper.getHeaderName(field)}</InputLabel>
//             <Select
//               multiple
//               value={Array.isArray(value) ? value : []}
//               onChange={(e) => handleChange(field, e.target.value)}
//               renderValue={(selected) => selected.join(', ')}
//               label={headerMapper.getHeaderName(field)}
//             >
//               {fieldOptions.map((option) => (
//                 <MenuItem key={option} value={option}>
//                   <Checkbox checked={Array.isArray(value) && value.indexOf(option) > -1} />
//                   <ListItemText primary={option} />
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Edit Row</DialogTitle>
//       <DialogContent>
//         {Object.entries(editedData).map(([field, value]) => (
//           headerMapper && typeof headerMapper.isMapped === 'function' && headerMapper.isMapped(field) && (
//             <React.Fragment key={field}>
//               {renderField(field, value)}
//             </React.Fragment>
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
// });

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
import dropdownStore from './dropdownStore';
import { getFieldType } from './columnMapper';

const EditDialog = observer(({ open, onClose, onSave, rowData, headerMapper }) => {
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData);
    }
    // Fetch data from portalParamStore
    if (typeof portalParamStore.fetchReturnJobParamsfunc === 'function') {
      portalParamStore.fetchReturnJobParamsfunc();
    } else {
      console.error('fetchReturnJobParamsfunc is not a function or portalParamStore is undefined');
    }
    // Fetch data from dropdownStore
    dropdownStore.fetchData('appCodes');
    dropdownStore.fetchData('domainCodes');
    dropdownStore.fetchData('sorCodes');
  }, [rowData]);

  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedData);
  };

  const getFieldOptions = (field) => {
    switch (field) {
      case 'aplctn_cd':
        return dropdownStore.getAppCodes();
      case 'domain_cd':
        return dropdownStore.getDomainCodes();
      case 'sor_cd':
        return dropdownStore.getSorCodes();
      case 'prmotn_flag':
        return portalParamStore.prmotn_flag;
      case 'ownrshp_team':
        return portalParamStore.ownrshp_team;
      case 'prcsng_type':
        return portalParamStore.prcsng_type;
      case 'load_type':
        return portalParamStore.load_type;
      default:
        return [];
    }
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

