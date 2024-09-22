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

  return (
    <>
      {/* Add a Delete button */}
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />} // Delete icon
        onClick={handleDelete} // Call delete handler on click
        disabled={Object.keys(selectedRowIds).length === 0} // Disable button if no rows are selected
        style={{ marginBottom: '10px' }}
      >
        Delete
      </Button>

      {/* Material React Table */}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowSelection // Enable row selection with checkboxes
        onRowSelectionChange={setSelectedRowIds} // Track selected rows automatically
        state={{ selectedRowIds }} // Provide the selected row state
        getRowId={(row) => row.index} // Ensure proper row indexing
        muiTableBodyRowProps={({ row }) => ({
          selected: !!selectedRowIds[row.id], // Highlight selected row
          sx: {
            cursor: 'pointer',
            backgroundColor: selectedRowIds[row.id] ? '#E0E0E0' : 'inherit', // Highlight selected row
          },
        })}
      />
    </>
  );
};

export default DynamicTable;
