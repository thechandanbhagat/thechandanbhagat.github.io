import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EDGE_COUNT, PATH_SAMPLES } from './system'
import { systemState } from './systemStore'
import { linkFragment, linkVertex } from './shaders'
import { palette } from './theme'

// @group Links : Faint traces along every edge so the topology reads even where traffic is sparse

interface LinksProps {
  pathTexture: THREE.DataTexture
  stateTexture: THREE.DataTexture
}

const SEGMENTS = 36

export default function Links({ pathTexture, stateTexture }: LinksProps) {
  const geometry = useMemo(() => {
    const vertexCount = EDGE_COUNT * SEGMENTS * 2
    const edge = new Float32Array(vertexCount)
    const t = new Float32Array(vertexCount)
    let v = 0
    for (let e = 0; e < EDGE_COUNT; e += 1) {
      for (let s = 0; s < SEGMENTS; s += 1) {
        edge[v] = e
        t[v] = s / SEGMENTS
        v += 1
        edge[v] = e
        t[v] = (s + 1) / SEGMENTS
        v += 1
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3))
    geo.setAttribute('aEdge', new THREE.BufferAttribute(edge, 1))
    geo.setAttribute('aT', new THREE.BufferAttribute(t, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.5, -1.5), 14)
    return geo
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: linkVertex,
        fragmentShader: linkFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uPath: { value: pathTexture },
          uState: { value: stateTexture },
          uEdgeCount: { value: EDGE_COUNT },
          uSamples: { value: PATH_SAMPLES },
          uReveal: { value: 0 },
          uRequest: { value: new THREE.Color(palette.request) },
          uEvent: { value: new THREE.Color(palette.event) },
          uDeploy: { value: new THREE.Color(palette.deploy) },
        },
      }),
    [pathTexture, stateTexture]
  )

  useFrame(() => {
    material.uniforms.uReveal.value = systemState.reveal
  })

  return <lineSegments geometry={geometry} material={material} frustumCulled={false} />
}
