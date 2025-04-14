import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import axios from 'axios';

const EmailAlertDialog = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    mail_from: '',
    mail_to: '',
    sbjct: '',
    bdy: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        etl_stp_parms: {
          mail_from: formData.mail_from,
          mail_to: formData.mail_to,
          sbjct: formData.sbjct,
          bdy: formData.bdy
        }
      };

      const response = await axios.post('https://your-api-gateway-url.amazonaws.com/prod/your-lambda', payload);
      console.log('Email Sent Successfully:', response.data);
      handleClose();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Send Email Alert</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="mail_from"
          label="From"
          fullWidth
          variant="outlined"
          value={formData.mail_from}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="mail_to"
          label="To (comma-separated)"
          fullWidth
          variant="outlined"
          value={formData.mail_to}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="sbjct"
          label="Subject"
          fullWidth
          variant="outlined"
          value={formData.sbjct}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="bdy"
          label="Body"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={formData.bdy}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Send Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailAlertDialog;
