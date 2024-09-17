import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';

// Define the header mapping class
class HeaderMapper {
  constructor() {
    this.headerMap = {
      aplctn_cd: 'Application Code',
      S3_bkt_Key_cmbntn: 'S3 Bucket Key Combination',
      clnt_id: 'Client ID',
      domain_cd: 'Domain Code',
      // Only columns defined here will appear in the table
    };
  }

  // Method to get the friendly header name or return the key itself if not found
  getHeaderName(key) {
    return this.headerMap[key] || null; // If the key is not in the map, return null
  }

  // Method to check if a key is present in the header map
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
  const [selectedRow, setSelectedRow] = useState(null); // State to track selected row

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
      .filter(name => headerMapper.isMapped(name)) // Filter out columns not in the header map
      .map(name => ({
        accessorKey: name,
        header: headerMapper.getHeaderName(name), // Use headerMapper to get friendly names
      }));
  }, [data, headerMapper]);

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowSelection // Enable row selection
      muiTableBodyRowProps={({ row }) => {
        if (!row) return {}; // Ensure row is defined
        return {
          onClick: () => setSelectedRow(row.index),
          selected: selectedRow === row.index, // Track selected row
          sx: {
            cursor: 'pointer',
            backgroundColor: selectedRow === row.index ? '#E0E0E0' : 'inherit', // Highlight selected row
          },
        };
      }}
    />
  );
};

export default DynamicTable;
