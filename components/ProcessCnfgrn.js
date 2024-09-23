import React, { useState } from 'react';
import DynamicTable from './DynamicTable';
import EditDialog from './EditDialog';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function ProcessingCnfgrn() {
    const apiUrl = 'http://';
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleEditClick = (rowData) => {
        setSelectedRow(rowData);
        setEditDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setEditDialogOpen(false);
        setSelectedRow(null);
    };

    return (
        <div className='test'>
            <h1>Processing Config Table</h1>
            <DynamicTable 
                apiUrl={apiUrl} 
                onRowClick={handleEditClick}
                renderTopToolbarCustomActions={() => (
                    <Button
                        color="primary"
                        onClick={() => handleEditClick({})}
                        variant="contained"
                        startIcon={<EditIcon />}
                    >
                        Add New
                    </Button>
                )}
            />
            <EditDialog 
                open={editDialogOpen} 
                onClose={handleCloseDialog} 
                rowData={selectedRow}
            />
        </div>
    );
}

export default ProcessingCnfgrn;
