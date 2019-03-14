const Geometry = {
  //= ===== Customizable Basic Objects =====================================//
  //= ===== These objects can be re-used, can be used to create complex objects

  Rectangle2D: class {
    constructor(left, top, width, height) {
      this.top = top;
      this.left = left;
      this.width = width;
      this.height = height;
      this.color = [0.5, 0.5, 1, 1];
    }

    toArrayBuffer() {
      function toRectVertices(x1, y1, x2, y2, color, enableTexture = false) {
        const dataObj = new Geometry.VertexData();
        let t1 = [];
        let t2 = [];
        let t3 = [];
        let t4 = [];
        if (enableTexture) {
          t1 = [0, 0];
          t2 = [1, 0];
          t3 = [0, 1];
          t4 = [1, 1];
        }
        const posArray = [
          x1,
          y1,
          ...color,
          ...t1,
          x2,
          y1,
          ...color,
          ...t2,
          x1,
          y2,
          ...color,
          ...t3,
          x1,
          y2,
          ...color,
          ...t3,
          x2,
          y1,
          ...color,
          ...t2,
          x2,
          y2,
          ...color,
          ...t4
        ];

        const vertexNum = 6;

        dataObj.trglData = posArray;
        dataObj.trglItems += vertexNum;
        return dataObj;
      }

      const x1 = this.left;
      const y1 = this.top;
      const x2 = this.left + this.width;
      const y2 = this.top + this.height;
      return toRectVertices(x1, y1, x2, y2, this.color, this.enableTexture);
    }

    getBoundingBox() {
      return {
        top: this.top,
        left: this.left,
        bottom: this.top + this.height,
        right: this.left + this.width
      };
    }

    setColor(col, alpha = 1) {
      this.color = [col[0] / 256, col[1] / 256, col[2] / 256, alpha];
    }
  },

  LineGroup2D: class {
    constructor(lineSegmentList) {
      this.lineSegs = [];
      lineSegmentList.forEach(lineSeg => {
        const lineSegObj = new Geometry.LineSegment2D(lineSeg[0], lineSeg[1]);
        this.lineSegs.push(lineSegObj);
      });
      this.color = [0.5, 1, 0.5, 1];
    }

    toArrayBuffer() {
      const dataObj = new Geometry.VertexData();
      this.lineSegs.forEach(lineSegObj => {
        lineSegObj.color = this.color;
        dataObj.concat(lineSegObj.toArrayBuffer());
      });
      return dataObj;
    }

    setColor(col, alpha = 1) {
      this.color = [col[0] / 256, col[1] / 256, col[2] / 256, alpha];
    }
  },

  BorderedRectangle2D: class {
    constructor(left, top, width, height) {
      this.rect = new Geometry.Rectangle2D(left+1, top+1, width-2, height-2);
      this.linegroup = new Geometry.LineGroup2D([
        [[left, top], [left + width, top]],
        [[left + width, top], [left + width, top + height]],
        [[left + width, top + height], [left, top + height]],
        [[left, top], [left, top + height]]
      ]);
      this.color = [0.5, 1, 0.5, 1];
      this.borderColor = [1.0, 1, 1.0, 1];
    }

    setColor(col, alpha = 1) {
      this.color = [col[0] / 256, col[1] / 256, col[2] / 256, alpha];
    }

    setBorderColor(col, alpha = 1) {
      this.borderColor = [col[0] / 256, col[1] / 256, col[2] / 256, alpha];
    }

    toArrayBuffer() {
      this.rect.color = this.color;
      this.linegroup.color = this.borderColor;
      const dataObj = new Geometry.VertexData();
      dataObj.concat(this.rect.toArrayBuffer());
      dataObj.concat(this.linegroup.toArrayBuffer());
      return dataObj;
    }
  },

  LineSegment2D: class {
    constructor(p1, p2) {
      this.p1 = p1;
      this.p2 = p2;
      this.color = [0.5, 1, 0.5, 1];
    }

    toArrayBuffer() {
      function toRectVertices(p1, p2, color) {
        const dataObj = new Geometry.VertexData();
        const posArray = [...p1, ...p2];

        const vertexNum = parseInt(posArray.length / 2, 10);

        // Pos vertices and Color in the buffer
        for (let i = 0; i < vertexNum; i++) {
          dataObj.lineData.push(posArray[2 * i]);
          dataObj.lineData.push(posArray[2 * i + 1]);
          dataObj.lineData.push(...color);
        }
        dataObj.lineItems += vertexNum;
        return dataObj;
      }
      return toRectVertices(this.p1, this.p2, this.color);
    }

    setColor(col, alpha = 1) {
      this.color = [col[0] / 256, col[1] / 256, col[2] / 256, alpha];
    }
  },

  VertexData: class {
    constructor() {
      this.lineData = [];
      this.trglData = [];
      this.lineItems = 0;
      this.trglItems = 0;
    }

    concat(vertexData2) {
      this.lineData = this.lineData.concat(vertexData2.lineData);
      this.trglData = this.trglData.concat(vertexData2.trglData);
      this.lineItems += vertexData2.lineItems;
      this.trglItems += vertexData2.trglItems;
      return this;
    }
  }
};

export default Geometry;
