import { useEffect, useState } from 'react'
import { nodes } from './system'
import { rerouteTargetFor, subscribeSystem, systemState } from './systemStore'

// @group SystemHud : Small status line that explains what the diorama is doing and how to poke it

interface HudModel {
  title: string
  body: string
  tone: 'idle' | 'hover' | 'alert'
}

function describe(): HudModel {
  const { hovered, outages } = systemState
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  if (outages.size > 0) {
    const [index] = Array.from(outages.keys()).slice(-1)
    const node = nodes[index]
    const target = rerouteTargetFor(index)
    const body = target ? `Traffic rerouted to ${target} · self-heals in a few seconds` : 'Traffic held upstream · self-heals in a few seconds'
    return { title: `${node.label} offline`, body, tone: 'alert' }
  }
  if (hovered >= 0) {
    const node = nodes[hovered]
    return { title: node.label, body: `${node.detail} · ${coarse ? 'tap' : 'click'} to take it offline`, tone: 'hover' }
  }
  return {
    title: 'Live system',
    body: coarse ? 'Tap a node to take it offline and watch traffic reroute' : 'Hover a node to trace its traffic · click to take it offline',
    tone: 'idle',
  }
}

export default function SystemHud() {
  const [model, setModel] = useState<HudModel>(() => describe())

  useEffect(() => {
    const update = () => setModel(describe())
    update()
    return subscribeSystem(update)
  }, [])

  return (
    <aside className={`imm-hud imm-hud--${model.tone}`} aria-live="polite">
      <span className="imm-hud__dot" />
      <span className="imm-hud__title">{model.title}</span>
      <span className="imm-hud__body">{model.body}</span>
    </aside>
  )
}
