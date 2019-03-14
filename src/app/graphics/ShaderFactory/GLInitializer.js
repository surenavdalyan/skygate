import programList from "./config";

export default class GLInitializer {
  constructor(canvasObj) {
    this.canvas = canvasObj.canvas;
    this.gl = canvasObj.gl;
  }

  init(programIdList) {
    this.initShaders(programIdList);

    // this.locoImage = document.getElementById('locoImg');
    this.initTexture();
  }

  getShader(id) {
    const { gl } = this;
    const shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }

    let str = "";
    let k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType === 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    let shader;
    if (shaderScript.type === "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type === "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  initTexture() {
    const { gl } = this;
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    this.pixelTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.pixelTexture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.

    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.locoImage);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );

    this.imageTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    );
    // Upload the image into the texture.

    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.locoImage);
    const image = new Image();
    image.src = "images/shutwindow0.png"; // "../textureSources/loco.png";
    image.addEventListener("load", () => {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
  }

  createShaderProgram(programId, vshaderId, fshaderId) {
    const { gl } = this;

    if (typeof this.shaderPrograms === "undefined") {
      this.shaderPrograms = [];
    }

    const fragmentShader = this.getShader(fshaderId);
    const vertexShader = this.getShader(vshaderId);

    const shaderProgm = gl.createProgram();
    gl.attachShader(shaderProgm, vertexShader);
    gl.attachShader(shaderProgm, fragmentShader);
    gl.linkProgram(shaderProgm);

    if (!gl.getProgramParameter(shaderProgm, gl.LINK_STATUS)) {
      console.error(`Could not create shader program: ${programId}`);
    }

    this.shaderPrograms[programId] = shaderProgm;
  }

  initShaders(programIdList) {
    let myPrograms = programList;
    if (programIdList) {
      myPrograms = programList.filter(prgm => prgm.programId in programIdList);
    }
    myPrograms.forEach(prgm => {
      this.createShaderProgram(
        prgm.programId,
        prgm.vertexShaderId,
        prgm.fragmentShaderId
      );
      const program = this.shaderPrograms[prgm.programId];
      prgm.attribs.forEach(attrib => {
        program.registerAttrib(this.gl, attrib.name, attrib.type);
      });

      prgm.uniforms.forEach(uniform => {
        program.registerUniform(this.gl, uniform.name, uniform.type);
      });
    });
  }
}

WebGLProgram.prototype.registerAttrib = function registerAttrib(
  gl,
  attribName,
  type
) {
  if (typeof this.attribs === "undefined") {
    this.attribs = {};
  }

  const attrib = gl.getAttribLocation(this, attribName);

  this.attribs[attribName] = {
    location: attrib,
    type
  };
};

WebGLProgram.prototype.registerUniform = function registerUniform(
  gl,
  uniformName,
  type
) {
  if (typeof this.uniforms === "undefined") {
    this.uniforms = {};
  }

  const uniform = gl.getUniformLocation(this, uniformName);

  this.uniforms[uniformName] = {
    location: uniform,
    type
  };
};
