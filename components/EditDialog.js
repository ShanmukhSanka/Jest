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

const EditDialog = observer(({ open, onClose, onSave, rowData, headerMapper }) => {
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData);
    }
    portalParamStore.fetchReturnJobParamsfunc();
  }, [rowData]);

  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedData);
  };

  const renderField = (field, value) => {
    switch (field) {
      case 'aplctn_cd':
        return (
          <TextField
            fullWidth
            label={headerMapper.getHeaderName(field)}
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            margin="normal"
          />
        );
      case 'S3_bkt_Key_cmbntn':
        return (
          <TextField
            fullWidth
            label={headerMapper.getHeaderName(field)}
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            margin="normal"
          />
        );
      case 'clnt_id':
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>{headerMapper.getHeaderName(field)}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              label={headerMapper.getHeaderName(field)}
            >
              {portalParamStore.ownrshp_team.map((team) => (
                <MenuItem key={team} value={team}>{team}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'domain_cd':
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
              {portalParamStore.prcsng_type.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox checked={value.indexOf(type) > -1} />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return (
          <TextField
            fullWidth
            label={headerMapper.getHeaderName(field)}
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            margin="normal"
          />
        );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent>
        {Object.entries(editedData).map(([field, value]) => (
          headerMapper.isMapped(field) && (
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
