import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import dropdownStore from "./TStore";
import {
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Avatar,
  CircularProgress,
  DialogContentText,
} from "@mui/material";
import { NoteAddTwoTone } from "@material-ui/icons";

// Configuration for dynamic fields
const fieldsConfig = [
  { header: "Target Platform", accessorKey: "trgt_pltfrm", editVariant: "select" },
  { header: "Source File Type", accessorKey: "src_file_type", editVariant: "select" },
  { header: "Consumption Key", accessorKey: "s3_cnsptn_key", editVariant: "text" },
  // Add other fields here as needed
];

const TestEditDialog = observer(({ open, handleClose, row }) => {
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dropdownStore.fetchAppCodesFunc();
    dropdownStore.fetchSorCodesFunc();
  }, []);

  const getValue = (obj, path) =>
    path.split(".").reduce((prev, curr) => (prev ? prev[curr] : null), obj);
    
  let values = row !== null ? row?.original : {};

  // Handle validation dynamically
  const handleValidation = (value, column) => {
    if (!value) {
      setValidationErrors((prev) => ({
        ...prev,
        [column.accessorKey]: `${column.header} is required`,
      }));
    } else {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[column.accessorKey];
        return newErrors;
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
    >
      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <Avatar style={{ backgroundColor: "rgba(220,0,78)" }}>
          <NoteAddTwoTone />
        </Avatar>
      </div>
      <DialogContent>
        <DialogContentText>Edit your Record</DialogContentText>
        {dropdownStore.isLoading ? (
          <CircularProgress />
        ) : (
          fieldsConfig.map((column) => (
            <TextField
              key={column.accessorKey}
              id={column.accessorKey}
              name={column.accessorKey}
              label={column.header}
              variant="outlined"
              margin="normal"
              fullWidth
              select={column.editVariant === "select"}
              error={!!validationErrors[column.accessorKey]}
              helperText={validationErrors[column.accessorKey] || ""}
              value={getValue(values, column.accessorKey) || ""}
              onChange={(event) => handleValidation(event.target.value, column)}
            >
              {column.editVariant === "select" &&
                dropdownStore.fetchAppCodes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </TextField>
          ))
        )}
        {dropdownStore.error && <p>{dropdownStore.error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button variant="contained" color="primary" disabled={true}>
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default TestEditDialog;
