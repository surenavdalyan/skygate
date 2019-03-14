const Utils = {};

Utils.clone = function clone(obj) {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = Utils.clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = Utils.clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

Utils.createBufferObj = function createBufferObj() {
  return {
    data: [],
    numItems: 0,
    buffer: null,
  };
};

Utils.packColorArray = function packColorArray(color) {
  const buffer = new ArrayBuffer(4);
  const byteView = new Uint8Array(buffer);
  byteView[0] = color[0];
  byteView[1] = color[1];
  byteView[2] = color[2];
  byteView[3] = color[3];
  return new Float32Array(buffer)[0];
};

Utils.TimeWindow = class TimeWindow {
  constructor(startTime, endTime) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  getPositionOnTimeScale(inputTime) {
    let result = NaN;
    result = (inputTime - this.startTime) / (this.endTime - this.startTime);
    return result;
  }

  getTimeForPosition(inputPosition) {
    const minutesToAdd =
      inputPosition * (this.endTime - this.startTime) / 1000 / 60;
    const result = new Date(this.startTime);
    result.setMinutes(result.getMinutes() + minutesToAdd);
    return result;
  }
};

Utils.compareDates = function compareDates(date1, date2, error = 1000) {
  const err = Math.abs(date1 - date2);
  return err < error;
};

Utils.getStartOfTheDay = function getStartOfTheDay(date) {
  const outDate = new Date(date);
  outDate.setMinutes(0);
  outDate.setSeconds(0);
  outDate.setHours(0);
  return outDate;
};

Utils.getEndOfTheDay = function getEndOfTheDay(date) {
  const outDate = new Date(date);
  outDate.setMinutes(0);
  outDate.setSeconds(0);
  outDate.setHours(24);
  return outDate;
};

Utils.convertDateTime = function convertDateTime(dateString) {
  const strList = dateString.split(' ');
  const year = strList[0].split('/');
  const newDateStr = `${year[2]}/${year[1]}/${year[0]} ${strList[1]}`;
  return new Date(newDateStr);
};

Utils.strToDate = function strToDate(dateStr) {
  // dateStr = dateStr.replace("T", " ");
  // dateStr = dateStr.replace("-", "/");
  // dateStr = dateStr.replace("Z", "");
  return new Date(dateStr);
};

Utils.toClockTime = function toClockTime(dateStr) {
  return dateStr
    .split('T')[1]
    .split(':')
    .splice(0, 2)
    .join(':');
};

Utils.getTimeDiffInMin = function getTimeDiffInMin(date1, date2) {
  return (date2.getTime() - date1.getTime()) / 60000;
};

Utils.isInsideBox = function isInsideBox(boundingBox, point) {
  if (
    point.x >= boundingBox.left &&
    point.x <= boundingBox.right &&
    point.y >= boundingBox.top &&
    point.y <= boundingBox.bottom
  ) {
    return true;
  }

  return false;
};

Utils.cumulativeOffset = function cumulativeOffset(element) {
  let top = 0;
  let left = 0;
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    top,
    left,
  };
};

Utils.getWeekNumber = function getWeekNumber(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};

Utils.toMonthString = function toMonthString(date) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

Utils.removeCamelCase = str => str;

export default Utils;

// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function crossBrowserSetup(window, document) {
  let prefix = '';
  let _addEventListener;
  let support;

  // detect event model
  if (window.addEventListener) {
    _addEventListener = 'addEventListener';
  } else {
    _addEventListener = 'attachEvent';
    prefix = 'on';
  }

  // detect available wheel event
  support =
    'onwheel' in document.createElement('div')
      ? 'wheel' // Modern browsers support "wheel"
      : document.onmousewheel !== undefined
        ? 'mousewheel' // Webkit and IE support at least "mousewheel"
        : 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

  window.addWheelListener = function (elem, callback, useCapture) {
    _addWheelListener(elem, support, callback, useCapture);

    // handle MozMousePixelScroll in older Firefox
    if (support == 'DOMMouseScroll') {
      _addWheelListener(elem, 'MozMousePixelScroll', callback, useCapture);
    }
  };

  function _addWheelListener(elem, eventName, callback, useCapture) {
    elem[_addEventListener](
      prefix + eventName,
      support == 'wheel'
        ? callback
        : (originalEvent) => {
          !originalEvent && (originalEvent = window.event);

          // create a normalized event object
          const event = {
            // keep a ref to the original event object
            originalEvent,
            target: originalEvent.target || originalEvent.srcElement,
            type: 'wheel',
            deltaMode: originalEvent.type == 'MozMousePixelScroll' ? 0 : 1,
            deltaX: 0,
            deltaY: 0,
            deltaZ: 0,
            preventDefault() {
              originalEvent.preventDefault
                ? originalEvent.preventDefault()
                : (originalEvent.returnValue = false);
            },
          };

            // calculate deltaY (and deltaX) according to the event
          if (support == 'mousewheel') {
            event.deltaY = -1 / 40 * originalEvent.wheelDelta;
            // Webkit also support wheelDeltaX
            originalEvent.wheelDeltaX &&
                (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
          } else {
            event.deltaY = originalEvent.deltaY || originalEvent.detail;
          }

          // it's time to fire the callback
          return callback(event);
        },
      useCapture || false,
    );
  }
}(window, document));
