import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Form, Modal } from 'react-bootstrap';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Table = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  const [radioChecked, setRadioChecked] = useState(false);

  const columns = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Date', field: 'date', sortable: true, filter: true },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Age', field: 'age', sortable: true, filter: true },
    { headerName: 'Member ID', field: 'memberId', sortable: true, filter: true }
  ];

  const rowData = [
    { id: 1, date: '2024-02-01', name: 'John Doe', age: 28, memberId: 'M123' },
    { id: 2, date: '2024-02-02', name: 'Jane Smith', age: 32, memberId: 'M124' },
    { id: 3, date: '2024-02-03', name: 'Alice Johnson', age: 24, memberId: 'M125' }
  ];

  const generateSqlQuery = (data) => {
    const conditions = columns.map(col => `${col.headerName.replace(/\s+/g, '')} = '${data[col.field]}'`).join(' AND ');
    return `SELECT * FROM ABCD WHERE ${conditions}`;
  };

  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedRowData = selectedData.length > 0 ? selectedData[0] : null;
    setSelectedRow(selectedRowData);
    if (selectedRowData) {
      const query = generateSqlQuery(selectedRowData);
      setSqlQuery(query);
      setRadioChecked(true); 
    }
  };

  const handleRadioChange = (e) => {
    setRadioChecked(e.target.checked);
    if (e.target.checked && sqlQuery) {
      setShowModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery).then(() => {
      alert('SQL Query copied to clipboard!');
    }, () => {
      alert('Failed to copy SQL Query.');
    });
  };

  
  useEffect(() => {
    if (!showModal) {
      setRadioChecked(false);
    }
  }, [showModal]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Form.Group style={{ textAlign: 'right', padding: '10px 0' }}>
        <Form.Check
          type="radio"
          label="SQL Query"
          name="sqlQueryRadio"
          id="sqlQueryRadio"
          checked={!radioChecked}
          onChange={handleRadioChange}
        />
      </Form.Group>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>SQL Query</Modal.Title>
          <svg onClick={copyToClipboard} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16" style={{ cursor: 'pointer', position: 'absolute', top: '15px', right: '70px' }}>
            <path d="M10.5 0a.5.5 0 0 1 .5.5H11v1h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1v-.5a.5.5 0 0 1 .5-.5h5zM11 2v1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h1V2h5z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5V2h-5v-.5a.5.5 0 0 1 .5-.5h4z"/>
          </svg>
        </Modal.Header>
        <Modal.Body>
          {sqlQuery}
        </Modal.Body>
      </Modal>

      <div className='ag-theme-alpine' style={{ height: 200, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          rowSelection="single"
          onSelectionChanged={onSelectionChanged}
          enableClipboard={true}
        />
      </div>
    </div>
  );
};

export default Table;
