import { m3 } from "./lib/m3";
import Utils from "./AppUtils";
import EventAggregator from "./EventAggregator";
// import Events from "../utils/EventEmitter";

export default class TimeTransform {
  constructor(tStart0, tEnd0, updateCallback) {
    this.tStart0 = tStart0;
    this.tEnd0 = tEnd0;

    this.xSpan = 500; // default

    // initial values
    this.tStart = tStart0;
    this.tEnd = tEnd0;

    this.timeWindow = new Utils.TimeWindow(tStart0, tEnd0);

    // initial zoom, translation
    this.zoomFactor = 1.8;
    this.tx = 0.0;
    this.ty = 0.0;

    // Identity Matrix
    this.matrix = [this.zoomFactor, 0, 0, 0, 1, 0, 0, 0, 1];

    this.updateCallback = updateCallback;
  }

  enableTimeSyncing(uniqueName) {
    EventAggregator.registerTimeTransformObject(uniqueName, this);
  }

  applyZoom(zoomIncrFactor, wheelDelta, x0, viewportWidth) {
    let newZoomFactor = 1;
    if (wheelDelta < 0) {
      newZoomFactor = Math.min(this.zoomFactor + zoomIncrFactor, 3.0);
    } else {
      newZoomFactor = Math.max(this.zoomFactor - zoomIncrFactor, 1.0);
    }

    this.tx =
      (x0 - this.tx) * (this.zoomFactor - newZoomFactor) / this.zoomFactor +
      this.tx;
    this.zoomFactor = newZoomFactor;

    this.readjustTranslationInX(viewportWidth);

    const translationMatrix0 = m3.translation(this.tx, this.ty);
    const scaleMatrix = m3.scaling(this.zoomFactor, 1);

    // Multiply the matrices.
    this.matrix = m3.multiply(translationMatrix0, scaleMatrix);

    // console.log("x0: " + x0);
    // console.log("this.tx: " + this.tx);
    // console.log("zoomFactor: " + this.zoomFactor);
    if (this.updateCallback) this.updateCallback();
  }

  applyPan(panIncrFactor, viewportWidth) {
    // Compute the matrices
    const temp = this.tx;
    this.tx += panIncrFactor;
    this.readjustTranslationInX(viewportWidth);

    const translationMatrix = m3.translation(this.tx - temp, 0);

    // Multiply the matrices.
    this.matrix = m3.multiply(translationMatrix, this.matrix);

    if (this.updateCallback) this.updateCallback();
  }

  verticalScroll(incrFactor) {
    // Compute the matrices
    const temp = this.ty;
    this.ty += incrFactor;
    this.readjustTranslationInY();

    const translationMatrix = m3.translation(0, this.ty - temp);

    // Multiply the matrices.
    this.matrix = m3.multiply(translationMatrix, this.matrix);
  }

  applyNewTimeWindow(t1, t2) {}

  getZoomFactor() {
    return this.zoomFactor;
  }

  readjustTranslationInX(viewportWidth) {
    const minTranslation = Math.min(
      0,
      -(this.xSpan * this.zoomFactor - viewportWidth)
    );
    const maxTranslation = 0;
    if (this.tx > maxTranslation) this.tx = maxTranslation;
    else if (this.tx < minTranslation) this.tx = minTranslation;
  }

  readjustTranslationInY() {
    // var minTranslation = 0;
    const maxTranslation = 0;
    // if(this.ty < minTranslation) this.ty = minTranslation;
    if (this.ty > maxTranslation) this.ty = maxTranslation;
  }

  setSpanInX(xSpan) {
    this.xSpan = xSpan;
  }

  timeToScreenX(date) {
    const { timeWindow, xSpan } = this;
    return timeWindow.getPositionOnTimeScale(date) * xSpan;
  }

  screenXToTime(x, xOffset = 0) {
    const xReversed = this.reverseX(x, xOffset);
    const { timeWindow, xSpan } = this;
    const normalizedPos = xReversed / xSpan;
    return timeWindow.getTimeForPosition(normalizedPos);
  }

  reverseX(x, xOffset = 0) {
    const tx = this.tx + xOffset;
    return x / this.zoomFactor - tx / this.zoomFactor;
  }

  reverseY(y, yOffset = 0) {
    const ty = this.ty + yOffset;
    return y - ty;
  }

  transformX(x, xOffset = 0) {
    return x * this.zoomFactor + this.tx + xOffset;
  }

  transformY(y, yOffset = 0) {
    return y + this.ty + yOffset;
  }

  transformBox(box, fixX = false, fixY = false) {
    return {
      left: fixX ? box.left : this.transformX(box.left),
      right: fixX ? box.right : this.transformX(box.right),
      top: fixY ? box.top : this.transformY(box.top),
      bottom: fixY ? box.bottom : this.transformY(box.bottom)
    };
  }

  getMatrix(xOffset = 0, yOffset = 0, fixX = false, fixY = false) {
    const outMatrix = Utils.clone(this.matrix);
    if (fixX) {
      outMatrix[0] = 1;
      outMatrix[6] = 0;
    }
    if (fixY) {
      outMatrix[4] = 1;
      outMatrix[7] = 0;
    }

    outMatrix[6] += xOffset;
    outMatrix[7] += yOffset;
    return outMatrix;
  }

  // rough check whether a y value falls inside the viewing window
  isInsideTester(canvasHeight) {
    const minHeightAllowed = -this.ty - 100;
    const maxHeightAllowed = -this.ty + canvasHeight + 100;
    return function check(yValue) {
      return yValue > minHeightAllowed && yValue < maxHeightAllowed;
    };
  }

  // In order to cache and sync timeline we create cache objects
  // Cache objects can be saved and retrieved later in time.
  generateCacheObject() {
    return {
      StartTime: new Date(this.tStart0),
      EndTime: new Date(this.tEnd0),
      cachedValues: {
        zoomFactor: Utils.clone(this.zoomFactor),
        tx: Utils.clone(this.tx),
        ty: Utils.clone(this.ty),
        matrix: Utils.clone(this.matrix)
      }
    };
  }

  retrieveCacheObject(cacheObject) {
    if (cacheObject) {
      const { StartTime, EndTime, cachedValues } = cacheObject;
      if (
        Utils.compareDates(StartTime, this.tStart0) &&
        Utils.compareDates(EndTime, this.tEnd0) &&
        cachedValues
      ) {
        Object.keys(cachedValues).forEach(key => {
          this[key] = Utils.clone(cachedValues[key]);
        });
      }
    }
  }

  // Quick Caching retrieval
  retrieveCachedState(key) {
    EventAggregator.retrieveQuickCacheState(this, key);
  }

  // Quick Cache
  quickCacheState(key) {
    EventAggregator.quickCacheState(this, key);
  }
}
