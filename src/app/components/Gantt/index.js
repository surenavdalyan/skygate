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
      return;
    }
    if (this.props.filters && !lodash.isEqual(this.props.filters, prevProps.filters)) {
      this.initCanvas(this.props.sampleData);
      return;
    }
  }

  initCanvas = (data) => {
    const GanttData = ToGanttInputData(data, this.props.filters);
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
      <div className={`view-container ${this.props.className}`}>
        <div
          className="canvas-wrapper"
          ref={
              (elm) => {
                    this.canvasWrapper = elm;
                  }
              }
        />
        <Overlay />
      </div>
    );
  }
}

function mapStateToProps({ sampleData, filters }) {
  return {
    sampleData,
    filters,
  };
}

export default connect(mapStateToProps)(GanttView);
