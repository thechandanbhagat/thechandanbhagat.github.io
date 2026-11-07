import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { trustBoundary } from './systemGraph'
import { systemState } from './systemStore'
import { groundFragment, groundVertex } from './shaders'
import { palette } from './theme'

// @group Ground : A quiet engineering grid under the diorama that fades out toward the horizon

export default function Ground() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: groundVertex,
        fragmentShader: groundFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uLine: { value: new THREE.Color(palette.grid) },
          uReveal: { value: 0 },
          uBoundary: { value: new THREE.Vector4(trustBoundary.x, trustBoundary.z, trustBoundary.halfWidth, trustBoundary.halfDepth) },
          uBoundaryGlow: { value: 0 },
          uBoundaryAlert: { value: 0 },
          uFence: { value: 1 },
          uAccent: { value: new THREE.Color(palette.accent) },
          uAlert: { value: new THREE.Color(palette.alert) },
        },
      }),
    []
  )

  useFrame(() => {
    const u = material.uniforms
    u.uReveal.value = systemState.reveal
    u.uBoundaryGlow.value = systemState.boundary
    u.uBoundaryAlert.value = systemState.boundaryAlert
    u.uFence.value = 1 - systemState.quiet
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} material={material}>
      <planeGeometry args={[80, 80]} />
    </mesh>
  )
}
