import React from 'react';
import LazyEvent from '../../graphics/lib/LazyEvent';
import { GanttEventNames, GanttEvent } from '../../graphics/Events';
import './index.scss';

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      content: null,
    };
    this.lazyDrop = new LazyEvent();
    GanttEvent.on(GanttEventNames.AssignmentHover, this.onHover);
  }

  onHover = (info) => {
    if (info) {
      const {
        content,
        xLeft,
        xRight,
        yPos,
      } = info;
      this.load(content);
    } else {
      this.lazyDrop.lazyCall(() => this.hide());
    }
  };

  hide() {
    this.setState({ show: false });
  }

  load(content) {
    this.setState({ show: true, content });
  }

  render() {
    return (
      this.state.show &&
        <div className="overlay-comp">{this.state.content}</div>
    );
  }
}

export default Overlay;
