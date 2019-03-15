import React from 'react';
import moment from 'moment';
import { Grid, Row, Col } from 'react-bootstrap';

import FilterPane from '../../components/FilterPane';
import GateManager from '../../components/GateManager';

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
    const date = moment().format('MMM DD[,] YYYY');
    const day = moment().format('DD');
    const refreshTime = 'Today 11:10 AM';
    this.state = {
      selectedViewType: ViewType.GANTT,
      date,
      day,
      refreshTime,
    };
  }

  toggleView = (selectedViewType) => {
    this.setState({ selectedViewType });
  };

  render() {
    const { selectedViewType } = this.state;
    const selectionClass = v => (v === selectedViewType ? 'selected-btn' : '');
    return (
      <div className="view-container">
        <div className="header-area">
          <div className="header-area-left">
            <span className="span-calendar">{this.state.day}</span>
            {/* <img src="../../../assets/images/Calendar.svg" alt="calendar" /> */}
            <span>{this.state.date}</span>
          </div>
          <div className="header-area-center">
            <img
              src="../../../assets/images/SkyGATE Logo-01.png"
              alt="skygatelogo"
            />
          </div>
          <div className="header-area-right">
            <span>
              Refreshed:{this.state.refreshTime}
              <i className="icon-autorenew" />
            </span>
            <input type="text" placeholder="search" />
            <span className="span-notify" />
          </div>
        </div>
        <Grid className="content-area">
          <Row>
            <Col md={2}>
              <div className="left-panel-area">
                <FilterPane config={TerminalFilterConfig} />
                <FilterPane config={AirlinesFilterConfig} />
                <FilterPane config={BufferFilterConfig} />
                <FilterPane config={EarlyLateFilterConfig} />
              </div>
            </Col>
            {/* <Col md={10} className="no-padding main-area-container">
              <GateManager />
            </Col> */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default MainContainer;
