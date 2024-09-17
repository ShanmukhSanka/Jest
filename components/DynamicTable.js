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
      // Add more mappings as required
    };
  }

  // Method to get the friendly header name or return the key itself if not found
  getHeaderName(key) {
    return this.headerMap[key] || key; // Fallback to original name if not mapped
  }
}

const extractNestedValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    // Check for different types like String, Int64, Float64 and extract their values
    return value.String || value.Int64 || value.Float64 || JSON.stringify(value);
  }
  return value;
};

const DynamicTable = ({ apiUrl }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const tableData = response.data;

        // Transform the data, extracting the correct value from any nested object
        const transformedData = tableData.map(item =>
          Object.fromEntries(
            Object.entries(item).map(([key, value]) => [
              key,
              extractNestedValue(value), // Extract the correct value for each nested object
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

  // Create an instance of the HeaderMapper class
  const headerMapper = useMemo(() => new HeaderMapper(), []);

  // Define columns with friendly names
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const columnNames = Object.keys(data[0] || {});

    return columnNames.map(name => ({
      accessorKey: name, // Keep the key for data access
      header: headerMapper.getHeaderName(name), // Use headerMapper to get friendly names
    }));
  }, [data, headerMapper]);

  return (
    <MaterialReactTable
      columns={columns} // Ensure columns are explicitly passed
      data={data} // Pass transformed data
    />
  );
};

export default DynamicTable;
