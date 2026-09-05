import { EDGE_COUNT, NODE_COUNT, edges, nodes, sectionFocus } from './system'
import { SECTION_IDS } from './scrollStore'

// @group SystemStore : Frame-updated interaction state for the diorama — hover, outages, section focus

/** How long a node stays offline after a click before it heals itself */
export const OUTAGE_MS = 7000

export interface SystemState {
  /** Node index under the pointer, or -1 */
  hovered: number
  /** Node index → timestamp (ms) of when it was taken offline */
  outages: Map<number, number>
  /** Smoothed per-node values written every frame */
  nodeAlive: Float32Array
  nodeHighlight: Float32Array
  nodeLabel: Float32Array
  /** Smoothed per-edge values written every frame */
  edgeAlive: Float32Array
  edgeHighlight: Float32Array
  /** 0 when nothing is focused, 1 when a hover should dim everything else */
  focus: number
  /** Intro reveal 0..1 */
  reveal: number
}

export const systemState: SystemState = {
  hovered: -1,
  outages: new Map(),
  nodeAlive: new Float32Array(NODE_COUNT).fill(1),
  nodeHighlight: new Float32Array(NODE_COUNT),
  nodeLabel: new Float32Array(NODE_COUNT),
  edgeAlive: new Float32Array(EDGE_COUNT).fill(1),
  edgeHighlight: new Float32Array(EDGE_COUNT),
  focus: 0,
  reveal: 0,
}

const focusSets = SECTION_IDS.map((id) => new Set(sectionFocus[id].map((nodeId) => nodes.findIndex((n) => n.id === nodeId))))

type Listener = () => void
const listeners = new Set<Listener>()

export function subscribeSystem(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function setHovered(index: number) {
  if (systemState.hovered === index) return
  systemState.hovered = index
  notify()
}

export function toggleOutage(index: number, now = performance.now()) {
  if (systemState.outages.has(index)) systemState.outages.delete(index)
  else systemState.outages.set(index, now)
  notify()
}

export function isDown(index: number) {
  return systemState.outages.has(index)
}

/** Human-readable reroute target for a node that is offline, if traffic has somewhere to go */
export function rerouteTargetFor(nodeIdx: number): string | null {
  for (let i = 0; i < EDGE_COUNT; i += 1) {
    const e = edges[i]
    if (e.to !== nodeIdx || e.alt === i) continue
    const alt = edges[e.alt]
    return nodes[alt.to].label
  }
  return null
}

function approach(current: number, target: number, rate: number) {
  return current + (target - current) * rate
}

/**
 * Advance smoothed state by one frame.
 * @param dt seconds since last frame
 * @param progress eased section index from the scroll store
 */
export function tickSystem(dt: number, progress: number, ready: boolean, now = performance.now()) {
  const s = systemState
  let changed = false
  s.outages.forEach((startedAt, index) => {
    if (now - startedAt > OUTAGE_MS) {
      s.outages.delete(index)
      changed = true
    }
  })
  if (changed) notify()

  const section = Math.round(progress)
  const focusSet = focusSets[Math.min(section, focusSets.length - 1)]
  const hasSectionFocus = focusSet.size > 0
  const hovered = s.hovered
  const hasHover = hovered >= 0
  const k = Math.min(1, dt * 5)
  const kSlow = Math.min(1, dt * 2.4)

  s.reveal = approach(s.reveal, ready ? 1 : 0, Math.min(1, dt * 1.4))
  s.focus = approach(s.focus, hasHover ? 1 : 0, k)

  for (let i = 0; i < NODE_COUNT; i += 1) {
    const alive = s.outages.has(i) ? 0 : 1
    s.nodeAlive[i] = approach(s.nodeAlive[i], alive, k)
    const inFocus = focusSet.has(i)
    let highlight = inFocus ? 0.45 : 0
    if (hasHover) highlight = i === hovered ? 1 : highlight * 0.5
    s.nodeHighlight[i] = approach(s.nodeHighlight[i], highlight, kSlow)
    const label = i === hovered || s.outages.has(i) ? 1 : inFocus ? 0.85 : hasSectionFocus ? 0.18 : 0.3
    s.nodeLabel[i] = approach(s.nodeLabel[i], label, kSlow)
  }

  for (let i = 0; i < EDGE_COUNT; i += 1) {
    const e = edges[i]
    const alive = Math.min(s.nodeAlive[e.from], s.nodeAlive[e.to])
    s.edgeAlive[i] = alive
    const inFocus = focusSet.has(e.from) && focusSet.has(e.to)
    let highlight = inFocus ? 0.5 : hasSectionFocus ? -0.35 : 0
    if (hasHover) highlight = e.from === hovered || e.to === hovered ? 1 : -0.55
    s.edgeHighlight[i] = approach(s.edgeHighlight[i], highlight, kSlow)
  }
}
