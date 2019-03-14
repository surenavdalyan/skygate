// String literal constants used in the shader
const SHADER_VARS = {
  a_position: 'a_position',
  a_relativePosition: 'a_relativePosition',
  a_color: 'a_color',
  u_matrix: 'u_matrix',
  u_resolution: 'u_resolution',
  a_texCoord: 'a_texCoord',
  u_zvalue: 'u_zvalue',
  a_texturePos: 'a_texturePos',
  u_texture: 'u_texture',
};

const PROGRAMS = {
  COLOR_SHADER_2D: 0,
  TEXTURE_SHADER_2D: 1,
  POINT_TRIANGLE_SHADER_2D: 3,
};

export { PROGRAMS, SHADER_VARS };
