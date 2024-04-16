import React, { useState } from 'react';
import { Form, Button, Alert, Dropdown } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import Table from './Table';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showUser, setShowUser] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [selectedDropdown1, setSelectedDropdown1] = useState('');
  const [dropdown2Enabled, setDropdown2Enabled] = useState(false);

  const src_frmt_parms = `{
    "dropdown1Options": [
      {"label": "Option 1", "value": "option1"},
      {"label": "Option 2", "value": "option2"},
      {"label": "Option 3", "value": "option3"}
    ],
    "dropdown2Options": [
      {"label": "Choice 1", "value": "choice1"},
      {"label": "Choice 2", "value": "choice2"},
      {"label": "Choice 3", "value": "choice3"}
    ]
  }`;

  // Parse JSON to get options for both dropdowns
  const { dropdown1Options, dropdown2Options } = JSON.parse(src_frmt_parms);

  const handleSubmit = (e) => {
    setShowUser(false);
    e.preventDefault();
    if (validateEmail(email)) {
      setShowUser(true);
      setRowData([...rowData, { email }]);
      setError('');
      return;
    }
    setError('Email is not valid');
    return false;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setShowUser(false);
    setSelectedDropdown1('');
    setDropdown2Enabled(false);
  };

  const columns = [
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
  ];

  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, padding: 20 }}>
        <Dropdown style={{ marginBottom: 10 }}>
          <Dropdown.Toggle variant="success" id="dropdown-basic-1" data-testid="dropdown1-toggle">
            Dropdown 1
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {dropdown1Options.map((option, index) => (
              <Dropdown.Item key={index} onClick={() => {
                setSelectedDropdown1(option.value);
                setDropdown2Enabled(true);
              }}>
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic-2" disabled={!dropdown2Enabled} data-testid="dropdown2-toggle">
            Dropdown 2
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {dropdown2Options.map((option, index) => (
              <Dropdown.Item key={index} disabled={!dropdown2Enabled}>
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div style={{ marginTop: 60 }}>
        <h2>We will Test the Login Form Component</h2>
        {showUser && (
          <Alert data-testid='user' variant='success'>
            {email}
          </Alert>
        )}
        {error && (
          <Alert data-testid='error' variant='danger'>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button data-testid="submit" variant="primary" type="submit">
            Submit
          </Button>
          <Button
            variant="secondary"
            data-testid="reset"
            onClick={resetForm}
            style={{ marginLeft: "5px" }}
          >

            Reset
          </Button>
        </Form>

        <Table rowData={rowData} />

        <div className='ag-theme-alpine' style={{ height: 200, width: '100%' }}>
          <AgGridReact rowData={rowData} columnDefs={columns} />
        </div>
      </div>
    </>
  );
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return regex.test(email);
};

export default Login;
