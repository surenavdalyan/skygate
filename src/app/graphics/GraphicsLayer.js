import { SpatialHash } from './SpatialHash';
import { Canvas2D } from './ShaderFactory/Canvas';

// Base Layer
export default class Base {
  // Construct canvas and webgl context
  constructor(wrapperElem, canvasObj) {
    if (!wrapperElem) console.error('Canvas Wrapper Element is unset');

    this.wrapperElem = wrapperElem;

    this.canvas = canvasObj.canvas;
    this.gl = canvasObj.gl;
    this.shaderFac = canvasObj.shaderFac;

    this.canvas2DLayers = [];

    this.buffers = null;

    this.objectList = [];

    this.hashLookup = new SpatialHash.Lookup(50, 50);
  }

  clear() {
    const { gl } = this;
    if (gl) {
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    }
    if (this.canvas2D) {
      this.canvas2D.ctx.clearRect(
        0,
        0,
        this.canvas2D.canvas.width,
        this.canvas2D.canvas.height,
      );
    }

    this.canvas2DLayers.forEach((c) => {
      c.ctx.clearRect(
        0,
        0,
        c.canvas.width,
        c.canvas.height,
      );
    });
  }

  onResize() {
    this.clear();
    this.canvas.width = this.wrapperElem.clientWidth;
    this.canvas.height = this.wrapperElem.clientHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    if (this.canvas2D) {
      this.canvas2D.canvas.width = this.wrapperElem.clientWidth;
      this.canvas2D.canvas.height = this.wrapperElem.clientHeight;
      this.canvas2DLayers.forEach((c) => {
        c.canvas.width = this.wrapperElem.clientWidth;
        c.canvas.height = this.wrapperElem.clientHeight;
      });
    }

    if (this.bgLineCount) {
      delete this.bgLineCount;
    }
  }

  addCanvas2D() {
    this.canvas2D = new Canvas2D(this.wrapperElem);
  }

  newCanvas2D() {
    const newCanvas = new Canvas2D(this.wrapperElem);
    this.canvas2DLayers.push(newCanvas);
    return newCanvas.ctx;
  }

  setData(inputData) {
    this.inputData = inputData;
  }

  setTimeLabels(timeLabels) {
    this.timeLabels = timeLabels;
  }
}

