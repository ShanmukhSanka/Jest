import React, { useState, useEffect } from 'react';
import DynamicTable from './DynamicTable';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import portalParamStore from '../stores/PortalParamStore'; // Import your store

function ProcessingCnfgrn() {
    const apiUrl = 'http://';
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState({});
    const [dropdownOptions, setDropdownOptions] = useState({
        applicationCodes: [],
        domainCodes: [],
    });

    useEffect(() => {
        const fetchParams = async () => {
            await portalParamStore.fetchReturnJobParamsfunc();
            setDropdownOptions({
                applicationCodes: portalParamStore.ownrshp_team, // Example for fetching application codes
                domainCodes: portalParamStore.prmotn_flag, // Example for fetching domain codes
            });
        };
        fetchParams();
    }, []);

    const handleEditClick = (rowData) => {
        setSelectedRowData(rowData);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRowData({});
    };

    const handleSave = () => {
        // Implement save logic here
        console.log("Saved data:", selectedRowData);
        handleCloseDialog();
    };

    const handleDropdownChange = (field, value) => {
        setSelectedRowData({ ...selectedRowData, [field]: value });
    };

    return (
        <div className='test'>
            <h1> Processing Config Table</h1>
            <DynamicTable apiUrl={apiUrl} onEditClick={handleEditClick} />

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Edit Configuration</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Application Code"
                        value={selectedRowData.aplctn_cd || ''}
                        onChange={(e) => handleDropdownChange('aplctn_cd', e.target.value)}
                        fullWidth
                    >
                        {dropdownOptions.applicationCodes.map((code) => (
                            <MenuItem key={code} value={code}>
                                {code}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Domain Code"
                        value={selectedRowData.domain_cd || ''}
                        onChange={(e) => handleDropdownChange('domain_cd', e.target.value)}
                        fullWidth
                    >
                        {dropdownOptions.domainCodes.map((code) => (
                            <MenuItem key={code} value={code}>
                                {code}
                            </MenuItem>
                        ))}
                    </TextField>
                    {/* Add other text fields here */}
                    <TextField
                        label="Client ID"
                        value={selectedRowData.clnt_id || ''}
                        onChange={(e) => setSelectedRowData({ ...selectedRowData, clnt_id: e.target.value })}
                        fullWidth
                    />
                    {/* Add more fields as needed */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProcessingCnfgrn;
