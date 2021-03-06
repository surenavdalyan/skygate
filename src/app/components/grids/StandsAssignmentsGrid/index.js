import React from 'react';
import { connect } from 'react-redux';
import GridConfig from './gridConfig';
import DataGrid from '../../DataGrid/index';
import Fields from '../../../constants/Fields';
import loadash from 'lodash';
import { applyFilters } from '../../Utils';

import './index.scss';

class AssignmentsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.grid = new GridConfig();
    this.grid.config.editedRowsData = {};
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    if (this.props.sampleData && this.props.sampleData.AssignmentData) {
      const { data } = this.props.sampleData.AssignmentData;
      this.loadData(data);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.sampleData && !loadash.isEqual(this.props.sampleData, prevProps.sampleData)) {
      const { data } = this.props.sampleData.AssignmentData;
      this.loadData(data);
      return;
    }
    if (this.props.filters && !loadash.isEqual(this.props.filters, prevProps.filters)) {
      const { data } = this.props.sampleData.AssignmentData;
      this.loadData(data);
      return;
    }
  }

  onDataGridReady(api) {
    this.api = api;
    // Events.emit(`getGridAPI_${this.grid.config.gridName}`, api);
  }

  onSelectionChanged = (row) => {
    console.log('Selected Row', row);
  };
  onEdit = () => {
    console.log('onEdit');
  };


  rowDoubleClicked = (grid) => {
    // const { keyColumn, entityName } = grid.api.gridOptionsWrapper.gridConfig;
  };

  onStopEditing = () => {
  };

  getRowNodeId = data => data[Fields.EQUIPMENT_TYPE];

  loadData = (data) => {
    const filteredData = applyFilters(data, this.props.filters);
    if (!loadash.isEqual(filteredData, this.state.data)) {
      this.setState({ data: filteredData });
      // this.forceUpdate();
    }
  };

  render() {
    return (
      <div className="view-container">
        <DataGrid
          columnDefs={this.grid.config.columns}
          defaultColDef={this.grid.config.defaultColDef}
          rowData={this.state.data}
          filters={this.props.filters}
          gridOptions={this.grid.config.gridOptions}
          getRowNodeId={this.getRowNodeId}
          config={this.grid.config}
        />
      </div>
    );
  }
}

function mapStateToProps({ sampleData, filters }) {
  return {
    sampleData, filters,
  };
}

export default connect(mapStateToProps)(AssignmentsGrid);
