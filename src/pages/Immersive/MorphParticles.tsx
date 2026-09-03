import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildParticleBuffers } from './geometry'
import { particleFragment, particleVertex } from './shaders'
import { scrollState } from './scrollStore'
import { keyframes, sectionPalettes } from './theme'

// @group MorphParticles : GPU-morphing point cloud that re-forms into a new shape for every section

const SHAPE_COUNT = 6

export default function MorphParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const colors = useMemo(
    () => ({
      a: new THREE.Color(sectionPalettes[0].a),
      b: new THREE.Color(sectionPalettes[0].b),
      c: new THREE.Color(sectionPalettes[0].c),
      target: new THREE.Color(),
    }),
    []
  )
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const pointerNdc = useMemo(() => new THREE.Vector2(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const mouseWorld = useMemo(() => new THREE.Vector3(), [])
  const mouseTarget = useMemo(() => new THREE.Vector3(), [])
  const groupTarget = useMemo(() => new THREE.Vector3(), [])

  const geometry = useMemo(() => {
    const buffers = buildParticleBuffers(count)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(buffers.position, 3))
    buffers.shapes.forEach((shape, i) => geo.setAttribute(`aShape${i}`, new THREE.BufferAttribute(shape, 3)))
    geo.setAttribute('aRand', new THREE.BufferAttribute(buffers.rand, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(buffers.seed, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12)
    return geo
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uFrom: { value: 0 },
          uTo: { value: 1 },
          uMix: { value: 0 },
          uPixelRatio: { value: 1 },
          uMouse: { value: new THREE.Vector3() },
          uMouseStrength: { value: 1 },
          uColorA: { value: colors.a },
          uColorB: { value: colors.b },
          uColorC: { value: colors.c },
        },
      }),
    [colors]
  )

  useFrame((state, delta) => {
    const points = pointsRef.current
    if (!points) return
    const dt = Math.min(delta, 0.05)
    const u = material.uniforms
    const { morph, pointer, reducedMotion, ready } = scrollState

    u.uTime.value += dt * (reducedMotion ? 0.35 : 1)
    u.uPixelRatio.value = state.gl.getPixelRatio()

    const from = Math.min(Math.floor(morph), SHAPE_COUNT - 1)
    const to = Math.min(from + 1, SHAPE_COUNT - 1)
    const mix = from === to ? 0 : morph - from
    u.uFrom.value = from
    u.uTo.value = to
    u.uMix.value = mix

    const palette = sectionPalettes[Math.round(morph)]
    colors.a.lerp(colors.target.set(palette.a), dt * 2.2)
    colors.b.lerp(colors.target.set(palette.b), dt * 2.2)
    colors.c.lerp(colors.target.set(palette.c), dt * 2.2)

    const kfFrom = keyframes[from]
    const kfTo = keyframes[to]
    groupTarget.set(
      THREE.MathUtils.lerp(kfFrom.core[0], kfTo.core[0], mix) * 0.85,
      THREE.MathUtils.lerp(kfFrom.core[1], kfTo.core[1], mix) * 0.85,
      THREE.MathUtils.lerp(kfFrom.core[2], kfTo.core[2], mix) * 0.85
    )
    points.position.lerp(groupTarget, dt * 3)

    const spin = reducedMotion ? 0.02 : 0.06
    points.rotation.y = state.clock.elapsedTime * spin + morph * 0.55
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.12 + pointer.y * 0.08

    const scale = THREE.MathUtils.lerp(points.scale.x, ready ? 1 : 0.001, dt * 1.8)
    points.scale.setScalar(scale)

    pointerNdc.set(pointer.x, pointer.y)
    raycaster.setFromCamera(pointerNdc, state.camera)
    plane.constant = -points.position.z
    if (raycaster.ray.intersectPlane(plane, mouseTarget)) mouseWorld.lerp(mouseTarget, dt * 8)
    ;(u.uMouse.value as THREE.Vector3).copy(mouseWorld)
    u.uMouseStrength.value = reducedMotion ? 0.3 : 1
  })

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
}
