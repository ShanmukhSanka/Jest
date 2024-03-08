import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Custom cell renderer component that includes buttons
const ButtonCellRenderer = (params) => {
  return (
    <>
      <button data-testid="gridButton">Button 1</button>
      <button data-testid="gridButton">Button 2</button>
    </>
  );
};

describe('AG Grid Button Count Test', () => {
  test('AG Grid should have exactly 2 buttons in a cell', () => {
    const columnDefs = [
      {
        headerName: 'Actions',
        cellRendererFramework: ButtonCellRenderer,
      },
    ];
    const rowData = [{ id: 1 }]; // Minimal row data to ensure the grid renders

    render(
      <div className="ag-theme-alpine" style={{ height: 150, width: 600 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          domLayout='autoHeight'
        />
      </div>
    );

    const buttons = screen.getAllByTestId('gridButton');
    expect(buttons).toHaveLength(2);
  });
});
