import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import FilterPane from '../../components/FilterPane';
import GanttChart from '../../components/Gantt';
import GridComponent from '../../components/grids/StandsAssignmentsGrid';

import TerminalFilterConfig from './config/TerminalFilterConfig';
import AirlinesFilterConfig from './config/AirlinesFilterConfig';
import BufferFilterConfig from './config/BufferFilterConfig';
import EarlyLateFilterConfig from './config/EarlyLateFilterConfig';

import './index.scss';

const ViewType = {
  GRID: 'GRID',
  GANTT: 'GANTT',
};

class MainContainer extends React.Component {
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
    const selectionClass = v => v===selectedViewType ? "selected-btn" : "";
    return (
      <div className="view-container">
        <div className="header-area" >
          <div className="app-title">
            <span className="title">Gate Manager</span>
          </div>
          <div className="btn-panel-right pull-right">
            <i className={`fa fa-th ${selectionClass(ViewType.GANTT)}`} onClick={() => this.toggleView(ViewType.GANTT)} />
            <i className={`fa fa-list-alt ${selectionClass(ViewType.GRID)}`} onClick={() => this.toggleView(ViewType.GRID)} />
          </div>
        </div>
        <Grid className="content-area">
          <Row>
            <Col md={2}>
              <div className="left-panel-area" >
                <FilterPane config={TerminalFilterConfig} />
                <FilterPane config={AirlinesFilterConfig} />
                <FilterPane config={BufferFilterConfig} />
                <FilterPane config={EarlyLateFilterConfig} />
              </div>
            </Col>
            <Col md={10} className="no-padding">
              <div className="main-area" >
                {
                  selectedViewType === ViewType.GANTT ?
                  (<GanttChart />) : (<GridComponent />)
                }
              </div>
            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
}

export default MainContainer;
