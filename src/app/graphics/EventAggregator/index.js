class EventAggregator {
  constructor() {
    this.timeTransformObjects = {};
    this.cacheObject = null;

    this.quickCacheList = {};
  }

  registerTimeTransformObject(uniqueKey, obj) {
    if (obj && uniqueKey) {
      this.timeTransformObjects[uniqueKey] = obj;
      this.timeTransformObjects[uniqueKey].retrieveCacheObject(
        this.cacheObject
      );
    }
  }

  applyZoom(zoomIncrFactor, wheelDelta, x0, viewportWidth) {
    Object.values(this.timeTransformObjects).forEach(timeTransform => {
      timeTransform.applyZoom(zoomIncrFactor, wheelDelta, x0, viewportWidth);
      this.cacheObject = timeTransform.generateCacheObject();
    });
  }

  applyPan(panIncrFactor, viewportWidth) {
    Object.values(this.timeTransformObjects).forEach(timeTransform => {
      timeTransform.applyPan(panIncrFactor, viewportWidth);
      this.cacheObject = timeTransform.generateCacheObject();
    });
  }

  // Quick caching pan/zoom states
  quickCacheState(timeTransform, key) {
    this.quickCacheList[key] = timeTransform.generateCacheObject();
  }

  retrieveQuickCacheState(timeTransform, key) {
    if (this.quickCacheList[key] && timeTransform) {
      timeTransform.retrieveCacheObject(this.quickCacheList[key]);
    }
  }
}

export default new EventAggregator();
