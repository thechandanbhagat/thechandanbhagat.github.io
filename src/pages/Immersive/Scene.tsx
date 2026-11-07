import { useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Ground from './Ground'
import Links from './Links'
import Nodes from './Nodes'
import Packets from './Packets'
import { buildPathTexture, buildStateTexture, EDGE_COUNT } from './system'
import { systemState, tickSystem } from './systemStore'
import { scrollState } from './scrollStore'
import { Traffic } from './traffic'
import {
  cameraKeyframes,
  COMPACT_ASPECT,
  COMPACT_WIDTH,
  FOV_LANDSCAPE,
  FOV_PORTRAIT,
  mobileCameraKeyframes,
  palette,
  trafficFor,
  type Quality,
} from './theme'

// @group Scene : R3F canvas, the scroll-driven camera path and the per-frame system tick

/** Advances the simulation and pushes edge state into the shared texture before anything draws. */
function SystemTicker({ stateTexture, traffic }: { stateTexture: THREE.DataTexture; traffic: Traffic }) {
  useEffect(() => () => traffic.reset(), [traffic])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    tickSystem(dt, scrollState.progress, scrollState.ready)
    traffic.tick(dt * (scrollState.reducedMotion ? 0.3 : 1), scrollState.progress)
    const data = stateTexture.image.data as Float32Array
    for (let i = 0; i < EDGE_COUNT; i += 1) {
      data[i * 4] = systemState.edgeAlive[i]
      data[i * 4 + 1] = systemState.edgeHighlight[i]
      data[i * 4 + 2] = systemState.edgeTraceHead[i]
      data[i * 4 + 3] = systemState.edgeTraceGlow[i]
    }
    stateTexture.needsUpdate = true
  })
  return null
}

function buildCurves(frames: typeof cameraKeyframes) {
  return {
    position: new THREE.CatmullRomCurve3(frames.map((k) => new THREE.Vector3(...k.position)), false, 'centripetal', 0.5),
    look: new THREE.CatmullRomCurve3(frames.map((k) => new THREE.Vector3(...k.lookAt)), false, 'centripetal', 0.5),
  }
}

function CameraRig() {
  const landscape = useMemo(() => buildCurves(cameraKeyframes), [])
  const portrait = useMemo(() => buildCurves(mobileCameraKeyframes), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const lookSmooth = useMemo(() => new THREE.Vector3(...cameraKeyframes[0].lookAt), [])
  const offset = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const { progress, pointer, reducedMotion } = scrollState
    const t = THREE.MathUtils.clamp(progress / (cameraKeyframes.length - 1), 0, 1)
    const aspect = state.viewport.aspect
    // Must agree with the CSS breakpoint that opens the top window in each section.
    const isPortrait = aspect < COMPACT_ASPECT || state.size.width < COMPACT_WIDTH
    const curves = isPortrait ? portrait : landscape
    curves.position.getPoint(t, target)
    curves.look.getPoint(t, look)

    // Portrait phones get their own framing and a wider lens; tablets back the desktop camera off a little.
    const camera = state.camera as THREE.PerspectiveCamera
    const fov = isPortrait ? FOV_PORTRAIT : FOV_LANDSCAPE
    if (camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    const distance = isPortrait ? 1 : aspect < 1.2 ? 1.35 : aspect < 1.6 ? 1.12 : 1
    offset.copy(target).sub(look).multiplyScalar(distance)
    target.copy(look).add(offset)

    const parallax = reducedMotion ? 0 : 1
    target.x += pointer.x * 0.5 * parallax
    target.y += pointer.y * 0.25 * parallax

    state.camera.position.lerp(target, dt * 2.2)
    lookSmooth.lerp(look, dt * 2.2)
    state.camera.lookAt(lookSmooth)
  })

  return null
}

export default function Scene({ quality }: { quality: Quality }) {
  const pathTexture = useMemo(() => buildPathTexture(), [])
  const stateTexture = useMemo(() => buildStateTexture(), [])
  const { capacity, load } = trafficFor(quality)
  const traffic = useMemo(() => new Traffic(capacity, load), [capacity, load])

  return (
    <Canvas
      dpr={[1, quality === 'high' ? 1.75 : 1.25]}
      camera={{ fov: FOV_LANDSCAPE, near: 0.5, far: 90, position: cameraKeyframes[0].position }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.background, 24, 60]} />
      <SystemTicker stateTexture={stateTexture} traffic={traffic} />
      <CameraRig />
      <Ground />
      <Links pathTexture={pathTexture} stateTexture={stateTexture} />
      <Packets traffic={traffic} capacity={capacity} pathTexture={pathTexture} stateTexture={stateTexture} />
      <Nodes />
    </Canvas>
  )
}
