import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EDGE_COUNT, PATH_SAMPLES } from './system'
import { systemState } from './systemStore'
import { packetFragment, packetVertex } from './shaders'
import { palette } from './theme'
import type { Traffic } from './traffic'

// @group Packets : Draws each simulated message as a tapered streak that bends with its edge and points the way it is going

interface PacketsProps {
  traffic: Traffic
  capacity: number
  pathTexture: THREE.DataTexture
  stateTexture: THREE.DataTexture
}

/** Enough segments for the longest deploy streak to follow a curved edge */
const SEGMENTS = 8

export default function Packets({ traffic, capacity, pathTexture, stateTexture }: PacketsProps) {
  const geometry = useMemo(() => {
    const rows = SEGMENTS + 1
    const strip = new Float32Array(rows * 4)
    const index: number[] = []
    for (let row = 0; row < rows; row += 1) {
      strip.set([row / SEGMENTS, -1, row / SEGMENTS, 1], row * 4)
      const a = row * 2
      if (row < SEGMENTS) index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
    const geo = new THREE.InstancedBufferGeometry()
    geo.setIndex(index)
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(rows * 6), 3))
    geo.setAttribute('aStrip', new THREE.BufferAttribute(strip, 2))
    geo.setAttribute('aSpan', new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aLook', new THREE.InstancedBufferAttribute(new Float32Array(capacity * 4), 4).setUsage(THREE.DynamicDrawUsage))
    geo.instanceCount = 0
    return geo
  }, [capacity])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: packetVertex,
        fragmentShader: packetFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uPath: { value: pathTexture },
          uState: { value: stateTexture },
          uEdgeCount: { value: EDGE_COUNT },
          uSamples: { value: PATH_SAMPLES },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uPixelRatio: { value: 1 },
          uReveal: { value: 0 },
          uRequest: { value: new THREE.Color(palette.request) },
          uEvent: { value: new THREE.Color(palette.event) },
          uDeploy: { value: new THREE.Color(palette.deploy) },
        },
      }),
    [pathTexture, stateTexture]
  )

  useFrame((state) => {
    const u = material.uniforms
    state.gl.getDrawingBufferSize(u.uResolution.value)
    u.uPixelRatio.value = state.gl.getPixelRatio()
    u.uReveal.value = systemState.reveal

    const span = geometry.getAttribute('aSpan') as THREE.InstancedBufferAttribute
    const look = geometry.getAttribute('aLook') as THREE.InstancedBufferAttribute
    geometry.instanceCount = traffic.writeInstances(span.array as Float32Array, look.array as Float32Array)
    span.needsUpdate = true
    look.needsUpdate = true
  })

  return <mesh geometry={geometry} material={material} frustumCulled={false} />
}
