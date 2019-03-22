import React from 'react';
import { connect } from 'react-redux';
import GridConfig from './gridConfig';
import DataGrid from '../../DataGrid/index';
import Fields from '../../../constants/Fields';
import loadash from 'lodash';
import { applyFilters } from '../../Utils';

import './index.scss';

class AppInfoGrid extends React.Component {
  constructor(props) {
    super(props);
    this.grid = new GridConfig();
    this.grid.config.editedRowsData = {};
  }

  componentDidMount() {
    /*
    if (this.props.sampleData && this.props.sampleData.AssignmentData) {
      const { data } = this.props.sampleData.AssignmentData;
      this.loadData(data);
    }
    */
  }

  onDataGridReady(api) {
    this.api = api;
    // Events.emit(`getGridAPI_${this.grid.config.gridName}`, api);
  }

  getRowNodeId = data => data[Fields.EQUIPMENT_TYPE];

  render() {
    return (
      <div className="view-container">
        <DataGrid
          columnDefs={this.grid.config.columns}
          defaultColDef={this.grid.config.defaultColDef}
          rowData={this.props.data}
          gridOptions={this.grid.config.gridOptions}
          getRowNodeId={this.getRowNodeId}
          config={this.grid.config}
        />
      </div>
    );
  }
}

function mapStateToProps({ sampleData }) {
  return {
    sampleData,
  };
}

export default connect(mapStateToProps)(AppInfoGrid);
