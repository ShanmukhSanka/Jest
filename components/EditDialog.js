import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText } from '@mui/material';
import { observer } from 'mobx-react-lite';
import portalParamStore from './PortalParamStore';

const dropdownFields = ['domain_cd', 'aplctn_cd'];
const multiSelectFields = ['ownrshp_team'];
const textFields = ['clnt_id', 'S3_bkt_Key_cmbntn'];

const EditDialog = observer(({ open, onClose, rowData }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (open && rowData) {
      setFormData(rowData);
    }
  }, [open, rowData]);

  const handleChange = (field, value) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving:', formData);
    onClose();
  };

  const renderField = (field) => {
    if (dropdownFields.includes(field)) {
      const options = portalParamStore[field] || [];
      return (
        <FormControl fullWidth key={field}>
          <InputLabel>{field}</InputLabel>
          <Select
            value={formData[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            label={field}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else if (multiSelectFields.includes(field)) {
      const options = portalParamStore[field] || [];
      return (
        <FormControl fullWidth key={field}>
          <InputLabel>{field}</InputLabel>
          <Select
            multiple
            value={formData[field] || []}
            onChange={(e) => handleChange(field, e.target.value)}
            renderValue={(selected) => selected.join(', ')}
            label={field}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={(formData[field] || []).indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else {
      return (
        <TextField
          key={field}
          fullWidth
          label={field}
          value={formData[field] || ''}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{rowData ? 'Edit' : 'Add'} Configuration</DialogTitle>
      <DialogContent>
        {[...dropdownFields, ...multiSelectFields, ...textFields].map(renderField)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
});

export default EditDialog;
