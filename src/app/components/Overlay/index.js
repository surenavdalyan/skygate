import React from 'react';
import LazyEvent from '../../graphics/lib/LazyEvent';
import { GanttEventNames, GanttEvent } from '../../graphics/Events';
import './index.scss';

const OverlayWidth = 250;
const OverlayHeight = 300;

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      content: null,
      left: 100,
      top: 100,
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
        canvasWidth,
        canvasHeight,
      } = info;

      /*
      console.log(
        xLeft,
        xRight,
        yPos,
        canvasWidth,
        canvasHeight,
      );
      */

      let hoverMenuX = xRight + 100;
      let hoverMenuY = yPos;

      const spaceOnRight = canvasWidth - xRight;
      const spaceBelow = canvasHeight - yPos;
      if (spaceOnRight < OverlayWidth) {
        hoverMenuX = xLeft - OverlayWidth;
      }
      if (spaceBelow < OverlayHeight) {
        hoverMenuY = yPos - OverlayHeight;
      }

      this.load(content, hoverMenuX, hoverMenuY);
    } else {
      // this.lazyDrop.lazyCall(() => this.hide());
    }
  };

  hide() {
    this.setState({ show: false });
  }

  load(content, x, y) {
    this.setState({
      show: true,
      content,
      left: x,
      top: y,
    });
  }

  render() {
    const { left, top } = this.state;
    return (
      this.state.show &&
        <div className="overlay-comp" style={{ left, top }}>{this.state.content}</div>
    );
  }
}

export default Overlay;
