import type { SectionId } from './scrollStore'

// @group SystemGraph : The system as plain data — nodes, links and section focus. Kept free of Three.js so the page chrome can use it without pulling the renderer into the first download

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

export interface SystemLink {
  from: number
  to: number
  kind: EdgeKind
  /** Relative particle density */
  weight: number
  /** Edge index traffic slides to when this edge is down (self if nothing sensible exists) */
  alt: number
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

const partial = EDGE_DEFS.map(([from, to, kind, weight]) => ({ from: nodeIndex[from], to: nodeIndex[to], kind, weight }))

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

export const links: SystemLink[] = partial.map((e, i) => ({ ...e, alt: findAlternate(i) }))
export const NODE_COUNT = nodes.length
export const EDGE_COUNT = links.length

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
