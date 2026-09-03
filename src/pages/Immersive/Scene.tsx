import { useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import MorphParticles from './MorphParticles'
import Core from './Core'
import Starfield from './Starfield'
import { scrollState } from './scrollStore'
import { keyframes, particleCountFor, type Quality } from './theme'

// @group Scene : R3F canvas, camera rig and post-processing stack

function CameraRig() {
  const target = useMemo(() => new THREE.Vector3(), [])
  const lookAt = useMemo(() => new THREE.Vector3(), [])
  const lookTarget = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const { morph, pointer, reducedMotion } = scrollState
    const from = Math.min(Math.floor(morph), keyframes.length - 1)
    const to = Math.min(from + 1, keyframes.length - 1)
    const mix = from === to ? 0 : morph - from
    const kfFrom = keyframes[from]
    const kfTo = keyframes[to]

    // Push the camera back on narrow screens so the composition still fits.
    const aspect = state.viewport.aspect
    const distanceScale = aspect < 1 ? 1.55 : aspect < 1.4 ? 1.2 : 1
    const parallax = reducedMotion ? 0 : 1

    target.set(
      THREE.MathUtils.lerp(kfFrom.camera[0], kfTo.camera[0], mix) + pointer.x * 0.45 * parallax,
      THREE.MathUtils.lerp(kfFrom.camera[1], kfTo.camera[1], mix) + pointer.y * 0.3 * parallax,
      THREE.MathUtils.lerp(kfFrom.camera[2], kfTo.camera[2], mix) * distanceScale
    )
    state.camera.position.lerp(target, dt * 2.6)

    lookTarget.set(pointer.x * 0.2 * parallax, pointer.y * 0.15 * parallax, 0)
    lookAt.lerp(lookTarget, dt * 3)
    state.camera.lookAt(lookAt)
    state.camera.rotation.z += THREE.MathUtils.lerp(kfFrom.tilt, kfTo.tilt, mix) * parallax
  })

  return null
}

export default function Scene({ quality }: { quality: Quality }) {
  return (
    <Canvas
      dpr={[1, quality === 'high' ? 1.75 : 1.25]}
      camera={{ fov: 42, near: 0.1, far: 140, position: [0, 0, 8] }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <color attach="background" args={['#0a0c12']} />
      <fog attach="fog" args={['#0a0c12', 14, 48]} />
      <CameraRig />
      <Starfield count={quality === 'high' ? 2200 : 1000} />
      <MorphParticles count={particleCountFor(quality)} />
      <Core />
      {quality === 'high' && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.38} luminanceSmoothing={0.5} radius={0.65} />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
