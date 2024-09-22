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
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows

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

  // Handle row selection
  const handleRowSelectionChange = (selectedRowKeys) => {
    setSelectedRows(selectedRowKeys); // Update selected rows
  };

  // Handle delete action
  const handleDelete = () => {
    if (selectedRows.length > 0) {
      console.log('Rows to delete:', selectedRows);
      // Logic to delete selected rows can go here
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
        disabled={selectedRows.length === 0} // Disable button if no rows are selected
        style={{ marginBottom: '10px' }}
      >
        Delete
      </Button>

      {/* Material React Table */}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowSelection // Enable row selection
        onRowSelectionChange={handleRowSelectionChange} // Track selected rows
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            const isSelected = selectedRows.includes(row.index);
            const newSelectedRows = isSelected
              ? selectedRows.filter(idx => idx !== row.index) // Deselect if already selected
              : [...selectedRows, row.index]; // Select if not already selected
            setSelectedRows(newSelectedRows);
          },
          selected: selectedRows.includes(row.index), // Highlight selected row
          sx: {
            cursor: 'pointer',
            backgroundColor: selectedRows.includes(row.index)
              ? '#E0E0E0'
              : 'inherit', // Highlight selected row
          },
        })}
      />
    </>
  );
};

export default DynamicTable;
