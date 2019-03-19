import React from 'react';
import { connect } from 'react-redux';

import FilterPane from '../../components/FilterPane';
import GateManager from '../../components/GateManager';

import TerminalFilterConfig from './config/TerminalFilterConfig';
import AirlinesFilterConfig from './config/AirlinesFilterConfig';
import BufferFilterConfig from './config/BufferFilterConfig';
import EarlyLateFilterConfig from './config/EarlyLateFilterConfig';
import StandFilterConfig from './config/StandFilterConfig';

import Header from '../../components/Header';

import './index.scss';

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { sampleData: { AirlineCodeData, StandData } } = this.props;
    AirlinesFilterConfig.items = AirlineCodeData.map(air => ({ label: air, value: air }));
    StandFilterConfig.items = StandData.data.map(stnd => ({ label: stnd.name, value: stnd.name }));
    return (
      <div className="view-container">
        <Header />
        <div className="content-area">
          <div className="left-panel-area">
            <FilterPane config={TerminalFilterConfig} />
            <FilterPane config={AirlinesFilterConfig} />
            <FilterPane config={BufferFilterConfig} />
            <FilterPane config={EarlyLateFilterConfig} />
            <FilterPane config={StandFilterConfig} />
          </div>
          <div className="no-padding main-area-container">
            <GateManager />
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps({ sampleData }) {
  return {
    sampleData,
  };
}

export default connect(mapStateToProps)(MainContainer);
