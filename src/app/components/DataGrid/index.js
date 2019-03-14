import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Clearfix } from 'react-bootstrap';
import { setTimeout } from 'timers';
import isequal from 'lodash/isEqual';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';
import { connect } from 'react-redux';

import appConstants from './constants';
import {
  prepareEditRow,
  revertUnModifiedRows,
  rowEditableStatus,
} from './editHelper';

class DataGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasFailed: false,
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if (!isequal(this.props, nextProps) && this.gridApi) {
      if (nextProps && nextProps.lockedEntities) {
        this.gridApi.gridOptionsWrapper.gridConfig.lockedEntities =
          nextProps.lockedEntities;
      }
      if (!isequal(this.props.data, nextProps.data)) {
        this.gridApi.setRowData(nextProps.data);
      }
    }
  }
  componentWillUnmount() {}
  onReady = ({ api }) => {
    this.gridApi = api;
  };
  onResize = () => {
    if (this.gridApi) {
      // this.gridApi.sizeColumnsToFit();
    }
  };
  onRender = () => {};
  onRowEditingStarted = (grid) => {
    if (
      this.props.onGridEditStart &&
      typeof this.props.onGridEditStart === 'function'
    ) {
      const { keyColumn, entityName } = grid.api.gridOptionsWrapper.gridConfig;
      if (entityName && rowEditableStatus(grid)) {
        prepareEditRow(grid);
        this.props.onGridEditStart(grid);
      } else {
        grid.api.stopEditing();
      }
    }
  };
  onRowEditingStopped = (grid) => {
    if (
      this.props.onGridEditStop &&
      typeof this.props.onGridEditStop === 'function'
    ) {
      const { keyColumn, entityName } = grid.api.gridOptionsWrapper.gridConfig;
      const { editedRowsData } = grid.api.gridOptionsWrapper.gridConfig;
      if (entityName) {
        revertUnModifiedRows(grid);
        const {
          editedRowsData: finalEditedRows,
        } = grid.api.gridOptionsWrapper.gridConfig;

        setTimeout(() => {
          grid.api.refreshCells({ force: true });
        }, 1000);
        // this.props.GridEditStop([
        //   {
        //     EntityName: entityName,
        //     EntityId: grid.data[keyColumn],
        //     IsLocked: false
        //   }
        // ]);

        this.props.onGridEditStop(grid);
      }
    }
  };
  onSelectionChanged = () => {
    const selectedRow = this.gridApi.getSelectedRows();
    this.props.onSelection(selectedRow);
  };
  setRowHeight = () => 30;

  clearData() {
    console.log('clear');
  }
  render() {
    return (
      <Clearfix>
        <div className="ag-fresh">
          <div
            ref={(input) => {
              this.gridWrapper = input;
            }}
          >
            <AgGridReact
              onGridReady={this.onReady}
              getRowHeight={e => this.setRowHeight(e)}
              enableSorting
              enableFilter
              suppressMovableColumns
              enableColResize="true"
              deltaRowDataMode="true"
              rowHeight={appConstants.GRID_ROW_HEIGHT}
              headerHeight={appConstants.GRID_HEADER_HEIGHT}
              onRowDoubleClicked={this.onRowEditingStarted}
              onSelectionChanged={this.onSelectionChanged}
              onRowEditingStopped={this.onRowEditingStopped}
              floatingRowHeight={appConstants.GRID_ROW_HEIGHT}
              overlayLoadingTemplate={` <div className="rmt-loader">
                                        <div className="icon-loading animate-spin" />{' '}
                                     </div>`}
              overlayNoRowsTemplate={`<span class="grid-messenge-container">
                                      <span class="msg"><h4>No Data Available.</h4></span>
                                    </span>`}
              {...this.props}
            />
            {this.state.hasFailed ? <h3>Spmething went wrong !</h3> : null}
          </div>
        </div>
      </Clearfix>
    );
  }
}

export default connect(null)(DataGrid);
