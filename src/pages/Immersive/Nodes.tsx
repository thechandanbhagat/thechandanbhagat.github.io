import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_COUNT, NODE_DEPTH, NODE_HEIGHT, NODE_KIND_INDEX, nodes } from './system'
import { isDown, setHovered, systemState, toggleOutage } from './systemStore'
import { decalFragment, decalVertex, nodeFragment, nodeVertex } from './shaders'
import { scrollState } from './scrollStore'
import { palette } from './theme'

// @group Nodes : Instanced glass slabs for every service, with canvas labels, hover detection and click-to-fail

const LABEL_WIDTH = 1024
const LABEL_HEIGHT = 128

function makeLabel(text: string, color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = LABEL_WIDTH
  canvas.height = LABEL_HEIGHT
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  if (!ctx) return texture
  ctx.clearRect(0, 0, LABEL_WIDTH, LABEL_HEIGHT)
  ctx.font = `500 54px "JetBrains Mono", "SFMono-Regular", Menlo, ui-monospace, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const withSpacing = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
  if ('letterSpacing' in withSpacing) withSpacing.letterSpacing = '6px'
  ctx.fillStyle = color
  ctx.fillText(text.toUpperCase(), LABEL_WIDTH / 2, LABEL_HEIGHT / 2 + 2)
  texture.needsUpdate = true
  return texture
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return Boolean(target.closest('a, button, input, textarea, select, .imm-topbar, .imm-card, .imm-links'))
}

export default function Nodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const decalRef = useRef<THREE.InstancedMesh>(null)
  const labelsRef = useRef<THREE.Sprite[]>([])
  const { camera } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])
  const downFlags = useRef<boolean[]>(new Array(NODE_COUNT).fill(false))
  const labelScale = useMemo(() => new THREE.Vector3(2.2, 0.275, 1), [])

  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, NODE_HEIGHT, NODE_DEPTH)
    const state = new Float32Array(NODE_COUNT * 3)
    const stagger = new Float32Array(NODE_COUNT)
    nodes.forEach((node, i) => {
      state[i * 3] = 1
      state[i * 3 + 1] = 0
      state[i * 3 + 2] = NODE_KIND_INDEX[node.kind]
      // Reveal from the gateway outward, roughly left to right.
      stagger[i] = ((node.x + 8) / 16) * 0.5
    })
    geo.setAttribute('aState', new THREE.InstancedBufferAttribute(state, 3))
    geo.setAttribute('aStagger', new THREE.InstancedBufferAttribute(stagger, 1))
    return geo
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nodeVertex,
        fragmentShader: nodeFragment,
        transparent: true,
        depthWrite: true,
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uGlass: { value: new THREE.Color(palette.glass) },
          uRim: { value: new THREE.Color(palette.rim) },
          uAccent: { value: new THREE.Color(palette.accent) },
          uWarm: { value: new THREE.Color(palette.warm) },
          uAlert: { value: new THREE.Color(palette.alert) },
        },
      }),
    []
  )

  const decalGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1)
    geo.rotateX(-Math.PI / 2)
    geo.setAttribute('aState', new THREE.InstancedBufferAttribute(new Float32Array(NODE_COUNT * 3).fill(1), 3))
    return geo
  }, [])

  const decalMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: decalVertex,
        fragmentShader: decalFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uReveal: { value: 0 },
          uAccent: { value: new THREE.Color(palette.accent) },
          uAlert: { value: new THREE.Color(palette.alert) },
        },
      }),
    []
  )

  const labels = useMemo(
    () =>
      nodes.map((node) => ({
        live: makeLabel(node.label, palette.rim),
        down: makeLabel(`${node.label} · offline`, palette.alert),
      })),
    []
  )

  // Place every slab once; per-frame work only touches the instanced state attribute.
  useEffect(() => {
    const mesh = meshRef.current
    const decal = decalRef.current
    if (!mesh || !decal) return
    const m = new THREE.Matrix4()
    nodes.forEach((node, i) => {
      m.makeScale(node.width, 1, 1)
      m.setPosition(node.x, NODE_HEIGHT / 2, node.z)
      mesh.setMatrixAt(i, m)
      m.makeScale(node.width + 1.6, 1, 1.9)
      m.setPosition(node.x, 0.004, node.z)
      decal.setMatrixAt(i, m)
    })
    mesh.instanceMatrix.needsUpdate = true
    decal.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [])

  // Clicks anywhere on the page that are not on real controls test the diorama underneath.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isInteractiveTarget(event.target)) return
      const mesh = meshRef.current
      if (!mesh) return
      ndc.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const hit = raycaster.intersectObject(mesh, false)[0]
      if (hit?.instanceId === undefined) return
      toggleOutage(hit.instanceId)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [camera, ndc, raycaster])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const s = systemState
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uReveal.value = s.reveal

    // Hover: raycast with the shared pointer so the DOM overlay never has to forward events.
    let hovered = -1
    if (scrollState.pointerActive) {
      ndc.set(scrollState.pointer.x, scrollState.pointer.y)
      raycaster.setFromCamera(ndc, state.camera)
      hovered = raycaster.intersectObject(mesh, false)[0]?.instanceId ?? -1
    }
    setHovered(hovered)
    document.body.style.cursor = hovered >= 0 ? 'pointer' : ''
    decalMaterial.uniforms.uReveal.value = s.reveal

    const attr = mesh.geometry.getAttribute('aState') as THREE.InstancedBufferAttribute
    const arr = attr.array as Float32Array
    const decalAttr = decalGeometry.getAttribute('aState') as THREE.InstancedBufferAttribute
    const decalArr = decalAttr.array as Float32Array
    for (let i = 0; i < NODE_COUNT; i += 1) {
      arr[i * 3] = s.nodeAlive[i]
      arr[i * 3 + 1] = s.nodeHighlight[i]
      decalArr[i * 3] = s.nodeAlive[i]
      decalArr[i * 3 + 1] = s.nodeHighlight[i]
      const sprite = labelsRef.current[i]
      if (sprite) {
        const down = isDown(i)
        if (down !== downFlags.current[i]) {
          downFlags.current[i] = down
          ;(sprite.material as THREE.SpriteMaterial).map = down ? labels[i].down : labels[i].live
          ;(sprite.material as THREE.SpriteMaterial).needsUpdate = true
        }
        ;(sprite.material as THREE.SpriteMaterial).opacity = s.nodeLabel[i] * s.reveal
        // Keep labels roughly the same size on screen whatever the camera distance.
        const k = THREE.MathUtils.clamp(state.camera.position.distanceTo(sprite.position) / 20, 0.7, 2.4)
        sprite.scale.set(labelScale.x * k, labelScale.y * k, 1)
      }
    }
    attr.needsUpdate = true
    decalAttr.needsUpdate = true
  })

  useEffect(() => {
    return () => {
      document.body.style.cursor = ''
      labels.forEach((l) => {
        l.live.dispose()
        l.down.dispose()
      })
    }
  }, [labels])

  return (
    <group>
      <instancedMesh ref={decalRef} args={[decalGeometry, decalMaterial, NODE_COUNT]} frustumCulled={false} />
      <instancedMesh ref={meshRef} args={[geometry, material, NODE_COUNT]} frustumCulled={false} />
      {nodes.map((node, i) => (
        <sprite
          key={node.id}
          ref={(el) => {
            if (el) labelsRef.current[i] = el
          }}
          position={[node.x, NODE_HEIGHT + 0.42, node.z]}
          scale={[2.2, 0.275, 1]}
        >
          <spriteMaterial map={labels[i].live} transparent depthWrite={false} depthTest={false} opacity={0} toneMapped={false} />
        </sprite>
      ))}
    </group>
  )
}
