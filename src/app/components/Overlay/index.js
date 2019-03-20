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
      scrollY: 0,
    };
    this.lazyDrop = new LazyEvent();
    GanttEvent.on(GanttEventNames.AssignmentHover, this.onHover);
    GanttEvent.on(GanttEventNames.YScroll, this.onScroll);
  }

  onScroll = ({ scrollY = 0 }) => {
    this.setState({ scrollY });
  };

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

      const { scrollY } = this.state;

      let hoverMenuX = xRight + 100;
      let hoverMenuY = scrollY + yPos + 100;

      const spaceOnRight = canvasWidth - xRight;
      const spaceBelow = canvasHeight - yPos;
      if (spaceOnRight < OverlayWidth) {
        hoverMenuX = xLeft - OverlayWidth;
      }
      if (spaceBelow < OverlayHeight) {
        hoverMenuY -= OverlayHeight;
      }

      if (hoverMenuY < 0) hoverMenuY = 10;
      if (hoverMenuX < 0) hoverMenuX = 10;
      if (hoverMenuX + OverlayWidth > canvasWidth) hoverMenuX = canvasWidth - OverlayWidth;
      if (hoverMenuY + OverlayHeight > canvasHeight) hoverMenuY = canvasHeight - OverlayHeight;

      // console.log(hoverMenuX, hoverMenuY);

      // this.load(content, hoverMenuX, hoverMenuY);
      this.lazyDrop.lazyCall(() => this.load(content, hoverMenuX, hoverMenuY), 200);
    } else {
      this.hide();
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
