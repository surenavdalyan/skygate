export default class MouseEventManager {
  constructor(element) {
    this.element = element;

    this.MOUSE = {
      offsetX: 0,
      offsetY: 0,
      isDown: false,
      startX: 0,
      startY: 0,
      netPanningX: 0,
      netPanningY: 0,
      clickStart: false,
      mouseDragObject: null
    };

    this.subscriberList = {};
    this.element.onmousemove = this.mouseMoveHandler.bind(this);
    this.element.onmousedown = this.mouseDownHandler.bind(this);
    this.element.onmouseup = this.mouseUpHandler.bind(this);
    this.element.onmouseout = this.mouseOutHandler.bind(this);
    this.element.ondblclick = this.mouseDoubleClickHandler.bind(this);
    // this.element.onclick = this.mouseClickHandler;

    window.addWheelListener(this.element, this.mouseWheelHandler.bind(this));
  }

  mouseWheelHandler(e) {
    const { MOUSE } = this;
    e.preventDefault();
    const offsetX = e.originalEvent ? e.originalEvent.offsetX : e.offsetX;
    const offsetY = e.originalEvent ? e.originalEvent.offsetY : e.offsetY;
    // console.log(offsetX);
    if (e.shiftKey) {
      if (this.subscriberList.shiftmousewheel) {
        const eventSubscribers = Object.values(
          this.subscriberList.shiftmousewheel
        );
        eventSubscribers.forEach(subscriber => {
          if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
            subscriber.cb(offsetX, offsetY, e.deltaY);
          }
        });
      }
    } else if (this.subscriberList.mousewheel) {
      const eventSubscribers = Object.values(this.subscriberList.mousewheel);
      eventSubscribers.forEach(subscriber => {
        if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
          subscriber.cb(offsetX, offsetY, e.deltaY);
        }
      });
    }
  }

  mouseClickHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    const { offsetX, offsetY } = e;

    if (this.subscriberList.mouseclick) {
      const eventSubscribers = Object.values(this.subscriberList.mouseclick);
      eventSubscribers.forEach(subscriber => {
        if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
          subscriber.cb(
            offsetX - subscriber.sub_region.x,
            offsetY - subscriber.sub_region.y
          );
        }
      });
    }
  };

  mouseDoubleClickHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    const { offsetX, offsetY } = e;

    if (this.subscriberList.mouseclick) {
      const eventSubscribers = Object.values(
        this.subscriberList.mousedoubleclick
      );
      eventSubscribers.forEach(subscriber => {
        if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
          subscriber.cb(
            offsetX - subscriber.sub_region.x,
            offsetY - subscriber.sub_region.y
          );
        }
      });
    }
  };

  mouseMoveHandler(e) {
    const { MOUSE } = this;
    // console.log(e);

    const { offsetX, offsetY } = e;

    if (e.buttons & 1) {
      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();

      // dx & dy are the distance the mouse has moved since
      // the last mousemove event
      const dx = offsetX - MOUSE.startX;
      const dy = offsetY - MOUSE.startY;

      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        MOUSE.clickStart = false;

        if (e.shiftKey) {
          if (MOUSE.mouseDragObject && this.subscriberList.shiftmousedrag) {
            const eventSubscribers = Object.values(
              this.subscriberList.shiftmousedrag
            );
            eventSubscribers.forEach(subscriber => {
              if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
                const x = offsetX - subscriber.sub_region.x;
                const y = offsetY - subscriber.sub_region.y;
                subscriber.cb(x, y, MOUSE.mouseDragObject);
              }
            });
          }
        } else if (this.subscriberList.mousepan) {
          const eventSubscribers = Object.values(this.subscriberList.mousepan);
          eventSubscribers.forEach(subscriber => {
            if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
              subscriber.cb(dx, dy);
            }
          });
        }
      }
      // reset the vars for next mousemove
      MOUSE.startX = offsetX;
      MOUSE.startY = offsetY;
    } else if (e.shiftKey) {
      if (this.subscriberList.shifthover) {
        const eventSubscribers = Object.values(this.subscriberList.shifthover);
        eventSubscribers.forEach(subscriber => {
          if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
            const x = offsetX - subscriber.sub_region.x;
            const y = offsetY - subscriber.sub_region.y;
            subscriber.cb(x, y, this.element.style);
          }
        });
      }
    } else if (this.subscriberList.mousehover) {
      const eventSubscribers = Object.values(this.subscriberList.mousehover);
      eventSubscribers.forEach(subscriber => {
        if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
          const x = offsetX - subscriber.sub_region.x;
          const y = offsetY - subscriber.sub_region.y;
          subscriber.cb(x, y, this.element.style);
        }
      });
    }
  }

  mouseDownHandler(e) {
    const { MOUSE } = this;
    MOUSE.clickStart = true;
    // console.log(e.offsetX, e.offsetY);

    e.preventDefault();
    e.stopPropagation();

    const { offsetX, offsetY } = e;

    // calc the starting mouse X,Y for the drag
    MOUSE.startX = parseInt(offsetX, 10);
    MOUSE.startY = parseInt(offsetY, 10);

    if (e.shiftKey && this.subscriberList.shiftdragstart) {
      const eventSubscribers = Object.values(
        this.subscriberList.shiftdragstart
      );
      eventSubscribers.forEach(subscriber => {
        if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
          MOUSE.mouseDragObject = subscriber.cb(
            offsetX - subscriber.sub_region.x,
            offsetY - subscriber.sub_region.y
          );
        }
      });
    }
  }

  mouseUpHandler(e) {
    const { MOUSE } = this;
    if (MOUSE.clickStart) {
      // Detected click
      this.mouseClickHandler(e);
    }
    // console.log(e.offsetX, e.offsetY);
    const { offsetX, offsetY } = e;

    if (
      e.shiftKey &&
      this.subscriberList.shiftmousedrop &&
      MOUSE.mouseDragObject
    ) {
      const eventSubscribers = Object.values(
        this.subscriberList.shiftmousedrop
      );
      eventSubscribers.forEach(subscriber => {
        if (this.isInside(offsetX, offsetY, subscriber.sub_region)) {
          subscriber.cb(
            offsetX - subscriber.sub_region.x,
            offsetY - subscriber.sub_region.y,
            MOUSE.mouseDragObject
          );
        }
      });
    }

    MOUSE.mouseDragObject = null;
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
  }

  mouseOutHandler(e) {
    const { MOUSE } = this;
    // console.log(e.offsetX, e.offsetY);
    MOUSE.mouseDragObject = null;
  }

  // We need a subscriber Id and keep the events against the key = { subscriberId-eventName }
  subscribeEvent(subscriberId, x, y, width, height, eventName, callback) {
    const { MOUSE } = this;
    if (!this.subscriberList[eventName]) {
      this.subscriberList[eventName] = {};
    }

    this.subscriberList[eventName][subscriberId] = {
      sub_region: {
        x,
        y,
        width,
        height
      },
      cb: callback
    };
  }

  isInside(x, y, region) {
    const { MOUSE } = this;
    return (
      x >= region.x &&
      x < region.x + region.width &&
      y >= region.y &&
      y < region.y + region.height
    );
  }
}
