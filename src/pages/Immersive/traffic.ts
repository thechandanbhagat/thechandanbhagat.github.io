import type { Vector3 } from 'three'
import { EDGE_COUNT, EDGE_KIND_INDEX, NODE_COUNT, edges, journeys, links, nodeIndex, nodes, processingSeconds, sectionFocus, type EdgeKind } from './system'
import { SECTION_IDS } from './scrollStore'
import { isDown, setTrace, systemState } from './systemStore'

// @group Traffic : Simulates individual messages travelling whole journeys, so nodes can react when something actually reaches them

/** Each kind of traffic has its own feel: quick single requests, short event dashes, slow heavy deploys */
const HOP_STYLE: Record<EdgeKind, { speed: number; streak: number; width: number; pulse: number }> = {
  request: { speed: 2.4, streak: 0.62, width: 2.8, pulse: 0.16 },
  event: { speed: 2.8, streak: 0.26, width: 3.2, pulse: 0.22 },
  deploy: { speed: 1.6, streak: 1.7, width: 4.2, pulse: 0.7 },
  token: { speed: 3.4, streak: 0.13, width: 2.2, pulse: 0.02 },
}

/** A model reply is not one message: it streams back as a run of tokens */
const TOKENS_PER_REPLY = 7
const TOKEN_SPACING_SECONDS = 0.075

/** Colour index the shader reads as a refusal */
const REFUSED_KIND = 3

/** The traced message moves slower and larger than the traffic around it, so the eye can follow it */
const LEAD_SPEED = 0.9
const LEAD_STREAK = 1.5
const LEAD_WIDTH = 1.5

/** Once the head lands, the tail is drawn in quickly so a long streak does not stall at every node */
const TAIL_CATCH_UP = 3

/** Consumers poll on a timer, so events pile up in Kafka and leave together */
const KAFKA_POLL_SECONDS = 1.7
const BATCH_SPACING_SECONDS = 0.1

const DEFAULT_PROCESSING_SECONDS = 0.05
const PULSE_SECONDS = 0.28
const TRACE_FADE_SECONDS = 1.1
const FIRST_TRACE_SECONDS = 2.2
const TRACE_GAP_SECONDS = 2.6
const TRACE_RETRY_SECONDS = 1
const BOUNDARY_ALERT_SECONDS = 0.5

/** Load rises and falls slowly so the system never settles into a visible loop */
const LOAD_WAVE_SECONDS = 26
const LOAD_WAVE_DEPTH = 0.25

/** Traffic starts once the nodes are visible, so the system fills up from its entry points */
const START_AT_REVEAL = 0.35

const KAFKA = nodeIndex.kafka
const GATEWAY = nodeIndex.guard
const AUDIT_ENTRY = journeys.findIndex((journey) => journey.id === 'audit')
const TOKEN = journeys.findIndex((journey) => journey.id === 'token')

/** Everything worth following; side trips like audit entries only happen because of another message */
const allJourneys = journeys.flatMap((journey, i) => (journey.rate > 0 ? [i] : []))

/** Journeys worth tracing in each section: those that run through what the camera is looking at */
const sectionPools = SECTION_IDS.map((id) => {
  const focus = new Set(sectionFocus[id].map((nodeId) => nodeIndex[nodeId]))
  const matching = allJourneys.filter((j) => journeys[j].stops.filter((stop) => focus.has(stop)).length >= 3)
  return matching.length > 0 ? matching : allJourneys
})

const nodePools = nodes.map((_, node) => allJourneys.filter((j) => journeys[j].stops.includes(node)))

interface Packet {
  phase: 'idle' | 'moving' | 'processing' | 'queued'
  journey: number
  hop: number
  edge: number
  /** Distance past the start of the edge; runs beyond its length while the tail catches up */
  travelled: number
  speed: number
  streak: number
  wait: number
  arrived: boolean
  /** Took a sibling route around an outage, so the journey ends at the next node */
  rerouted: boolean
  /** Its tokens have already gone ahead on this model reply */
  replying: boolean
  /** Coming back from the gateway with a no */
  refused: boolean
  lead: boolean
}

function edgeIsUp(edge: number) {
  return !isDown(links[edge].from) && !isDown(links[edge].to)
}

/** The edge a message at this point can really take, or -1 if nothing leaves the source */
function usableEdge(wanted: number) {
  if (edgeIsUp(wanted)) return wanted
  const { alt, from } = links[wanted]
  return links[alt].from === from && edgeIsUp(alt) ? alt : -1
}

export class Traffic {
  private readonly packets: Packet[]
  private readonly idle: Packet[]
  private readonly nextSpawn: Float32Array
  private clock = 0
  private pollIn = KAFKA_POLL_SECONDS
  private lead: Packet | null = null
  private leadIn = FIRST_TRACE_SECONDS
  private turn = 0
  private section = 0
  private hovered = -1

  constructor(
    capacity: number,
    private readonly load: number,
    private readonly random: () => number = Math.random
  ) {
    this.packets = Array.from({ length: capacity }, () => ({
      phase: 'idle' as const,
      journey: 0,
      hop: 0,
      edge: 0,
      travelled: 0,
      speed: 0,
      streak: 0,
      wait: 0,
      arrived: false,
      rerouted: false,
      replying: false,
      refused: false,
      lead: false,
    }))
    this.idle = [...this.packets]
    this.nextSpawn = Float32Array.from(journeys, (journey) => (journey.rate > 0 ? this.interval(journey.rate) : Infinity))
  }

  /** Random gaps rather than a fixed beat, the way independent users really arrive */
  private interval(rate: number) {
    return -Math.log(1 - this.random()) / (rate * this.load)
  }

  /** @param dt seconds of simulated time @param progress eased section index from the scroll store */
  tick(dt: number, progress: number) {
    this.fade(dt)
    if (systemState.reveal < START_AT_REVEAL) return
    this.clock += dt
    this.spawn(dt)
    this.pollKafka(dt)
    this.packets.forEach((packet) => this.advance(packet, dt))
    this.steerTrace(dt, Math.min(Math.round(progress), SECTION_IDS.length - 1))
  }

  private fade(dt: number) {
    const s = systemState
    const pulse = Math.exp(-dt / PULSE_SECONDS)
    for (let i = 0; i < NODE_COUNT; i += 1) s.nodePulse[i] *= pulse
    s.boundaryAlert *= Math.exp(-dt / BOUNDARY_ALERT_SECONDS)
    // A trace stays lit for its whole journey, then the route lets go all at once.
    if (this.lead) return
    const glow = Math.exp(-dt / TRACE_FADE_SECONDS)
    for (let i = 0; i < NODE_COUNT; i += 1) s.nodeTrace[i] *= glow
    for (let i = 0; i < EDGE_COUNT; i += 1) s.edgeTraceGlow[i] *= glow
  }

  private spawn(dt: number) {
    const wave = 1 + LOAD_WAVE_DEPTH * Math.sin((this.clock / LOAD_WAVE_SECONDS) * Math.PI * 2)
    journeys.forEach((journey, index) => {
      this.nextSpawn[index] -= dt * wave
      while (this.nextSpawn[index] <= 0) {
        this.launch(index, false)
        this.nextSpawn[index] += this.interval(journey.rate)
      }
    })
  }

  private pollKafka(dt: number) {
    this.pollIn -= dt
    if (this.pollIn > 0) return
    this.pollIn += KAFKA_POLL_SECONDS
    let position = 0
    this.packets.forEach((packet) => {
      if (packet.phase !== 'queued') return
      packet.phase = 'processing'
      packet.wait = position * BATCH_SPACING_SECONDS
      position += 1
    })
  }

  private launch(journey: number, lead: boolean) {
    const packet = this.idle.pop()
    if (!packet) return null
    packet.journey = journey
    packet.lead = lead
    return this.enterHop(packet, 0) ? packet : null
  }

  /** A side trip caused by another message, starting after a delay */
  private launchAfter(journey: number, delay: number) {
    const packet = this.idle.pop()
    if (!packet) return
    packet.journey = journey
    packet.edge = journeys[journey].route[0]
    packet.hop = -1
    packet.phase = 'processing'
    packet.wait = delay
  }

  private enterHop(packet: Packet, hop: number) {
    const journey = journeys[packet.journey]
    const wanted = journey.route[hop]
    const edge = usableEdge(wanted)
    if (edge < 0) {
      this.retire(packet)
      return false
    }
    // The tokens go first, and the message that carries the journey on follows the last of them.
    if (links[edge].kind === 'token' && journey.rate > 0 && !packet.replying) {
      for (let i = 0; i < TOKENS_PER_REPLY; i += 1) this.launchAfter(TOKEN, i * TOKEN_SPACING_SECONDS)
      packet.replying = true
      packet.hop = hop - 1
      packet.phase = 'processing'
      packet.wait = TOKENS_PER_REPLY * TOKEN_SPACING_SECONDS
      return true
    }
    packet.replying = false
    packet.refused = journey.refused && hop === journey.route.length - 1
    if (packet.refused) systemState.boundaryAlert = 1
    const style = HOP_STYLE[links[edge].kind]
    packet.phase = 'moving'
    packet.hop = hop
    packet.edge = edge
    packet.rerouted = edge !== wanted
    packet.travelled = 0
    packet.arrived = false
    packet.speed = style.speed * (packet.lead ? LEAD_SPEED : 1)
    packet.streak = style.streak * (packet.lead ? LEAD_STREAK : 1)
    if (packet.lead) {
      systemState.edgeTraceGlow[edge] = 1
      systemState.nodeTrace[links[edge].from] = 1
    }
    return true
  }

  private advance(packet: Packet, dt: number) {
    if (packet.phase === 'idle') return
    if (packet.phase === 'moving') {
      this.move(packet, dt)
      return
    }
    if (isDown(links[packet.edge].to)) {
      this.retire(packet)
      return
    }
    if (packet.phase === 'queued') return
    packet.wait -= dt
    if (packet.wait <= 0) this.enterHop(packet, packet.hop + 1)
  }

  private move(packet: Packet, dt: number) {
    if (systemState.edgeAlive[packet.edge] < 0.04) {
      this.retire(packet)
      return
    }
    packet.travelled += packet.speed * (packet.arrived ? TAIL_CATCH_UP : 1) * dt
    const { length } = edges[packet.edge]
    // Past 1 so the shader treats the far end of the edge as fully lit. A loop's second lap keeps what the first one lit.
    if (packet.lead) {
      const head = systemState.edgeTraceHead
      head[packet.edge] = Math.max(head[packet.edge], Math.min(packet.travelled / length, 1.02))
    }
    if (!packet.arrived && packet.travelled >= length) this.arrive(packet)
    if (packet.travelled >= length + packet.streak) this.leaveEdge(packet)
  }

  private arrive(packet: Packet) {
    packet.arrived = true
    const node = links[packet.edge].to
    const { pulse } = HOP_STYLE[links[packet.edge].kind]
    systemState.nodePulse[node] = Math.min(1, systemState.nodePulse[node] + (packet.lead ? 1 : pulse))
    if (packet.lead) systemState.nodeTrace[node] = 1
    // Audit before action: the record leaves the gateway before the decision is carried out.
    if (node === GATEWAY && journeys[packet.journey].rate > 0) this.launchAfter(AUDIT_ENTRY, 0)
  }

  private leaveEdge(packet: Packet) {
    const finished = packet.rerouted || packet.hop + 1 >= journeys[packet.journey].route.length
    if (finished) {
      this.retire(packet)
      return
    }
    const node = links[packet.edge].to
    if (node === KAFKA) {
      packet.phase = 'queued'
      return
    }
    const seconds = processingSeconds[nodes[node].id] ?? DEFAULT_PROCESSING_SECONDS
    packet.phase = 'processing'
    packet.wait = seconds * (0.85 + this.random() * 0.3)
  }

  private retire(packet: Packet) {
    if (packet === this.lead) this.endTrace()
    packet.phase = 'idle'
    packet.lead = false
    packet.replying = false
    packet.refused = false
    this.idle.push(packet)
  }

  private endTrace() {
    if (this.lead) this.lead.lead = false
    this.lead = null
    this.leadIn = TRACE_GAP_SECONDS
    setTrace(-1)
  }

  private steerTrace(dt: number, section: number) {
    const sectionPool = sectionPools[section]
    if (section !== this.section) {
      this.section = section
      // The camera has moved on, so a trace it can no longer see gives way to one it can.
      if (this.lead && !sectionPool.includes(this.lead.journey)) this.endTrace()
      this.leadIn = Math.min(this.leadIn, 0.4)
    }
    const { hovered } = systemState
    if (hovered !== this.hovered) {
      this.hovered = hovered
      if (hovered >= 0) this.leadIn = Math.min(this.leadIn, 0.2)
    }
    if (this.lead) return
    this.leadIn -= dt
    if (this.leadIn > 0) return

    const pool = hovered >= 0 ? nodePools[hovered] : sectionPool
    const journey = pool[this.turn % pool.length]
    this.turn += 1
    this.startTrace(journey)
  }

  private startTrace(journey: number) {
    const s = systemState
    s.nodeTrace.fill(0)
    s.edgeTraceHead.fill(0)
    s.edgeTraceGlow.fill(0)
    const packet = this.launch(journey, true)
    if (!packet) {
      this.leadIn = TRACE_RETRY_SECONDS
      return
    }
    this.lead = packet
    setTrace(journey)
  }

  /** Clears everything this simulation wrote to the shared store */
  reset() {
    const s = systemState
    s.nodePulse.fill(0)
    s.nodeTrace.fill(0)
    s.edgeTraceHead.fill(0)
    s.edgeTraceGlow.fill(0)
    s.boundaryAlert = 0
    setTrace(-1)
  }

  /**
   * Where the traced message is right now.
   * @returns false when nothing is being traced
   */
  leadPoint(out: Vector3) {
    const { lead } = this
    if (!lead || lead.phase === 'idle') return false
    const { curve, length } = edges[lead.edge]
    curve.getPoint(Math.min(lead.travelled / length, 1), out)
    return true
  }

  /**
   * Packs every visible message into the instance buffers.
   * @param span per message: edge, tail t, head t
   * @param look per message: kind, width, opacity, lead
   * @returns how many messages were written
   */
  writeInstances(span: Float32Array, look: Float32Array) {
    let count = 0
    this.packets.forEach((packet) => {
      if (packet.phase !== 'moving') return
      const { kind, length } = edges[packet.edge]
      span[count * 3] = packet.edge
      span[count * 3 + 1] = Math.max(packet.travelled - packet.streak, 0) / length
      span[count * 3 + 2] = Math.min(packet.travelled / length, 1)
      look[count * 4] = packet.refused ? REFUSED_KIND : EDGE_KIND_INDEX[kind]
      look[count * 4 + 1] = HOP_STYLE[kind].width * (packet.lead ? LEAD_WIDTH : 1)
      look[count * 4 + 2] = packet.lead || packet.refused ? 1 : 0.8
      look[count * 4 + 3] = packet.lead ? 1 : 0
      count += 1
    })
    return count
  }
}
