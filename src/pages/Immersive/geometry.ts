// @group Geometry : Procedural point-cloud targets for each section of the immersive page

type Writer = (i: number, x: number, y: number, z: number) => void

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

function seededRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Section 0 · Hero: a Fibonacci sphere shell with a soft inner halo */
function sphere(count: number, write: Writer, rand: () => number) {
  for (let i = 0; i < count; i += 1) {
    const shell = rand() < 0.82 ? 1 : 0.55 + rand() * 0.3
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = GOLDEN_ANGLE * i
    const radius = 2.5 * shell
    write(i, Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius)
  }
}

/** Section 1 · About: a torus knot, the "systems thinking" motif */
function torusKnot(count: number, write: Writer, rand: () => number) {
  const p = 2
  const q = 3
  const R = 1.7
  const tube = 0.42
  for (let i = 0; i < count; i += 1) {
    const t = (i / count) * Math.PI * 2 * 1
    const u = t * p
    const cu = Math.cos(u)
    const su = Math.sin(u)
    const quOverP = (q / p) * u
    const cs = Math.cos(quOverP)
    const cx = R * (2 + cs) * 0.5 * cu
    const cy = R * (2 + cs) * 0.5 * su
    const cz = R * Math.sin(quOverP) * 0.5

    // Tangent-ish offset to distribute points around the tube.
    const angle = rand() * Math.PI * 2
    const spread = tube * Math.sqrt(rand())
    const ox = Math.cos(angle) * spread
    const oy = Math.sin(angle) * spread
    write(i, cx + ox * su + cs * 0.1 * ox, cy - ox * cu + oy * 0.3, cz + oy)
  }
}

/** Section 2 · Experience: a double helix timeline */
function helix(count: number, write: Writer, rand: () => number) {
  const turns = 3.2
  const height = 5.6
  const radius = 1.35
  for (let i = 0; i < count; i += 1) {
    const strand = i % 2
    const t = i / count
    const angle = t * Math.PI * 2 * turns + strand * Math.PI
    const y = (t - 0.5) * height
    const isRung = rand() < 0.16
    if (isRung) {
      const k = rand() * 2 - 1
      const a = t * Math.PI * 2 * turns
      write(i, Math.cos(a) * radius * k, y, Math.sin(a) * radius * k)
    } else {
      const jitter = (rand() - 0.5) * 0.18
      write(i, Math.cos(angle) * (radius + jitter), y + (rand() - 0.5) * 0.08, Math.sin(angle) * (radius + jitter))
    }
  }
}

/** Section 3 · Capabilities: a snapped cubic lattice, structured and engineered */
function lattice(count: number, write: Writer, rand: () => number) {
  const cells = 11
  const size = 4.2
  const step = size / (cells - 1)
  for (let i = 0; i < count; i += 1) {
    const gx = Math.floor(rand() * cells)
    const gy = Math.floor(rand() * cells)
    const gz = Math.floor(rand() * cells)
    // Favour the outer shell so the cube reads clearly from any angle.
    const onEdge = gx === 0 || gy === 0 || gz === 0 || gx === cells - 1 || gy === cells - 1 || gz === cells - 1
    const keep = onEdge || rand() < 0.35
    const x = (keep ? gx : Math.floor(rand() * cells)) * step - size / 2
    const y = gy * step - size / 2
    const z = gz * step - size / 2
    write(i, x + (rand() - 0.5) * 0.04, y + (rand() - 0.5) * 0.04, z + (rand() - 0.5) * 0.04)
  }
}

/** Section 4 · Registry: a spiral galaxy of published artifacts */
function galaxy(count: number, write: Writer, rand: () => number) {
  const arms = 3
  const radiusMax = 3.4
  for (let i = 0; i < count; i += 1) {
    const r = Math.pow(rand(), 0.6) * radiusMax
    const arm = i % arms
    const spin = r * 1.9
    const armAngle = (arm / arms) * Math.PI * 2
    const spreadScale = Math.pow(rand(), 3) * (rand() < 0.5 ? 1 : -1)
    const rx = spreadScale * 0.45 * r * 0.35
    const ry = Math.pow(rand(), 3) * (rand() < 0.5 ? 1 : -1) * 0.22
    const rz = Math.pow(rand(), 3) * (rand() < 0.5 ? 1 : -1) * 0.45 * r * 0.35
    const angle = armAngle + spin
    write(i, Math.cos(angle) * r + rx, ry * (1.4 - r / radiusMax), Math.sin(angle) * r + rz)
  }
}

/** Section 5 · Contact: a portal ring with an inner vortex */
function portal(count: number, write: Writer, rand: () => number) {
  const R = 2.55
  const tube = 0.32
  for (let i = 0; i < count; i += 1) {
    const inner = rand() < 0.22
    if (inner) {
      const a = rand() * Math.PI * 2
      const r = Math.sqrt(rand()) * (R - 0.4)
      const swirl = a + r * 1.2
      write(i, Math.cos(swirl) * r, (rand() - 0.5) * 0.12, Math.sin(swirl) * r)
    } else {
      const u = rand() * Math.PI * 2
      const v = rand() * Math.PI * 2
      const t = tube * Math.sqrt(rand())
      write(i, (R + t * Math.cos(v)) * Math.cos(u), t * Math.sin(v), (R + t * Math.cos(v)) * Math.sin(u))
    }
  }
}

export const shapeBuilders = [sphere, torusKnot, helix, lattice, galaxy, portal]

export interface ParticleBuffers {
  shapes: Float32Array[]
  rand: Float32Array
  seed: Float32Array
  /** Placeholder position attribute required by three.js; equals shape 0 */
  position: Float32Array
}

export function buildParticleBuffers(count: number): ParticleBuffers {
  const shapes = shapeBuilders.map((builder, shapeIndex) => {
    const arr = new Float32Array(count * 3)
    const rand = seededRandom(1337 + shapeIndex * 7919)
    builder(
      count,
      (i, x, y, z) => {
        arr[i * 3] = x
        arr[i * 3 + 1] = y
        arr[i * 3 + 2] = z
      },
      rand
    )
    return arr
  })

  // Shuffle each shape's point order independently so morphs cross-pollinate rather than tracking index-to-index.
  for (let s = 1; s < shapes.length; s += 1) {
    const arr = shapes[s]
    const rand = seededRandom(42 + s)
    for (let i = count - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1))
      for (let k = 0; k < 3; k += 1) {
        const tmp = arr[i * 3 + k]
        arr[i * 3 + k] = arr[j * 3 + k]
        arr[j * 3 + k] = tmp
      }
    }
  }

  const rand = new Float32Array(count)
  const seed = new Float32Array(count)
  const r1 = seededRandom(99)
  const r2 = seededRandom(7)
  for (let i = 0; i < count; i += 1) {
    rand[i] = r1()
    seed[i] = r2()
  }

  return { shapes, rand, seed, position: shapes[0] }
}
