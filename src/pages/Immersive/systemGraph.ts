import type { SectionId } from './scrollStore'

// @group SystemGraph : The system as plain data — nodes, links, journeys and section focus. Kept free of Three.js so the page chrome can use it without pulling the renderer into the first download

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

const EDGE_DEFS: [string, string, EdgeKind][] = [
  ['edge', 'gateway', 'request'],
  ['gateway', 'media', 'request'],
  ['gateway', 'query', 'request'],
  ['media', 'redis', 'request'],
  ['media', 'postgres', 'request'],
  ['query', 'redis', 'request'],
  ['query', 'postgres', 'request'],
  ['query', 'openai', 'request'],
  ['openai', 'vectors', 'request'],
  ['vectors', 'postgres', 'request'],
  ['media', 'kafka', 'event'],
  ['kafka', 'workers', 'event'],
  ['workers', 'postgres', 'event'],
  ['workers', 'blob', 'event'],
  ['blob', 'playout', 'event'],
  ['workers', 'playout', 'event'],
  ['github', 'actions', 'deploy'],
  ['actions', 'registry', 'deploy'],
  ['registry', 'k8s', 'deploy'],
  ['k8s', 'media', 'deploy'],
  ['k8s', 'workers', 'deploy'],
  ['k8s', 'query', 'deploy'],
]

const partial = EDGE_DEFS.map(([from, to, kind]) => ({ from: nodeIndex[from], to: nodeIndex[to], kind }))

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

export interface Journey {
  id: string
  /** Short name shown in the status box while this journey is being traced */
  label: string
  /** Messages per second at normal load */
  rate: number
  /** Node indices in travel order */
  stops: number[]
  /** Edge indices in travel order */
  route: number[]
}

/** Real paths through the system, in the order the page traces them, so the first one crosses the whole map */
const JOURNEY_DEFS: [string, string, number, string[]][] = [
  ['publish', 'Publish to screen', 0.95, ['edge', 'gateway', 'media', 'kafka', 'workers', 'playout']],
  ['ask', 'Ask in English', 0.5, ['edge', 'gateway', 'query', 'openai', 'vectors', 'postgres']],
  ['ship-media', 'Ship Media API', 0.05, ['github', 'actions', 'registry', 'k8s', 'media']],
  ['render', 'Render and store', 0.7, ['edge', 'gateway', 'media', 'kafka', 'workers', 'blob', 'playout']],
  ['cached-read', 'Cached read', 1.3, ['edge', 'gateway', 'media', 'redis']],
  ['ship-workers', 'Ship Workers', 0.05, ['github', 'actions', 'registry', 'k8s', 'workers']],
  ['sql', 'Run generated SQL', 0.35, ['edge', 'gateway', 'query', 'postgres']],
  ['schedule', 'Update a schedule', 0.45, ['edge', 'gateway', 'media', 'kafka', 'workers', 'postgres']],
  ['ship-query', 'Ship Query Studio', 0.05, ['github', 'actions', 'registry', 'k8s', 'query']],
  ['read', 'Database read', 0.55, ['edge', 'gateway', 'media', 'postgres']],
  ['cached-answer', 'Cached answer', 0.3, ['edge', 'gateway', 'query', 'redis']],
]

function routeThrough(stops: number[]) {
  return stops.slice(1).map((to, i) => {
    const edge = links.findIndex((link) => link.from === stops[i] && link.to === to)
    if (edge < 0) throw new Error(`No link from ${nodes[stops[i]].id} to ${nodes[to].id}`)
    return edge
  })
}

export const journeys: Journey[] = JOURNEY_DEFS.map(([id, label, rate, path]) => {
  const stops = path.map((nodeId) => nodeIndex[nodeId])
  return { id, label, rate, stops, route: routeThrough(stops) }
})

/** Seconds a message spends inside a service before it moves on. Model calls and builds are slow, caches are not */
export const processingSeconds: Record<string, number> = {
  gateway: 0.04,
  media: 0.12,
  query: 0.16,
  workers: 0.4,
  openai: 0.95,
  vectors: 0.14,
  blob: 0.2,
  actions: 1,
  registry: 0.4,
  k8s: 0.6,
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
