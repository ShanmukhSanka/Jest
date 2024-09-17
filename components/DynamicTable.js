import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

// Define the header mapping class
class HeaderMapper {
  constructor() {
    this.headerMap = {
      Aplctn_cd: 'Application Code',
      S3_bkt_Key_cmbntn: 'S3 Bucket Key Combination',
      Clnt_id: 'Client ID',
      Domain_cd: 'Domain Code',
      // You can add more mappings as required
    };
  }

  // Method to get the friendly header name or return the key itself if not found
  getHeaderName(key) {
    return this.headerMap[key] || key;
  }
}

const DynamicTable = ({ apiUrl }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const tableData = response.data;
        console.log(tableData, 'tableData');

        // Transform the data as necessary
        const transformedData = tableData.map(item =>
          Object.fromEntries(
            Object.entries(item).map(([key, value]) => [key, value.String])
          )
        );
        console.log(transformedData, 'transformedData');
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };
    fetchTableData();
  }, [apiUrl]);

  // Create an instance of the HeaderMapper class
  const headerMapper = useMemo(() => new HeaderMapper(), []);

  // Define columns with friendly names
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const columnNames = Object.keys(data[0] || {});

    return columnNames.map(name => ({
      accessorKey: name,
      header: headerMapper.getHeaderName(name), // Use headerMapper to get friendly names
    }));
  }, [data, headerMapper]);

  const table = useMaterialReactTable({
    columns: columns,
    data: data,
  });

  return (
    <MaterialReactTable
      table={table}
    />
  );
};

export default DynamicTable;
