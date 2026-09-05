// @group Shaders : GLSL for the message flow, the glass nodes, the edge traces and the ground grid

/** Shared helpers: sample a point along an edge's baked path and read the edge state row. */
const pathSampling = /* glsl */ `
uniform sampler2D uPath;
uniform sampler2D uState;
uniform float uEdgeCount;
uniform float uSamples;

vec3 samplePath(float edge, float t) {
  float x = clamp(t, 0.0, 1.0) * (uSamples - 1.0);
  float i0 = floor(x);
  float f = x - i0;
  float row = (edge + 0.5) / uEdgeCount;
  vec3 p0 = texture2D(uPath, vec2((i0 + 0.5) / uSamples, row)).xyz;
  vec3 p1 = texture2D(uPath, vec2((min(i0 + 1.0, uSamples - 1.0) + 0.5) / uSamples, row)).xyz;
  return mix(p0, p1, f);
}

vec4 edgeState(float edge) {
  return texture2D(uState, vec2(0.5, (edge + 0.5) / uEdgeCount));
}

vec3 kindColor(float kind, vec3 request, vec3 event, vec3 deploy) {
  if (kind < 0.5) return request;
  if (kind < 1.5) return event;
  return deploy;
}
`

export const flowVertex = /* glsl */ `
${pathSampling}

attribute float aEdge;
attribute float aPhase;
attribute float aRate;
attribute float aSize;
attribute vec3 aOffset;

uniform float uTime;
uniform float uPixelRatio;
uniform float uReveal;
uniform vec3 uRequest;
uniform vec3 uEvent;
uniform vec3 uDeploy;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec4 st = edgeState(aEdge);
  float alive = st.x;
  float highlight = st.y;
  float t = fract(uTime * aRate + aPhase);

  vec3 p = samplePath(aEdge, t);
  vec3 pAlt = samplePath(st.w, t);
  bool hasAlt = abs(st.w - aEdge) > 0.5;
  p = hasAlt ? mix(pAlt, p, alive) : p;
  // Loose, slowly drifting spread so streams read as packets rather than a solid rope.
  float wobble = 1.0 + 0.35 * sin(uTime * 1.4 + aPhase * 31.0);
  p += aOffset * (0.09 * wobble + 0.04 * (1.0 - alive));

  // Fade at both ends so packets appear to leave one node and land in the next.
  float ends = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.9, 1.0, t));
  float presence = hasAlt ? 1.0 : alive;
  float emphasis = 0.55 + 0.45 * clamp(highlight, 0.0, 1.0);
  float dim = 1.0 + min(highlight, 0.0);
  vAlpha = ends * presence * emphasis * dim * uReveal;

  vec3 base = kindColor(st.z, uRequest, uEvent, uDeploy);
  vColor = mix(base, vec3(1.0), clamp(highlight, 0.0, 1.0) * 0.35);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = aSize * (1.0 + clamp(highlight, 0.0, 1.0) * 0.6);
  gl_PointSize = size * uPixelRatio * (28.0 / -mv.z);
}
`

export const flowFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.12, d);
  float alpha = core * vAlpha;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(vColor, alpha * 0.85);
  #include <colorspace_fragment>
}
`

export const linkVertex = /* glsl */ `
${pathSampling}

attribute float aEdge;
attribute float aT;

uniform vec3 uRequest;
uniform vec3 uEvent;
uniform vec3 uDeploy;
uniform float uReveal;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec4 st = edgeState(aEdge);
  vec3 p = samplePath(aEdge, aT);
  vec3 base = kindColor(st.z, uRequest, uEvent, uDeploy);
  float h = clamp(st.y, 0.0, 1.0);
  float dim = 1.0 + min(st.y, 0.0);
  vColor = mix(base, vec3(1.0), h * 0.4);
  // Trace fades toward the middle of the span so nodes read as the anchors.
  float span = 0.55 + 0.45 * abs(aT - 0.5) * 2.0;
  vAlpha = (0.05 + 0.18 * h) * dim * span * (0.25 + 0.75 * st.x) * uReveal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

export const linkFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(vColor, vAlpha);
  #include <colorspace_fragment>
}
`

export const nodeVertex = /* glsl */ `
attribute vec3 aState; // alive, highlight, kind
attribute float aStagger;

uniform float uReveal;

varying vec3 vLocal;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec3 vState;

void main() {
  vState = aState;
  vLocal = position;
  float grow = smoothstep(aStagger, aStagger + 0.45, uReveal);
  vec3 scaled = vec3(position.x, (position.y + 0.5) * grow - 0.5, position.z);
  vec4 world = modelMatrix * instanceMatrix * vec4(scaled, 1.0);
  vWorldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
  vViewDir = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

export const nodeFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uGlass;
uniform vec3 uRim;
uniform vec3 uAccent;
uniform vec3 uWarm;
uniform vec3 uAlert;

varying vec3 vLocal;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec3 vState;

void main() {
  float alive = vState.x;
  float highlight = vState.y;
  float kind = vState.z;

  float fresnel = pow(1.0 - clamp(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0, 1.0), 2.2);
  vec3 tint = kind < 0.5 ? uRim : (kind < 1.5 ? uAccent : uWarm);

  // Body: deep glass with a soft vertical gradient and a fresnel rim.
  float vertical = smoothstep(-0.5, 0.5, vLocal.y);
  vec3 color = mix(uGlass * 0.6, uGlass * 1.4, vertical);
  color += tint * fresnel * (0.45 + highlight * 0.7);
  // Top face catches a little light; a fine bright lip runs around it.
  float topFace = smoothstep(0.6, 1.0, vWorldNormal.y);
  color += tint * topFace * (0.1 + highlight * 0.2);
  float topEdge = (1.0 - smoothstep(0.0, 0.03, 0.5 - vLocal.y)) * (1.0 - topFace);
  color += uRim * topEdge * (0.4 + highlight * 0.5);

  // Status strip along the base: accent when healthy, pulsing alert when offline.
  float strip = 1.0 - smoothstep(0.0, 0.08, vLocal.y + 0.5 - 0.05);
  float pulse = 0.6 + 0.4 * sin(uTime * 5.0);
  vec3 stripColor = mix(uAlert * pulse, uAccent, alive);
  color = mix(color, stripColor, strip * 0.9);

  float alpha = 0.26 + fresnel * 0.5 + topEdge * 0.5 + strip * 0.5 + topFace * 0.08 + highlight * 0.18;
  // Offline nodes lose their body and keep only the outline.
  alpha *= mix(0.55, 1.0, alive);
  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  #include <colorspace_fragment>
}
`

export const groundVertex = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

export const groundFragment = /* glsl */ `
uniform vec3 uLine;
uniform float uReveal;
varying vec3 vWorld;

float gridLine(vec2 p, float scale, float width) {
  vec2 g = abs(fract(p * scale - 0.5) - 0.5) / fwidth(p * scale);
  float line = 1.0 - min(min(g.x, g.y), 1.0);
  return line * width;
}

void main() {
  vec2 p = vWorld.xz;
  float fine = gridLine(p, 1.0, 1.0);
  float coarse = gridLine(p, 0.25, 1.0);
  float falloff = 1.0 - smoothstep(6.0, 17.0, length(p - vec2(-0.6, -1.4)));
  float alpha = (fine * 0.035 + coarse * 0.06) * falloff * uReveal;
  gl_FragColor = vec4(uLine, alpha);
  #include <colorspace_fragment>
}
`

export const decalVertex = /* glsl */ `
attribute vec3 aState;
varying vec2 vUv;
varying vec3 vState;
void main() {
  vUv = uv;
  vState = aState;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
}
`

export const decalFragment = /* glsl */ `
uniform vec3 uAccent;
uniform vec3 uAlert;
uniform float uReveal;
varying vec2 vUv;
varying vec3 vState;
void main() {
  float d = length((vUv - 0.5) * vec2(1.0, 1.6));
  float glow = smoothstep(0.5, 0.0, d);
  glow *= glow;
  vec3 color = mix(uAlert, uAccent, vState.x);
  float alpha = glow * (0.07 + vState.y * 0.12 + (1.0 - vState.x) * 0.1) * uReveal;
  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}
`
