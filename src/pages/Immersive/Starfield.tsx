import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from './scrollStore'

// @group Starfield : Deep background stars with slow parallax tied to scroll and pointer

export default function Starfield({ count = 1800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    let s = 2024
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0
      return s / 4294967296
    }
    for (let i = 0; i < count; i += 1) {
      const r = 22 + rand() * 40
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(rand() * 2 - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = 0.4 + rand() * 1.6
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
        vertexShader: /* glsl */ `
          attribute float aSize;
          uniform float uTime;
          uniform float uPixelRatio;
          varying float vTwinkle;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSize) + position.x * 3.0);
            gl_PointSize = aSize * uPixelRatio * (60.0 / -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vTwinkle;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            gl_FragColor = vec4(vec3(0.75, 0.85, 1.0), smoothstep(0.5, 0.0, d) * vTwinkle * 0.7);
          }
        `,
      }),
    []
  )

  useFrame((state) => {
    const points = ref.current
    if (!points) return
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    const { morph, pointer } = scrollState
    points.rotation.y = state.clock.elapsedTime * 0.01 + morph * 0.12 + pointer.x * 0.02
    points.rotation.x = morph * 0.05 - pointer.y * 0.02
  })

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}
