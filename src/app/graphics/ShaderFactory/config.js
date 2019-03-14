import { PROGRAMS, SHADER_VARS } from './constants';

const programList = [
  {
    programId: PROGRAMS.COLOR_SHADER_2D,
    vertexShaderId: 'shader-vcol2d',
    fragmentShaderId: 'shader-fcol2d',
    attribs: [
      { name: SHADER_VARS.a_position, type: 'vec2' },
      { name: SHADER_VARS.a_color, type: 'vec4' },
      { name: SHADER_VARS.a_texturePos, type: 'vec2' },
    ],
    uniforms: [
      { name: SHADER_VARS.u_matrix, type: 'mat3' },
      { name: SHADER_VARS.u_resolution, type: 'vec2' },
      { name: SHADER_VARS.u_zvalue, type: 'float' },
      { name: SHADER_VARS.u_texture, type: 'sampler2D' },
    ],
  },
  {
    programId: PROGRAMS.POINT_TRIANGLE_SHADER_2D,
    vertexShaderId: 'shader-v-point-tr2d',
    fragmentShaderId: 'shader-f-point-tr2d',
    attribs: [
      { name: SHADER_VARS.a_position, type: 'vec2' },
      { name: SHADER_VARS.a_relativePosition, type: 'vec2' },
      { name: SHADER_VARS.a_color, type: 'vec4' },
      { name: SHADER_VARS.a_texturePos, type: 'vec2' },
    ],
    uniforms: [
      { name: SHADER_VARS.u_matrix, type: 'mat3' },
      { name: SHADER_VARS.u_resolution, type: 'vec2' },
      { name: SHADER_VARS.u_zvalue, type: 'float' },
      { name: SHADER_VARS.u_texture, type: 'sampler2D' },
    ],
  },
];

export default programList;
