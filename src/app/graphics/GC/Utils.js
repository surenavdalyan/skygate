import { m3 } from '../lib/m3';

const Utils = {
  transformBox(matrix, box) {
    const newLeftTop = m3.multiplyVec(matrix, [box.left, box.top, 1]);
    const newRightBottom = m3.multiplyVec(matrix, [box.right, box.bottom, 1]);
    return {
      left: newLeftTop[0],
      top: newLeftTop[1],
      right: newRightBottom[0],
      bottom: newRightBottom[1],
    };
  },

  transformPoint(matrix, pt) {
    const newLeftTop = m3.multiplyVec(matrix, [pt.x, pt.y, 1]);
    return {
      x: newLeftTop[0],
      y: newLeftTop[1],
    };
  },
};

export default Utils;
