import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { coreFragment, coreVertex } from './shaders'
import { scrollState } from './scrollStore'
import { keyframes, sectionPalettes } from './theme'

// @group Core : Pearlescent, noise-displaced hero object with a single thin orbit ring

export default function Core() {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const tints = useMemo(
    () => ({
      a: new THREE.Color(sectionPalettes[0].a),
      b: new THREE.Color(sectionPalettes[0].b),
      c: new THREE.Color(sectionPalettes[0].c),
      target: new THREE.Color(),
    }),
    []
  )
  const positionTarget = useMemo(() => new THREE.Vector3(), [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        uniforms: {
          uTime: { value: 0 },
          uDistort: { value: 1 },
          uTintA: { value: tints.a },
          uTintB: { value: tints.b },
          uTintC: { value: tints.c },
        },
      }),
    [tints]
  )
  const bodyGeometry = useMemo(() => new THREE.IcosahedronGeometry(1, 48), [])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    const dt = Math.min(delta, 0.05)
    const { morph, pointer, reducedMotion, ready } = scrollState
    const t = state.clock.elapsedTime

    material.uniforms.uTime.value = t
    material.uniforms.uDistort.value = reducedMotion ? 0.4 : 1

    const from = Math.min(Math.floor(morph), keyframes.length - 1)
    const to = Math.min(from + 1, keyframes.length - 1)
    const mix = from === to ? 0 : morph - from
    const kfFrom = keyframes[from]
    const kfTo = keyframes[to]

    // Narrow viewports keep the core centred behind the content instead of beside it.
    const aspect = state.viewport.aspect
    const lateral = aspect < 1 ? 0.25 : aspect < 1.4 ? 0.65 : 1
    positionTarget.set(
      THREE.MathUtils.lerp(kfFrom.core[0], kfTo.core[0], mix) * lateral,
      THREE.MathUtils.lerp(kfFrom.core[1], kfTo.core[1], mix),
      THREE.MathUtils.lerp(kfFrom.core[2], kfTo.core[2], mix)
    )
    group.position.lerp(positionTarget, dt * 3.2)

    const baseScale = THREE.MathUtils.lerp(kfFrom.coreScale, kfTo.coreScale, mix) * (aspect < 1 ? 0.8 : 1)
    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, ready ? baseScale : 0.001, dt * 2.4))

    const speed = reducedMotion ? 0.3 : 1
    group.rotation.y = t * 0.18 * speed + pointer.x * 0.35
    group.rotation.x = Math.sin(t * 0.22) * 0.25 * speed - pointer.y * 0.3
    if (ringRef.current) ringRef.current.rotation.z = t * 0.3 * speed

    const palette = sectionPalettes[Math.round(morph)]
    tints.a.lerp(tints.target.set(palette.a), dt * 2)
    tints.b.lerp(tints.target.set(palette.b), dt * 2)
    tints.c.lerp(tints.target.set(palette.c), dt * 2)
  })

  return (
    <group ref={groupRef} scale={0.001}>
      <mesh geometry={bodyGeometry} material={material} />
      <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.95, 0.01, 8, 200]} />
        <meshBasicMaterial color="#e6edf8" transparent opacity={0.6} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  )
}
