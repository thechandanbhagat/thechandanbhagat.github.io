import * as THREE from 'three'
import type { SectionId } from './scrollStore'

// @group System : The distributed system rendered as a living diorama — nodes, edges, flow paths and section focus

export type NodeKind = 'gateway' | 'service' | 'broker' | 'store' | 'ai' | 'sink' | 'delivery'
export type EdgeKind = 'request' | 'event' | 'deploy'

export interface SystemNode {
  id: string
  label: string
  detail: string
  kind: NodeKind
  /** Ground-plane position (x, z); every node stands on y = 0 */
  x: number
  z: number
  /** Slab width in world units */
  width: number
}

export interface SystemEdge {
  from: number
  to: number
  kind: EdgeKind
  /** Relative particle density */
  weight: number
  /** Edge index traffic slides to when this edge is down (self if nothing sensible exists) */
  alt: number
  curve: THREE.QuadraticBezierCurve3
  length: number
}

const NODE_DEFS: Omit<SystemNode, 'width'>[] = [
  { id: 'edge', label: 'Edge · CDN', detail: 'Static assets and TLS termination at the edge', kind: 'gateway', x: -7.6, z: 1.6 },
  { id: 'gateway', label: 'API Gateway', detail: 'Routing, auth and rate limits for every request', kind: 'gateway', x: -5.0, z: 0.5 },
  { id: 'media', label: 'Media API', detail: 'Node.js media and selection services for live venues', kind: 'service', x: -2.4, z: -0.6 },
  { id: 'query', label: 'Query Studio', detail: 'Natural-language to SQL for Turboline AI', kind: 'service', x: -2.4, z: 2.4 },
  { id: 'kafka', label: 'Kafka', detail: 'Event backbone between producers and workers', kind: 'broker', x: 0.6, z: -2.2 },
  { id: 'workers', label: 'Workers', detail: 'Consumers that transcode, schedule and publish', kind: 'service', x: 3.2, z: -3.2 },
  { id: 'playout', label: 'Playout', detail: 'Rendered output for large-format screens', kind: 'sink', x: 6.2, z: -3.6 },
  { id: 'redis', label: 'Redis', detail: 'Hot cache and short-lived state', kind: 'store', x: 0.6, z: 0.9 },
  { id: 'postgres', label: 'Postgres', detail: 'Primary store for schedules, selections and users', kind: 'store', x: 3.2, z: 0.3 },
  { id: 'blob', label: 'Blob Storage', detail: 'Media objects and rendered assets', kind: 'store', x: 5.4, z: -1.2 },
  { id: 'openai', label: 'Azure OpenAI', detail: 'Completions and embeddings behind the RAG flow', kind: 'ai', x: 0.6, z: 4.0 },
  { id: 'vectors', label: 'Vector Index', detail: 'Embeddings for retrieval-augmented answers', kind: 'store', x: 3.4, z: 3.4 },
  { id: 'github', label: 'GitHub', detail: 'Source of truth for every service', kind: 'delivery', x: -7.2, z: -4.6 },
  { id: 'actions', label: 'GitHub Actions', detail: 'Build, test and publish on every push', kind: 'delivery', x: -4.6, z: -5.6 },
  { id: 'registry', label: 'Registries', detail: 'npm, NuGet, Docker Hub and the VS Code Marketplace', kind: 'delivery', x: -1.6, z: -6.6 },
  { id: 'k8s', label: 'Kubernetes', detail: 'Rolling deployments into the cluster', kind: 'delivery', x: 1.6, z: -6.0 },
]

const WIDTH_BY_KIND: Record<NodeKind, number> = {
  gateway: 1.15,
  service: 1.3,
  broker: 1.35,
  store: 1.1,
  ai: 1.3,
  sink: 1.15,
  delivery: 1.25,
}

export const nodes: SystemNode[] = NODE_DEFS.map((n) => ({ ...n, width: WIDTH_BY_KIND[n.kind] }))
export const nodeIndex = Object.fromEntries(nodes.map((n, i) => [n.id, i])) as Record<string, number>

const EDGE_DEFS: [string, string, EdgeKind, number][] = [
  ['edge', 'gateway', 'request', 1.4],
  ['gateway', 'media', 'request', 1.1],
  ['gateway', 'query', 'request', 0.9],
  ['media', 'redis', 'request', 0.9],
  ['media', 'postgres', 'request', 0.8],
  ['query', 'redis', 'request', 0.5],
  ['query', 'postgres', 'request', 0.7],
  ['query', 'openai', 'request', 0.8],
  ['openai', 'vectors', 'request', 0.7],
  ['vectors', 'postgres', 'request', 0.4],
  ['media', 'kafka', 'event', 1.3],
  ['kafka', 'workers', 'event', 1.4],
  ['workers', 'postgres', 'event', 0.6],
  ['workers', 'blob', 'event', 0.9],
  ['blob', 'playout', 'event', 0.8],
  ['workers', 'playout', 'event', 1.0],
  ['github', 'actions', 'deploy', 0.8],
  ['actions', 'registry', 'deploy', 0.8],
  ['registry', 'k8s', 'deploy', 0.7],
  ['k8s', 'media', 'deploy', 0.45],
  ['k8s', 'workers', 'deploy', 0.45],
  ['k8s', 'query', 'deploy', 0.35],
]

/** Height at which edges attach to a node (through the lower half of the slab) */
export const EDGE_Y = 0.22
export const NODE_HEIGHT = 0.62
export const NODE_DEPTH = 0.56

function buildCurve(a: SystemNode, b: SystemNode, index: number) {
  const p0 = new THREE.Vector3(a.x, EDGE_Y, a.z)
  const p2 = new THREE.Vector3(b.x, EDGE_Y, b.z)
  const length = p0.distanceTo(p2)
  const mid = p0.clone().add(p2).multiplyScalar(0.5)
  // Bow every edge slightly upward and to one side so parallel routes never overlap.
  const side = new THREE.Vector3(-(b.z - a.z), 0, b.x - a.x).normalize()
  const sway = (index % 2 === 0 ? 1 : -1) * (0.18 + length * 0.05)
  const lift = 0.45 + length * 0.11
  const p1 = mid.add(side.multiplyScalar(sway)).add(new THREE.Vector3(0, lift, 0))
  return { curve: new THREE.QuadraticBezierCurve3(p0, p1, p2), length }
}

const partial = EDGE_DEFS.map(([from, to, kind, weight], i) => {
  const a = nodes[nodeIndex[from]]
  const b = nodes[nodeIndex[to]]
  const { curve, length } = buildCurve(a, b, i)
  return { from: nodeIndex[from], to: nodeIndex[to], kind, weight, curve, length }
})

/** Traffic on a broken edge slides onto a sibling leaving the same source, else another route into the same target. */
function findAlternate(index: number) {
  const e = partial[index]
  const sameSource = partial.findIndex((o, i) => i !== index && o.from === e.from && o.to !== e.to && o.kind === e.kind)
  if (sameSource >= 0) return sameSource
  const anySource = partial.findIndex((o, i) => i !== index && o.from === e.from && o.to !== e.to)
  if (anySource >= 0) return anySource
  const sameTarget = partial.findIndex((o, i) => i !== index && o.to === e.to && o.from !== e.from)
  if (sameTarget >= 0) return sameTarget
  return index
}

export const edges: SystemEdge[] = partial.map((e, i) => ({ ...e, alt: findAlternate(i) }))
export const NODE_COUNT = nodes.length
export const EDGE_COUNT = edges.length

export const EDGE_KIND_INDEX: Record<EdgeKind, number> = { request: 0, event: 1, deploy: 2 }
export const NODE_KIND_INDEX: Record<NodeKind, number> = {
  gateway: 0,
  service: 0,
  broker: 1,
  store: 2,
  ai: 1,
  sink: 2,
  delivery: 0,
}

/** Which nodes each section of the page draws attention to */
export const sectionFocus: Record<SectionId, string[]> = {
  hero: [],
  about: ['edge', 'gateway', 'media', 'query', 'redis', 'postgres'],
  experience: ['media', 'kafka', 'workers', 'blob', 'playout', 'query', 'openai', 'vectors'],
  capabilities: ['github', 'actions', 'registry', 'k8s'],
  registry: ['actions', 'registry', 'k8s'],
  contact: [],
}

/** Samples along every edge, packed into one float texture: row = edge, column = t */
export const PATH_SAMPLES = 24

export function buildPathTexture() {
  const data = new Float32Array(PATH_SAMPLES * EDGE_COUNT * 4)
  const point = new THREE.Vector3()
  edges.forEach((edge, row) => {
    for (let s = 0; s < PATH_SAMPLES; s += 1) {
      edge.curve.getPoint(s / (PATH_SAMPLES - 1), point)
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

/** Per-edge runtime state as a 1 × EDGE_COUNT float texture: (alive, highlight, kind, alt index) */
export function buildStateTexture() {
  const data = new Float32Array(EDGE_COUNT * 4)
  edges.forEach((edge, i) => {
    data[i * 4] = 1
    data[i * 4 + 1] = 0
    data[i * 4 + 2] = EDGE_KIND_INDEX[edge.kind]
    data[i * 4 + 3] = edge.alt
  })
  const texture = new THREE.DataTexture(data, 1, EDGE_COUNT, THREE.RGBAFormat, THREE.FloatType)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.needsUpdate = true
  return texture
}
