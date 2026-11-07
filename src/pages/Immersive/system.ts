import * as THREE from 'three'
import { EDGE_COUNT, links, nodes, type SystemLink, type SystemNode } from './systemGraph'

// @group System : Three.js geometry for the diorama — edge curves and the textures the shaders read

export * from './systemGraph'

export interface SystemEdge extends SystemLink {
  curve: THREE.QuadraticBezierCurve3
  /** Distance along the curve in world units */
  length: number
}

/** Height at which edges attach to a node (through the lower half of the slab) */
export const EDGE_Y = 0.22
export const NODE_HEIGHT = 0.62
export const NODE_DEPTH = 0.56

function buildCurve(a: SystemNode, b: SystemNode, index: number) {
  const p0 = new THREE.Vector3(a.x, EDGE_Y, a.z)
  const p2 = new THREE.Vector3(b.x, EDGE_Y, b.z)
  const chord = p0.distanceTo(p2)
  const mid = p0.clone().add(p2).multiplyScalar(0.5)
  // Bow every edge slightly upward and to one side so parallel routes never overlap.
  const side = new THREE.Vector3(-(b.z - a.z), 0, b.x - a.x).normalize()
  const sway = (index % 2 === 0 ? 1 : -1) * (0.18 + chord * 0.05)
  const lift = 0.45 + chord * 0.11
  const p1 = mid.add(side.multiplyScalar(sway)).add(new THREE.Vector3(0, lift, 0))
  const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2)
  return { curve, length: curve.getLength() }
}

export const edges: SystemEdge[] = links.map((link, i) => ({ ...link, ...buildCurve(nodes[link.from], nodes[link.to], i) }))

/** Evenly spaced samples along every edge, packed into one float texture: row = edge, column = t */
export const PATH_SAMPLES = 24

export function buildPathTexture() {
  const data = new Float32Array(PATH_SAMPLES * EDGE_COUNT * 4)
  const point = new THREE.Vector3()
  edges.forEach((edge, row) => {
    for (let s = 0; s < PATH_SAMPLES; s += 1) {
      edge.curve.getPointAt(s / (PATH_SAMPLES - 1), point)
      const o = (row * PATH_SAMPLES + s) * 4
      data[o] = point.x
      data[o + 1] = point.y
      data[o + 2] = point.z
      data[o + 3] = 1
    }
  })
  const texture = new THREE.DataTexture(data, PATH_SAMPLES, EDGE_COUNT, THREE.RGBAFormat, THREE.FloatType)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.needsUpdate = true
  return texture
}

/** Per-edge runtime state as a 1 × EDGE_COUNT float texture: (alive, highlight, trace head, trace glow) */
export function buildStateTexture() {
  const data = new Float32Array(EDGE_COUNT * 4)
  for (let i = 0; i < EDGE_COUNT; i += 1) data[i * 4] = 1
  const texture = new THREE.DataTexture(data, 1, EDGE_COUNT, THREE.RGBAFormat, THREE.FloatType)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.needsUpdate = true
  return texture
}
