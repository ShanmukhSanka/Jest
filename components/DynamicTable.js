import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
    setSelectedRowIds(updatedSelection);
  };

  const handleRowClick = (row) => {
    setSelectedRowIds((prev) => {
      const newSelection = { ...prev };
      if (newSelection[row.id]) {
        delete newSelection[row.id];
      } else {
        newSelection[row.id] = true;
      }
      return newSelection;
    });
  };

  const renderTopToolbarCustomActions = ({ table }) => {
    const handleDelete = () => {
      const selectedRows = table.getSelectedRowModel().flatRows;
      if (selectedRows.length > 0) {
        console.log('Rows to delete:', selectedRows.map(row => row.id));
        // Logic to delete selected rows can go here
      }
    };

    return (
      <Button
        variant="contained"
        color={table.getSelectedRowModel().flatRows.length > 0 ? 'error' : 'secondary'}
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
        disabled={table.getSelectedRowModel().flatRows.length === 0}
      >
        Delete
      </Button>
    );
  };

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowSelection
      onRowSelectionChange={handleRowSelectionChange}
      state={{ rowSelection: selectedRowIds }}
      muiTableBodyRowProps={({ row }) => ({
        onClick: (event) => {
          event.stopPropagation();
          handleRowClick(row);
        },
        selected: !!selectedRowIds[row.id],
        sx: {
          cursor: 'pointer',
          backgroundColor: selectedRowIds[row.id] ? '#E0E0E0' : 'inherit',
        },
      })}
      renderTopToolbarCustomActions={renderTopToolbarCustomActions}
    />
  );
};

export default DynamicTable;
