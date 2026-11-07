import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CameraMotion } from './cameraMotion'
import Ground from './Ground'
import Links from './Links'
import LondonSkyline from './LondonSkyline'
import Nodes from './Nodes'
import Packets from './Packets'
import { buildPathTexture, buildStateTexture, EDGE_COUNT } from './system'
import { systemState, tickSystem } from './systemStore'
import { scrollState } from './scrollStore'
import { Traffic } from './traffic'
import {
  cameraKeyframes,
  cameraPullback,
  FOV_LANDSCAPE,
  FOV_PORTRAIT,
  isCompact,
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

/** How quickly the idle camera catches up with the traced message */
const FOLLOW_RATE = 0.6
const UP = new THREE.Vector3(0, 1, 0)

function CameraRig({ traffic }: { traffic: Traffic }) {
  const landscape = useMemo(() => buildCurves(cameraKeyframes), [])
  const portrait = useMemo(() => buildCurves(mobileCameraKeyframes), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const lookSmooth = useMemo(() => new THREE.Vector3(...cameraKeyframes[0].lookAt), [])
  const offset = useMemo(() => new THREE.Vector3(), [])
  const lead = useMemo(() => new THREE.Vector3(), [])
  const follow = useMemo(() => new THREE.Vector3(...cameraKeyframes[0].lookAt), [])
  const motion = useMemo(() => new CameraMotion(), [])
  const placed = useRef(false)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const { progress, pointer, reducedMotion } = scrollState
    const t = THREE.MathUtils.clamp(progress / (cameraKeyframes.length - 1), 0, 1)
    const aspect = state.viewport.aspect
    // Must agree with the CSS breakpoint that opens the top window in each section.
    const isPortrait = isCompact(state.size.width, aspect)
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
    offset.copy(target).sub(look).multiplyScalar(cameraPullback(aspect, isPortrait))

    const holding = systemState.hovered >= 0
    const pose = motion.step(dt, {
      progress,
      ready: scrollState.ready,
      reducedMotion,
      secondsSinceInput: (performance.now() - scrollState.lastInput) / 1000,
      holding,
    })
    offset.applyAxisAngle(UP, pose.yaw).multiplyScalar(1 + pose.pull)
    offset.y *= 1 + pose.rise
    target.copy(look).add(offset)

    // Left alone, the view turns towards whatever message is being traced.
    if (!holding) follow.lerp(traffic.leadPoint(lead) ? lead : look, dt * FOLLOW_RATE)
    look.lerp(follow, pose.lean)

    const parallax = reducedMotion ? 0 : 1
    target.x += pointer.x * 0.5 * parallax
    target.y += pointer.y * 0.25 * parallax

    // The first frame starts on the opening pose rather than easing into it from the default.
    if (!placed.current) {
      placed.current = true
      state.camera.position.copy(target)
      lookSmooth.copy(look)
    }

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
      <CameraRig traffic={traffic} />
      <Ground />
      <Links pathTexture={pathTexture} stateTexture={stateTexture} />
      <Packets traffic={traffic} capacity={capacity} pathTexture={pathTexture} stateTexture={stateTexture} />
      <Nodes />
      <LondonSkyline />
    </Canvas>
  )
}
