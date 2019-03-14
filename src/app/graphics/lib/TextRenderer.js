import GCUtils from '../GC/Utils';

const DefaultStyle = {
  fontFamily: 'Open Sans',
};

const AvgFontHeight = 18;

const TextAlignment = {
  TopLeft: 0,
  TopRight: 1,
  BottomLeft: 2,
  BottomRight: 3,
  Center: 4,
  LeftCenter: 5,
  RightCenter: 6,
  TopCenter: 7,
  BottomCenter: 8,
};

const TextRenderer = class {
  constructor(ctx) {
    this.ctx = ctx; // 2d rendering context
    this.objects = []; // list of text objects
    this.clearOffsets = null;
  }

  addObject(obj) {
    this.objects.push(obj);
  }

  addObjects(objList) {
    this.objects.push(...objList);
  }

  clearObjects() {
    this.objects.length = 0;
  }

  setClearOffsets(xOffset, yOffset) {
    this.clearOffsets = { xOffset, yOffset };
  }

  render() {
    this.objects.forEach((object) => {
      const {
        renderCallbackList,
        clearCallbackList,
        moveUpOnCollide,
        moveDownOnCollide,
      } = object;

      if (clearCallbackList) {
        clearCallbackList.forEach((clearCallback) => {
          const { box } = clearCallback();

          // The box transforms here
          if (this.getMatrix) {
            const matrix = this.getMatrix();
            const boxTransformed = GCUtils.transformBox(matrix, box);
            this.clearRect(boxTransformed);
          } else {
            console.error('getMatrix needs to be set');
          }
        });
      }

      if (renderCallbackList) {
        renderCallbackList.forEach((renderCallback) => {
          const {
            text,
            smallerText,
            textAlignment,
            box,
            offset,
            styleObject,
          } = renderCallback();

          // The box transforms here
          if (this.getMatrix) {
            const matrix = this.getMatrix();
            const boxTransformed = GCUtils.transformBox(matrix, box);

            this.ctx.font = styleObject.font;
            this.ctx.fillStyle = styleObject.color;
            if (moveUpOnCollide) {
              boxTransformed.altTop = boxTransformed.top - AvgFontHeight;
            }
            if (moveDownOnCollide) {
              boxTransformed.altTop = boxTransformed.top + AvgFontHeight;
            }

            this.renderOnBox(
              text,
              smallerText,
              textAlignment,
              boxTransformed,
              offset,
            );
          } else {
            console.error('getMatrix needs to be set');
          }
        });
      }
    });
    this.clearOffsetsOptionally();
  }

  clearOffsetsOptionally() {
    // Clear negative regions
    if (this.clearOffsets && this.getMatrix) {
      if (this.clearOffsets.xOffset) {
        this.ctx.clearRect(
          0,
          0,
          this.clearOffsets.xOffset,
          this.ctx.canvas.height,
        );
      }
      if (this.clearOffsets.yOffset) {
        this.ctx.clearRect(
          0,
          0,
          this.ctx.canvas.width,
          this.clearOffsets.yOffset,
        );
      }
    }
  }

  clearRect(box) {
    this.ctx.clearRect(
      box.left,
      box.top,
      box.right - box.left,
      box.bottom - box.top,
    );
  }

  clear() {
    if (this.ctx) {
      this.ctx.clearRect(
        0,
        0,
        this.ctx.canvas.width,
        this.ctx.canvas.height,
      );
    }
  }

  renderAt(text, x, y, color) {
    const textWidth = this.ctx.measureText(text).width;
    const x0 = x - textWidth / 2;
    const y0 = y + 4;
    this.ctx.font = `14px ${DefaultStyle.fontFamily}`;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, Math.round(x0), Math.round(y0));
  }

  renderOnBox(text, smallerText, textAlignment, box, offset) {
    const { ctx } = this;

    if (!text) {
      text = '';
    }
    text = text.toString().trim();

    let textWidth = ctx.measureText(text).width;

    switch (textAlignment) {
      case TextAlignment.TopLeft:
        {
          const toBeShortened = textWidth >= (box.right - box.left - 40) / 2;
          if (toBeShortened) {
            return;
          }
          const x0 = box.left + offset;
          const y0 = box.top + offset + 10;
          ctx.fillText(text, Math.round(x0), Math.round(y0));
        }
        break;
      case TextAlignment.TopRight:
        {
          const toBeShortened = textWidth >= (box.right - box.left - 40) / 2;
          if (toBeShortened) {
            return;
          }
          const x0 = box.right - textWidth - offset;
          const y0 = box.top + offset + 10;
          ctx.fillText(text, Math.round(x0), Math.round(y0));
        }
        break;
      case TextAlignment.BottomRight:
        {
          const toBeShortened = textWidth >= (box.right - box.left - 40) / 2;
          if (toBeShortened) {
            return;
          }
          const x0 = box.right - textWidth - offset;
          const y0 = box.bottom - offset;
          ctx.fillText(text, Math.round(x0), Math.round(y0));
        }
        break;
      case TextAlignment.BottomLeft:
        {
          const toBeShortened = textWidth >= (box.right - box.left - 40) / 2;
          if (toBeShortened) {
            return;
          }
          const x0 = box.left + offset;
          const y0 = box.bottom - offset;
          ctx.fillText(text, Math.round(x0), Math.round(y0));
        }
        break;
      case TextAlignment.LeftCenter:
        {
          let boxTop = box.top;
          if (box.altTop && textWidth >= (box.right - box.left) * 0.5) {
            boxTop = box.altTop;
          }
          const x0 = box.left + offset;
          const y0 = (boxTop + box.bottom) / 2 + 9 / 2;
          ctx.fillText(text, Math.round(x0), Math.round(y0));
          ctx.clearRect(
            box.right,
            box.top,
            box.right - box.left,
            box.bottom - box.top,
          );
        }
        break;
      case TextAlignment.RightCenter:
        {
          let boxTop = box.top;
          if (box.altTop && textWidth >= (box.right - box.left) * 0.5) {
            boxTop = box.altTop;
          }
          const x0 = box.right - textWidth - offset;
          const y0 = (boxTop + box.bottom) / 2 + 9 / 2;
          ctx.fillText(text, Math.round(x0), Math.round(y0));
        }
        break;
      case TextAlignment.TopCenter:
        {
          const toBeShortened = textWidth >= box.right - box.left - 5;
          if (toBeShortened) {
            return;
          }
          const x0 = 0.5 * (box.right + box.left) - textWidth / 2;
          const y0 = box.top + offset + 10;
          ctx.fillText(text, Math.round(x0), Math.round(y0));
        }
        break;
      case TextAlignment.BottomCenter:
        {
          const toBeShortened = textWidth >= box.right - box.left - 5;
          if (toBeShortened) {
            return;
          }
          const x0 = 0.5 * (box.right + box.left) - textWidth / 2;
          const y0 = box.bottom - offset;
          ctx.fillText(text, Math.round(x0), Math.round(y0));
        }
        break;
      case TextAlignment.Center:
        {
          const toBeShortened = textWidth >= box.right - box.left - 5;
          if (toBeShortened && smallerText) {
            text = smallerText;
            textWidth = ctx.measureText(text).width;
          }

          const x0 = 0.5 * (box.right + box.left) - textWidth / 2;
          const y0 = (box.top + box.bottom) / 2 + 9 / 2;
          ctx.fillText(text, Math.round(x0), Math.round(y0));
        }
        break;
      default:
        break;
    }
  }

  setMatrixGetter(getMatrix) {
    this.getMatrix = getMatrix;
  }
};

export { TextAlignment, TextRenderer };
