import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { Button } from '@mui/material'; // Material UI Button
import DeleteIcon from '@mui/icons-material/Delete'; // Delete Icon

// Define the header mapping class
class HeaderMapper {
  constructor() {
    this.headerMap = {
      aplctn_cd: 'Application Code',
      S3_bkt_Key_cmbntn: 'S3 Bucket Key Combination',
      clnt_id: 'Client ID',
      domain_cd: 'Domain Code',
    };
  }

  getHeaderName(key) {
    return this.headerMap[key] || key;
  }

  isMapped(key) {
    return this.headerMap.hasOwnProperty(key);
  }
}

const extractNestedValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return value.String || value.Int64 || value.Float64 || JSON.stringify(value);
  }
  return value;
};

const DynamicTable = ({ apiUrl }) => {
  const [data, setData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({}); // Track selected row IDs

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const tableData = response.data;

        const transformedData = tableData.map(item =>
          Object.fromEntries(
            Object.entries(item).map(([key, value]) => [
              key,
              extractNestedValue(value),
            ])
          )
        );
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };
    fetchTableData();
  }, [apiUrl]);

  const headerMapper = useMemo(() => new HeaderMapper(), []);

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const columnNames = Object.keys(data[0] || {});

    return columnNames
      .filter(name => headerMapper.isMapped(name))
      .map(name => ({
        accessorKey: name,
        header: headerMapper.getHeaderName(name),
      }));
  }, [data, headerMapper]);

  // Handle delete action
  const handleDelete = () => {
    const selectedRowIndices = Object.keys(selectedRowIds); // Get the selected row indices
    if (selectedRowIndices.length > 0) {
      const remainingData = data.filter((_, index) => !selectedRowIndices.includes(index.toString())); // Filter out selected rows
      setData(remainingData); // Update the table with remaining rows
      setSelectedRowIds({}); // Clear the selection after deletion
    }
  };

  // Handle row selection change
  const handleRowSelectionChange = (rowSelection) => {
    // Toggle the selected row when checkbox is clicked
    setSelectedRowIds(prevSelectedRowIds => ({
      ...prevSelectedRowIds,
      ...rowSelection,
    }));
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Add a Delete button aligned to the left */}
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />} // Delete icon
        onClick={handleDelete} // Call delete handler on click
        disabled={Object.keys(selectedRowIds).length === 0} // Disable button if no rows are selected
        style={{
          position: 'absolute', // Fix the position
          left: '0', // Align to the left
          top: '0', // Fix to the top
          marginBottom: '10px',
        }}
      >
        Delete
      </Button>

      <div style={{ marginTop: '50px' }}> {/* Add margin so table doesn’t overlap button */}
        <MaterialReactTable
          columns={columns}
          data={data}
          enableRowSelection // Enable row selection with checkboxes
          onRowSelectionChange={handleRowSelectionChange} // Track selected rows automatically
          state={{ selectedRowIds }} // Provide the selected row state
          getRowId={(row) => row.index} // Ensure proper row indexing
        />
      </div>
    </div>
  );
};

export default DynamicTable;
