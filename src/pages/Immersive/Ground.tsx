import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
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
        },
      }),
    []
  )

  useFrame(() => {
    material.uniforms.uReveal.value = systemState.reveal
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} material={material}>
      <planeGeometry args={[80, 80]} />
    </mesh>
  )
}
