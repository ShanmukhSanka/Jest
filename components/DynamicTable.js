import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// HeaderMapper class remains unchanged

const extractNestedValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return value.String || value.Int64 || value.Float64 || JSON.stringify(value);
  }
  return value;
};

const DynamicTable = ({ apiUrl }) => {
  const [data, setData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});

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

  const handleRowSelectionChange = (updatedSelection) => {
    setSelectedRowIds(prev => {
      const newSelection = { ...prev };
      Object.keys(updatedSelection).forEach(rowId => {
        if (updatedSelection[rowId]) {
          if (newSelection[rowId]) {
            delete newSelection[rowId]; // Uncheck if already selected
          } else {
            newSelection[rowId] = true; // Check if not selected
          }
        } else {
          delete newSelection[rowId]; // Remove from selection if unchecked
        }
      });
      return newSelection;
    });
  };

  const handleDelete = () => {
    const selectedRowIndices = Object.keys(selectedRowIds);
    if (selectedRowIndices.length > 0) {
      console.log('Rows to delete:', selectedRowIndices);
      // Logic to delete selected rows can go here
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
        disabled={Object.keys(selectedRowIds).length === 0}
        style={{ marginBottom: '10px' }}
      >
        Delete
      </Button>

      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowSelection
        onRowSelectionChange={handleRowSelectionChange}
        state={{ rowSelection: selectedRowIds }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            handleRowSelectionChange({ [row.id]: !selectedRowIds[row.id] });
          },
          selected: !!selectedRowIds[row.id],
          sx: {
            cursor: 'pointer',
            backgroundColor: selectedRowIds[row.id] ? '#E0E0E0' : 'inherit',
          },
        })}
      />
    </>
  );
};

export default DynamicTable;
