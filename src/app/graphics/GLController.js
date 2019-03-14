import { Canvas } from './ShaderFactory/Canvas';
import RenderTypeMapping from './RenderTypeMapping';

export default class GLController {
  constructor(wrapperDiv, renderType) {
    if (!wrapperDiv) return;
    this.canvasObj2 = new Canvas(wrapperDiv);
    this.layer = null;

    const GLComponent = RenderTypeMapping[renderType];
    if (GLComponent) {
      this.layer = new GLComponent(wrapperDiv, this.canvasObj2);
    }
  }

  init(dataObj) {
    if (!dataObj) return;
    if (this.layer) {
      const { layer } = this;
      layer.onResize();
      layer.setData(dataObj);
      layer.renderAll = this.renderAll.bind(this);
      layer.createObjects();
      this.renderAll();
    }
  }

  renderAll() {
    if (this.layer) {
      const { layer } = this;
      layer.render();
    }
  }

  clearAll() {
    if (this.layer) {
      const { layer } = this;
      layer.clear();
    }
  }

  onResize() {
    if (this.layer) {
      const { layer } = this;
      layer.onResize();
    }
  }
}
