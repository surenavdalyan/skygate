const Geometry = {
  //= ===== Customizable Basic Objects =====================================//
  //= ===== These objects can be re-used, can be used to create complex objects

  FixedTriangle2D: class {
    // Fix p1, make p2,p3 relative
    constructor(p1, p2, p3) {
      this.p = p1;
      this.relativeP1 = [0, 0];
      this.relativeP2 = [p2[0] - p1[0], p2[1] - p1[1]];
      this.relativeP3 = [p3[0] - p1[0], p3[1] - p1[1]];
      this.color = [0.5, 0.5, 1, 1];
    }

    toArrayBuffer() {
      function toVertices(p, rp1, rp2, rp3, c) {
        const dataObj = new Geometry.VertexData();
        const posArray = [
          ...p,
          ...rp1,
          ...c,
          ...p,
          ...rp2,
          ...c,
          ...p,
          ...rp3,
          ...c,
        ];

        const vertexNum = 3;

        dataObj.trglData = posArray;
        dataObj.trglItems = vertexNum;
        return dataObj;
      }

      return toVertices(this.p, this.relativeP1, this.relativeP2, this.relativeP3, this.color);
    }

    setColor(col, alpha = 1) {
      this.color = [col[0] / 256, col[1] / 256, col[2] / 256, alpha];
    }
  },

  FixedDimond2D: class {
    constructor(x, y, w, h) {
      const halfW = w * 0.5;
      const halfH = h * 0.5;
      this.triangles = [
        new Geometry.FixedTriangle2D(
          [x, y],
          [x + halfW, y],
          [x, y - halfH],
        ),
        new Geometry.FixedTriangle2D(
          [x, y],
          [x + halfW, y],
          [x, y + halfH],
        ),
        new Geometry.FixedTriangle2D(
          [x, y],
          [x - halfW, y],
          [x, y - halfH],
        ),
        new Geometry.FixedTriangle2D(
          [x, y],
          [x - halfW, y],
          [x, y + halfH],
        ),
      ];
      this.color = [0.5, 0.5, 1, 1];
    }

    toArrayBuffer() {
      const dataObj = new Geometry.VertexData();
      this.triangles.forEach((tr) => {
        tr.color = this.color;
        dataObj.concat(tr.toArrayBuffer());
      });
      return dataObj;
    }

    setColor(col, alpha = 1) {
      this.color = [col[0] / 256, col[1] / 256, col[2] / 256, alpha];
    }
  },

  FixedRectangle2D: class {
    constructor(x, y, w, h) {
      const halfW = w * 0.5;
      const halfH = h * 0.5;
      this.triangles = [
        new Geometry.FixedTriangle2D(
          [x, y],
          [x - halfW, y - halfH],
          [x + halfW, y - halfH],
        ),
        new Geometry.FixedTriangle2D(
          [x, y],
          [x + halfW, y - halfH],
          [x + halfW, y + halfH],
        ),
        new Geometry.FixedTriangle2D(
          [x, y],
          [x - halfW, y + halfH],
          [x + halfW, y + halfH],
        ),
        new Geometry.FixedTriangle2D(
          [x, y],
          [x - halfW, y - halfH],
          [x - halfW, y + halfH],
        ),
      ];
      this.color = [0.5, 0.5, 1, 1];
    }

    toArrayBuffer() {
      const dataObj = new Geometry.VertexData();
      this.triangles.forEach((tr) => {
        tr.color = this.color;
        dataObj.concat(tr.toArrayBuffer());
      });
      return dataObj;
    }

    setColor(col, alpha = 1) {
      this.color = [col[0] / 256, col[1] / 256, col[2] / 256, alpha];
    }
  },

  // n divisions
  FixedRectDots2D: class {
    constructor(x, y, w, h, n = 3) {
      const halfW = w * 0.5;
      const halfH = h * 0.5;

      this.rectangles = [];
      const dh = h / ((2 * n) - 1);
      for (let i = 0; i < n; i += 1) {
        this.rectangles.push(new Geometry.FixedRectangle2D(
          x,
          (y - h/2 + 0.5 * dh + i * 2 * dh),
          w,
          dh,
        ));
      }
      this.color = [0.5, 0.5, 1, 1];
    }

    toArrayBuffer() {
      const dataObj = new Geometry.VertexData();
      this.rectangles.forEach((rect) => {
        rect.color = this.color;
        dataObj.concat(rect.toArrayBuffer());
      });
      return dataObj;
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
  },
};

export default Geometry;
