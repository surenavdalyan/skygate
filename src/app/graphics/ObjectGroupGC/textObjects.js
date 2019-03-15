import { TextAlignment } from '../lib/TextRenderer';
import '../../../assets/default.scss';

const TextObject = {
  //= ===== Objects that will help rendering text =====================================//
  //= ===== We need a matrix for transforming the positions

  // Base class
  BoxText: class {
    constructor(wrapperObj, x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.wrapperObj = wrapperObj;

      // Clear callback list
      this.clearCallbackList = [];

      // Render callback List
      this.renderCallbackList = [];
      /** ** Callback format ******** /
                function ()
                {
                    return {
                        text,
                        textAlignment,
                        box,
                        offset,
                        styleObject
                    };
                }
            ************************* */
    }

    // Must - can be used in hashmap
    getBoundingBox() {
      return {
        top: this.y,
        left: this.x,
        bottom: this.y + this.height,
        right: this.x + this.width,
      };
    }

    setWrapperObject(wrapperObj) {
      this.wrapperObj = wrapperObj;
    }

    addRenderCallback(cb) {
      this.renderCallbackList.push(cb);
    }

    addClearCallback(cb) {
      this.clearCallbackList.push(cb);
    }
  },
};

// Network element label box
TextObject.NetworkElementBox = class extends TextObject.BoxText {
  constructor(wrapperObj, x, y, width, height) {
    super(wrapperObj, x, y, width, height);

    this.renderCallbackMainLabel = this.renderCallbackMainLabel.bind(this);
    super.addRenderCallback(this.renderCallbackMainLabel);
  }

  renderCallbackMainLabel() {
    return {
      text: this.wrapperObj.Name,
      textAlignment: TextAlignment.LeftCenter,
      box: this.getBoundingBox(),
      offset: 10,
      styleObject: {
        color: 'rgb(80, 80, 80)',
        font: '12px Open Sans',
      },
    };
  }
};

// AssignmentLabel box
TextObject.AssignmentLabel = class extends TextObject.BoxText {
  constructor(wrapperObj, x, y, width, height, position) {
    super(wrapperObj, x, y, width, height);

    this.textPosition = TextAlignment.LeftCenter;
    this.moveUpOnCollide = false;
    this.moveDownOnCollapse = false;
    switch (position) {
      case 'left': this.textPosition = TextAlignment.LeftCenter; break;
      case 'right': this.textPosition = TextAlignment.RightCenter; break;
      default: break;
    }

    this.renderCallbackMainLabel = this.renderCallbackMainLabel.bind(this);
    super.addRenderCallback(this.renderCallbackMainLabel);

    this.color = 'rgba(68, 68, 68, 1)';
    this.font = 'bold 11px Open Sans';
  }

  setAlpha(alpha) {
    this.color = `rgba(68, 68, 68, ${alpha})`;
  }

  renderCallbackMainLabel() {
    return {
      text: this.wrapperObj.text,
      textAlignment: this.textPosition,
      box: this.getBoundingBox(),
      offset: 0,
      styleObject: {
        color: this.color,
        font: this.font,
      },
    };
  }
};

TextObject.CenterLabelBox = class extends TextObject.BoxText {
  constructor(wrapperObj, x, y, width, height) {
    super(wrapperObj, x, y, width, height);
    this.renderCallbackMainLabel = this.renderCallbackMainLabel.bind(this);
    super.addRenderCallback(this.renderCallbackMainLabel);
    this.color = '#FFF';
    this.font = '12px Open Sans';
  }

  renderCallbackMainLabel() {
    return {
      text: this.wrapperObj.text,
      smallerText: this.wrapperObj.smallerText,
      textAlignment: TextAlignment.Center,
      box: this.getBoundingBox(),
      offset: 10,
      styleObject: {
        color: this.color,
        font: this.font,
      },
    };
  }
};

TextObject.ClearBox = class extends TextObject.BoxText {
  constructor(wrapperObj, x, y, width, height) {
    super(wrapperObj, x, y, width, height);

    this.clearCallback = this.clearCallback.bind(this);
    super.addClearCallback(this.clearCallback);
  }

  clearCallback() {
    return {
      box: this.getBoundingBox(),
      color: '#FFF',
    };
  }
};

export default TextObject;
