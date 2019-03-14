import React from 'react';
import { connect } from 'react-redux';
import lodash from 'lodash';
import GLController from '../../graphics/GLController';
import RenderTypes from '../../graphics/RenderTypes';
import Overlay from '../Overlay';
import ToGanttInputData from './ToGanttInputData';

import './index.scss';

class GanttView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.sampleData) {
      this.initCanvas(this.props.sampleData);
      setTimeout(() => this.initCanvas(this.props.sampleData), 100);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.sampleData && !lodash.isEqual(this.props.sampleData, prevProps.sampleData)) {
      this.initCanvas(this.props.sampleData);
    }
  }

  initCanvas = (data) => {
    const GanttData = ToGanttInputData(data);
    setTimeout(() => {
      if (!this.glController) {
        this.glController = new GLController(
          this.canvasWrapper,
          RenderTypes.GANTT_CHART_01,
        );
      }
      this.glController.init(GanttData);
    }, 0);
  };

  render() {
    return (
      <React.Fragment>
        <div className="view-container">
          <div
            className="canvas-wrapper"
            ref={
              (elm) => {
                    this.canvasWrapper = elm;
                  }
              }
          />
          { /* <CustomPopOver /> */ }
        </div>
        <Overlay />
      </React.Fragment>
    );
  }
}

function mapStateToProps({ sampleData }) {
  return {
    sampleData,
  };
}

export default connect(mapStateToProps)(GanttView);
