// @group Shaders : GLSL for the message streaks, the glass nodes, the edge traces and the ground grid

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

export const packetVertex = /* glsl */ `
${pathSampling}

attribute vec2 aStrip; // along the streak (0 tail, 1 head), across it (-1..1)
attribute vec3 aSpan;  // edge, tail t, head t
attribute vec4 aLook;  // kind, width, opacity, lead

uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uReveal;
uniform vec3 uRequest;
uniform vec3 uEvent;
uniform vec3 uDeploy;
uniform vec3 uAlert;

varying vec3 vColor;
varying float vAlpha;
varying vec2 vRibbon;

vec2 toPixels(vec4 clip) {
  return clip.xy / clip.w * uResolution * 0.5;
}

void main() {
  float edge = aSpan.x;
  float along = aStrip.x;
  float t = mix(aSpan.y, aSpan.z, along);

  // Every point of the streak sits on the edge's own curve, so long deploys bend with it.
  mat4 toClip = projectionMatrix * modelViewMatrix;
  vec4 clip = toClip * vec4(samplePath(edge, t), 1.0);
  vec2 heading = toPixels(toClip * vec4(samplePath(edge, t + 0.012), 1.0))
    - toPixels(toClip * vec4(samplePath(edge, t - 0.012), 1.0));
  heading = dot(heading, heading) > 0.000001 ? normalize(heading) : vec2(1.0, 0.0);

  // Thin at the tail, full near the head, narrowing into a tip.
  float taper = smoothstep(0.0, 0.7, along) * (1.0 - 0.55 * smoothstep(0.86, 1.0, along));
  float halfWidth = max(aLook.y * uPixelRatio * (14.0 / clip.w), 0.8 * uPixelRatio) * taper;
  clip.xy += vec2(-heading.y, heading.x) * aStrip.y * halfWidth * 2.0 / uResolution * clip.w;
  gl_Position = clip;

  vec4 st = edgeState(edge);
  float lead = aLook.w;
  float emphasis = 0.72 + 0.28 * clamp(st.y, 0.0, 1.0);
  float dim = 1.0 + min(st.y, 0.0);
  // A message squeezed into a node is nothing but a sliver, so it goes out with it.
  float visible = smoothstep(0.0, 0.03, aSpan.z - aSpan.y);
  vAlpha = aLook.z * mix(emphasis * dim, 1.0, lead) * st.x * visible * uReveal;

  vec3 base = aLook.x > 2.5 ? uAlert : kindColor(aLook.x, uRequest, uEvent, uDeploy);
  vColor = mix(base, vec3(1.0), smoothstep(0.75, 1.0, along) * (0.08 + 0.42 * lead));
  vRibbon = aStrip;
}
`

export const packetFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
varying vec2 vRibbon;

void main() {
  float across = 1.0 - smoothstep(0.35, 1.0, abs(vRibbon.y));
  // Brightest at the head and dissolving along the tail, which is what shows the direction of travel.
  float alpha = across * pow(vRibbon.x, 1.6) * vAlpha;
  if (alpha < 0.004) discard;
  gl_FragColor = vec4(vColor, alpha);
  #include <colorspace_fragment>
}
`

export const linkVertex = /* glsl */ `
${pathSampling}

attribute float aEdge;
attribute float aT;
attribute float aKind;

uniform vec3 uRequest;
uniform vec3 uEvent;
uniform vec3 uDeploy;
uniform float uReveal;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec4 st = edgeState(aEdge);
  vec3 p = samplePath(aEdge, aT);
  vec3 base = kindColor(aKind, uRequest, uEvent, uDeploy);
  float h = clamp(st.y, 0.0, 1.0);
  float dim = 1.0 + min(st.y, 0.0);
  // Line fades toward the middle of the span so nodes read as the anchors, and stops short of the glass.
  float span = 0.55 + 0.45 * abs(aT - 0.5) * 2.0;
  float clearOfNodes = smoothstep(0.03, 0.14, aT) * (1.0 - smoothstep(0.86, 0.97, aT));
  float resting = (0.09 + 0.18 * h) * dim * span * (0.25 + 0.75 * st.x) * clearOfNodes;
  // The stretch the traced message has already covered stays lit behind it.
  float lit = st.w * clearOfNodes * (1.0 - smoothstep(st.z - 0.015, st.z, aT));
  vColor = mix(mix(base, vec3(1.0), h * 0.4), base, lit);
  vAlpha = max(resting, lit * 0.8 * st.x) * uReveal;
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
attribute vec4 aState; // alive, highlight, kind, arrival pulse
attribute float aStagger;

uniform float uReveal;

varying vec3 vLocal;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec4 vState;
varying float vGrow;

void main() {
  vState = aState;
  vLocal = position;
  float grow = smoothstep(aStagger, aStagger + 0.45, uReveal);
  vGrow = grow;
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
varying vec4 vState;
varying float vGrow;

void main() {
  float alive = vState.x;
  float highlight = vState.y;
  float kind = vState.z;
  float arrival = vState.w;

  float fresnel = pow(1.0 - clamp(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0, 1.0), 2.2);
  vec3 tint = kind < 0.5 ? uRim : (kind < 1.5 ? uAccent : uWarm);

  // Body: deep glass with a soft vertical gradient and a fresnel rim.
  float vertical = smoothstep(-0.5, 0.5, vLocal.y);
  vec3 color = mix(uGlass * 0.6, uGlass * 1.4, vertical);
  color += tint * fresnel * (0.45 + highlight * 0.7 + arrival * 1.1);
  // Top face catches a little light; a fine bright lip runs around it.
  float topFace = smoothstep(0.6, 1.0, vWorldNormal.y);
  color += tint * topFace * (0.1 + highlight * 0.2 + arrival * 0.5);
  float topEdge = (1.0 - smoothstep(0.0, 0.03, 0.5 - vLocal.y)) * (1.0 - topFace);
  color += uRim * topEdge * (0.4 + highlight * 0.5 + arrival * 0.9);

  // Status strip along the base: accent when healthy, pulsing alert when offline.
  float strip = 1.0 - smoothstep(0.0, 0.08, vLocal.y + 0.5 - 0.05);
  float pulse = 0.6 + 0.4 * sin(uTime * 5.0);
  vec3 stripColor = mix(uAlert * pulse, uAccent, alive);
  color = mix(color, stripColor, strip * 0.9);

  float alpha = 0.26 + fresnel * 0.5 + topEdge * 0.5 + strip * 0.5 + topFace * 0.08 + highlight * 0.18 + arrival * 0.25;
  // Offline nodes lose their body and keep only the outline.
  alpha *= mix(0.55, 1.0, alive);
  // Flattened into the ground it is nothing but a plate, so it goes out with the last of its height.
  alpha *= smoothstep(0.0, 0.25, vGrow);
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
uniform vec4 uBoundary; // centre x, centre z, half width, half depth
uniform float uBoundaryGlow;
uniform float uBoundaryAlert;
uniform float uFence;
uniform vec3 uAccent;
uniform vec3 uAlert;
varying vec3 vWorld;

float gridLine(vec2 p, float scale, float width) {
  vec2 g = abs(fract(p * scale - 0.5) - 0.5) / fwidth(p * scale);
  float line = 1.0 - min(min(g.x, g.y), 1.0);
  return line * width;
}

/** The dashed line an architecture diagram draws around what it does not trust */
float boundaryLine(vec2 p) {
  vec2 q = abs(p - uBoundary.xy) - uBoundary.zw + 0.3;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.3;
  float width = max(fwidth(d), 0.0001);
  float line = 1.0 - smoothstep(width * 0.8, width * 2.0, abs(d));
  float dash = step(0.4, fract((p.x + p.y) * 1.5));
  return line * mix(dash, 1.0, uBoundaryAlert);
}

void main() {
  vec2 p = vWorld.xz;
  float fine = gridLine(p, 1.0, 1.0);
  float coarse = gridLine(p, 0.25, 1.0);
  float falloff = 1.0 - smoothstep(6.0, 17.0, length(p - vec2(-0.6, -1.4)));
  float grid = (fine * 0.035 + coarse * 0.06) * falloff;
  float fence = boundaryLine(p) * (0.34 + 0.5 * uBoundaryGlow + 0.4 * uBoundaryAlert) * uFence;
  vec3 fenceColor = mix(uAccent, uAlert, uBoundaryAlert);
  float alpha = clamp(grid + fence, 0.0, 1.0);
  gl_FragColor = vec4(mix(uLine, fenceColor, fence / max(alpha, 0.0001)), alpha * uReveal);
  #include <colorspace_fragment>
}
`

export const decalVertex = /* glsl */ `
attribute vec4 aState;
varying vec2 vUv;
varying vec4 vState;
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
varying vec4 vState;
void main() {
  float d = length((vUv - 0.5) * vec2(1.0, 1.6));
  float glow = smoothstep(0.5, 0.0, d);
  glow *= glow;
  vec3 color = mix(uAlert, uAccent, vState.x);
  float alpha = glow * (0.07 + vState.y * 0.12 + vState.w * 0.3 + (1.0 - vState.x) * 0.1) * uReveal;
  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}
`

/** Every voxel of the London skyline is one instance of a cube, and all of its motion happens here */
export const londonVertex = /* glsl */ `
attribute vec3 aHome;
attribute vec3 aTone;
attribute vec3 aMeta; // role, build delay, seed

uniform float uBuild;
uniform float uTime;
uniform float uWheel;
uniform float uLift;
uniform float uMinute;
uniform float uHour;
uniform vec2 uBoat; // distance along the lane, how much of it is showing
uniform vec2 uHub;
uniform vec2 uHingeLeft;
uniform vec2 uHingeRight;
uniform vec2 uDial;
uniform vec3 uWarm;
uniform vec3 uAccent;

varying vec3 vTone;
varying vec3 vFace;
varying vec3 vLight;
varying float vGlow;
varying float vHeight;

/** Share of the build spent waiting for a voxel's turn; the rest is its own flight */
const float WAIT = 0.72;
/** Voxels high: far enough that even the ground floor starts above the top of the screen */
const float DROP = 190.0;
const float BOUNCE = 2.2;

vec2 turn(vec2 p, vec2 pivot, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  p -= pivot;
  return pivot + vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

bool plays(float role, float id) {
  return abs(role - id) < 0.5;
}

void main() {
  float role = aMeta.x;
  float seed = aMeta.z;
  vec3 home = aHome;
  float size = 0.9;
  float glow = 0.0;
  vec3 light = uWarm;

  if (plays(role, 1.0)) home.xy = turn(home.xy, uHub, uWheel);
  else if (plays(role, 2.0)) home.xy = turn(home.xy, uHingeLeft, uLift);
  else if (plays(role, 3.0)) home.xy = turn(home.xy, uHingeRight, -uLift);
  else if (plays(role, 4.0)) {
    home.z += uBoat.x;
    size *= uBoat.y;
  }
  else if (plays(role, 5.0)) glow = 0.72 + 0.2 * sin(uTime * 1.3);
  else if (plays(role, 6.0)) home.xy = turn(home.xy, uDial, -uMinute);
  else if (plays(role, 7.0)) home.xy = turn(home.xy, uDial, -uHour);
  else if (plays(role, 8.0)) {
    // Rooms light up and go dark one at a time rather than all together.
    float beat = floor(uTime * 0.3 + seed * 11.0);
    glow = step(0.5, hash(seed * 91.7 + beat)) * 0.85;
  }
  else if (plays(role, 9.0)) {
    // Long thin glints that slide along the river, the way light breaks on moving water.
    float swell = sin(home.x * 0.09 + home.z * 0.4 + uTime * 0.5) * sin(home.z * 1.7 - uTime * 0.8);
    glow = smoothstep(0.62, 1.0, swell) * (0.2 + seed * 0.3);
    light = uAccent;
  }

  // Every voxel drops from above the screen when its turn comes, gathering speed, and bounces once as it lands.
  // Run backwards, the same path lifts the city off again.
  float flight = clamp((uBuild - aMeta.y * WAIT) / (1.0 - WAIT), 0.0, 1.0);
  float fall = clamp(flight / 0.84, 0.0, 1.0);
  float bounce = clamp((flight - 0.84) / 0.16, 0.0, 1.0);
  float height = DROP * (1.0 - fall * fall) + BOUNCE * 4.0 * bounce * (1.0 - bounce);
  float scatter = (1.0 - fall) * 18.0;
  vec3 spot = vec3(
    home.x + (seed - 0.5) * scatter,
    home.y + height,
    home.z + (fract(seed * 7.31) - 0.5) * scatter
  );
  vec3 voxel = spot + position * size * step(0.001, flight);

  vTone = aTone;
  vFace = normal;
  vLight = light;
  vGlow = glow;
  vHeight = aHome.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(voxel, 1.0);
}
`

export const londonFragment = /* glsl */ `
varying vec3 vTone;
varying vec3 vFace;
varying vec3 vLight;
varying float vGlow;
varying float vHeight;

void main() {
  // One light from above and the right, as flat as the pixels it falls on.
  float face = vFace.y > 0.5 ? 1.0 : (vFace.z > 0.5 ? 0.74 : (vFace.x > 0.5 ? 0.6 : 0.46));
  float depth = mix(0.6, 1.0, smoothstep(0.0, 34.0, vHeight));
  vec3 color = mix(vTone * face * depth, vLight, vGlow);
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`
