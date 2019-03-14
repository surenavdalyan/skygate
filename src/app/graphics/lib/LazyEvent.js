class LazyEvent {
  constructor() {
    this.waitUntil = null;
  }

  lazyCall(cb, timeout = 2000) {
    this.waitUntil = new Date();
    this.waitUntil.setMilliseconds(this.waitUntil.getMilliseconds() + timeout);
    setTimeout(() => {
      const now = new Date();
      if (now >= this.waitUntil && cb) {
        cb();
      }
    }, timeout + 100);
  }
}

export default LazyEvent;
