import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EDGE_COUNT, PATH_SAMPLES, edges } from './system'
import { systemState } from './systemStore'
import { flowFragment, flowVertex } from './shaders'
import { scrollState } from './scrollStore'
import { palette } from './theme'

// @group Flow : Thousands of messages travelling along the system's edges, positioned entirely on the GPU

interface FlowProps {
  count: number
  pathTexture: THREE.DataTexture
  stateTexture: THREE.DataTexture
}

function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export default function Flow({ count, pathTexture, stateTexture }: FlowProps) {
  const geometry = useMemo(() => {
    const rand = seeded(7)
    const edge = new Float32Array(count)
    const phase = new Float32Array(count)
    const rate = new Float32Array(count)
    const size = new Float32Array(count)
    const offset = new Float32Array(count * 3)

    // Share particles out by weight × length so busy, long routes carry visibly more traffic.
    const budget = edges.map((e) => e.weight * Math.max(e.length, 1))
    const total = budget.reduce((a, b) => a + b, 0)
    let cursor = 0
    edges.forEach((e, index) => {
      const share = index === EDGE_COUNT - 1 ? count - cursor : Math.round((budget[index] / total) * count)
      const speed = e.kind === 'event' ? 1.35 : e.kind === 'deploy' ? 0.7 : 1.05
      for (let i = 0; i < share && cursor < count; i += 1, cursor += 1) {
        edge[cursor] = index
        phase[cursor] = rand()
        rate[cursor] = (speed * (0.8 + rand() * 0.5)) / e.length
        size[cursor] = 1.5 + rand() * rand() * 2.8
        const theta = rand() * Math.PI * 2
        const r = Math.sqrt(rand())
        offset[cursor * 3] = Math.cos(theta) * r
        offset[cursor * 3 + 1] = (rand() - 0.5) * 0.6
        offset[cursor * 3 + 2] = Math.sin(theta) * r
      }
    })

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    geo.setAttribute('aEdge', new THREE.BufferAttribute(edge, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    geo.setAttribute('aRate', new THREE.BufferAttribute(rate, 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offset, 3))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.5, -1.5), 14)
    return geo
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: flowVertex,
        fragmentShader: flowFragment,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        uniforms: {
          uPath: { value: pathTexture },
          uState: { value: stateTexture },
          uEdgeCount: { value: EDGE_COUNT },
          uSamples: { value: PATH_SAMPLES },
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uReveal: { value: 0 },
          uRequest: { value: new THREE.Color(palette.request) },
          uEvent: { value: new THREE.Color(palette.event) },
          uDeploy: { value: new THREE.Color(palette.deploy) },
        },
      }),
    [pathTexture, stateTexture]
  )

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const u = material.uniforms
    u.uTime.value += dt * (scrollState.reducedMotion ? 0.3 : 1)
    u.uPixelRatio.value = state.gl.getPixelRatio()
    u.uReveal.value = systemState.reveal
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
