// @group Shaders : GLSL for the morphing particle field and the pearlescent core

const simplexNoise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

export const particleVertex = /* glsl */ `
${simplexNoise}

attribute vec3 aShape0;
attribute vec3 aShape1;
attribute vec3 aShape2;
attribute vec3 aShape3;
attribute vec3 aShape4;
attribute vec3 aShape5;
attribute float aRand;
attribute float aSeed;

uniform float uTime;
uniform float uFrom;
uniform float uTo;
uniform float uMix;
uniform float uPixelRatio;
uniform vec3 uMouse;
uniform float uMouseStrength;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

varying float vAlpha;
varying vec3 vColor;

vec3 pickShape(float index) {
  if (index < 0.5) return aShape0;
  if (index < 1.5) return aShape1;
  if (index < 2.5) return aShape2;
  if (index < 3.5) return aShape3;
  if (index < 4.5) return aShape4;
  return aShape5;
}

void main() {
  vec3 from = pickShape(uFrom);
  vec3 to = pickShape(uTo);

  // Per-particle staggered easing so the swarm peels apart instead of sliding as a block.
  float t = clamp((uMix - aRand * 0.4) / 0.6, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(from, to, t);

  // Gentle outward arc mid-transition.
  float arc = sin(t * 3.14159265);
  p += normalize(p + vec3(0.0001, 0.0002, 0.0003)) * arc * (0.4 + aRand * 0.8);

  // Slow organic drift.
  float n1 = snoise(p * 0.7 + vec3(uTime * 0.12, 0.0, 0.0));
  float n2 = snoise(p * 0.7 + vec3(0.0, uTime * 0.1, 31.0));
  float n3 = snoise(p * 0.7 + vec3(53.0, 0.0, uTime * 0.14));
  p += vec3(n1, n2, n3) * 0.12 * (0.6 + aSeed * 0.8);

  vec4 world = modelMatrix * vec4(p, 1.0);

  // Pointer repulsion in world space.
  vec3 diff = world.xyz - uMouse;
  float push = smoothstep(2.0, 0.0, length(diff)) * uMouseStrength;
  world.xyz += normalize(diff + vec3(0.0001)) * push;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  float size = (0.45 + aRand * 1.1) * (1.0 + arc * 0.6);
  gl_PointSize = size * uPixelRatio * (9.0 / max(-mv.z, 0.1));

  float depthFade = smoothstep(-22.0, -2.0, mv.z);
  vAlpha = (0.3 + aSeed * 0.6) * depthFade;

  vec3 base = mix(uColorA, uColorB, clamp(0.5 + 0.5 * n1, 0.0, 1.0));
  vColor = mix(base, uColorC, aSeed * aSeed * 0.7);
}
`

export const particleFragment = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float soft = smoothstep(0.5, 0.05, d);
  float core = smoothstep(0.16, 0.0, d);
  gl_FragColor = vec4(vColor + core * 0.3, soft * soft * vAlpha);
}
`

export const coreVertex = /* glsl */ `
${simplexNoise}

uniform float uTime;
uniform float uDistort;

varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

void main() {
  float n = snoise(position * 1.6 + vec3(uTime * 0.3, uTime * 0.2, -uTime * 0.25));
  float n2 = snoise(position * 4.2 - vec3(uTime * 0.4));
  float disp = (n * 0.14 + n2 * 0.03) * uDistort;
  vec4 mv = modelViewMatrix * vec4(position + normal * disp, 1.0);

  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  vDisp = disp;

  gl_Position = projectionMatrix * mv;
}
`

export const coreFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uTintA;
uniform vec3 uTintB;
uniform vec3 uTintC;

varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

// Low-amplitude pearlescent palette: mostly silver with a faint blue shimmer.
vec3 palette(float t) {
  return vec3(0.82, 0.85, 0.9) + vec3(0.1, 0.08, 0.12) * cos(6.28318 * (t + vec3(0.0, 0.2, 0.5)));
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  float fresnel = pow(1.0 - ndv, 2.6);

  vec3 sheen = palette(fresnel * 1.6 + vDisp * 2.5 + uTime * 0.08);
  vec3 tint = mix(uTintA, uTintB, smoothstep(-0.2, 0.2, vDisp));
  tint = mix(tint, uTintC, fresnel);

  vec3 color = mix(tint, sheen, 0.35) * (0.16 + fresnel * 1.25);
  color += uTintC * pow(1.0 - ndv, 6.0) * 1.1;

  vec3 h = normalize(normalize(vec3(0.6, 0.9, 0.7)) + v);
  color += vec3(1.0) * pow(max(dot(n, h), 0.0), 60.0) * 0.6;

  gl_FragColor = vec4(color, 1.0);
}
`
