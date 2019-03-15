import React from 'react';
import { Checkbox } from 'react-bootstrap';
import GanttChart from '../Gantt';
import GridComponent from '../grids/StandsAssignmentsGrid';

import './index.scss';

const ViewType = {
  GRID: 'GRID',
  GANTT: 'GANTT',
};

class GateManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedViewType: ViewType.GANTT,
    };
  }

  toggleView = (selectedViewType) => {
    this.setState({ selectedViewType });
  };

  render() {
    const { selectedViewType } = this.state;
    const selectionClass = v => (v === selectedViewType ? 'selected-btn' : '');
    return (
      <div className="main-area" >
        <div className="main-content-header-area" >
          <div className="app-title">
            <span className="title">Gate Manager</span>
          </div>
          <div className="btn-panel-right pull-right">
            <i className={`fa fa-th ${selectionClass(ViewType.GANTT)}`} onClick={() => this.toggleView(ViewType.GANTT)} />
            <i className={`fa fa-list-alt ${selectionClass(ViewType.GRID)}`} onClick={() => this.toggleView(ViewType.GRID)} />
          </div>
        </div>
        {
          selectedViewType === ViewType.GANTT ?
          (<GanttChart className="main-content-area" />) :
          (<GridComponent />)
        }
      </div>
    );
  }
}

export default GateManager;
