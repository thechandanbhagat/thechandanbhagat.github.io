import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BOAT_LANE, buildLondon, LONDON_HEIGHT, LONDON_WIDTH, pivots, tones } from './londonModel'
import { scrollState } from './scrollStore'
import { londonFragment, londonVertex } from './shaders'
import { systemState } from './systemStore'
import { cameraKeyframes, cameraPullback, FOV_LANDSCAPE, FOV_PORTRAIT, isCompact, mobileCameraKeyframes, palette } from './theme'

// @group LondonSkyline : The easter egg behind "London, UK": the system sinks into the grid and the city comes down on the name in its place

const BUILD_SECONDS = 2.4
const COLLAPSE_SECONDS = 1.1

/** One run of the boat, with the bridge opening ahead of it and closing behind it */
const CYCLE_SECONDS = 15
/** Where a visit picks the cycle up, so the bridge starts to move soon after the city stands */
const CYCLE_START = 0.06
const LIFT_ANGLE = 1.05
const WHEEL_SPEED = 0.09

/** Always centred across the screen: how far down it stands (-1..1) and the most of the screen it may take up */
const FRAMING = {
  wide: { y: -0.55, width: 0.74, height: 0.6, tilt: 0 },
  compact: { y: -0.52, width: 0.94, height: 0.36, tilt: 0.4 },
}

const LONDON_TIME = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })

/** The hands on the tower show the real time in London */
function clockAngles() {
  const parts = LONDON_TIME.formatToParts(new Date())
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0)
  const minutes = read('minute')
  return { minute: (minutes / 60) * Math.PI * 2, hour: (((read('hour') % 12) + minutes / 60) / 12) * Math.PI * 2 }
}

function buildGeometry() {
  const model = buildLondon()
  const box = new THREE.BoxGeometry(1, 1, 1)
  const geometry = new THREE.InstancedBufferGeometry()
  geometry.index = box.index
  geometry.setAttribute('position', box.getAttribute('position'))
  geometry.setAttribute('normal', box.getAttribute('normal'))

  const colors = Object.fromEntries(Object.entries(tones).map(([name, hex]) => [name, new THREE.Color(hex)]))
  const tone = new Float32Array(model.count * 3)
  model.tone.forEach((name, i) => colors[name].toArray(tone, i * 3))

  geometry.setAttribute('aHome', new THREE.InstancedBufferAttribute(model.home, 3))
  geometry.setAttribute('aMeta', new THREE.InstancedBufferAttribute(model.meta, 3))
  geometry.setAttribute('aTone', new THREE.InstancedBufferAttribute(tone, 3))
  geometry.instanceCount = model.count
  return geometry
}

/** The hero camera at rest. The real one may still be on its way down or following the pointer, and the city has to suit where it settles. */
function restingCamera(width: number, aspect: number) {
  const compact = isCompact(width, aspect)
  const { position, lookAt } = (compact ? mobileCameraKeyframes : cameraKeyframes)[0]
  const camera = new THREE.PerspectiveCamera(compact ? FOV_PORTRAIT : FOV_LANDSCAPE, aspect)
  const look = new THREE.Vector3(...lookAt)
  camera.position.set(...position).sub(look).multiplyScalar(cameraPullback(aspect, compact)).add(look)
  camera.lookAt(look)
  camera.updateMatrixWorld()
  return camera
}

/** Stands the model on the grid under the chosen spot on screen, sized for this screen and squared up to it */
function placeOnGrid(group: THREE.Group, width: number, aspect: number) {
  const framing = isCompact(width, aspect) ? FRAMING.compact : FRAMING.wide
  const camera = restingCamera(width, aspect)
  const spot = new THREE.Vector3(0, framing.y, 0.5).unproject(camera).sub(camera.position).normalize()
  // Turned to match the camera's heading, so the embankment runs level across the screen.
  const heading = Math.atan2(-spot.x, -spot.z)
  spot.multiplyScalar(-camera.position.y / spot.y).add(camera.position)

  const viewHeight = 2 * camera.position.distanceTo(spot) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
  group.position.copy(spot)
  group.scale.setScalar(Math.min((viewHeight * aspect * framing.width) / LONDON_WIDTH, (viewHeight * framing.height) / LONDON_HEIGHT))
  group.rotation.set(framing.tilt, heading, 0, 'YXZ')
}

export default function LondonSkyline() {
  const groupRef = useRef<THREE.Group>(null)
  const [found, setFound] = useState(false)
  const visit = useRef({ build: 0, time: 0 })

  // Nothing is built until the first time someone finds it.
  const geometry = useMemo(() => (found ? buildGeometry() : null), [found])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: londonVertex,
        fragmentShader: londonFragment,
        uniforms: {
          uBuild: { value: 0 },
          uTime: { value: 0 },
          uWheel: { value: 0 },
          uLift: { value: 0 },
          uMinute: { value: 0 },
          uHour: { value: 0 },
          uBoat: { value: new THREE.Vector2(BOAT_LANE.from, 0) },
          uHub: { value: new THREE.Vector2(pivots.wheel[0] - LONDON_WIDTH / 2, pivots.wheel[1]) },
          uHingeLeft: { value: new THREE.Vector2(pivots.leafLeft[0] - LONDON_WIDTH / 2, pivots.leafLeft[1]) },
          uHingeRight: { value: new THREE.Vector2(pivots.leafRight[0] - LONDON_WIDTH / 2, pivots.leafRight[1]) },
          uDial: { value: new THREE.Vector2(pivots.dial[0] - LONDON_WIDTH / 2, pivots.dial[1]) },
          uWarm: { value: new THREE.Color(palette.warm) },
          uAccent: { value: new THREE.Color(palette.accent) },
        },
      }),
    []
  )

  useEffect(() => () => geometry?.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    const dt = Math.min(delta, 0.05)
    const now = visit.current
    const wanted = scrollState.london
    const still = scrollState.reducedMotion
    const u = material.uniforms

    if (wanted && !found) setFound(true)

    // A fresh visit: find its place on this screen and set the clock.
    if (wanted && now.build === 0) {
      placeOnGrid(group, state.size.width, state.viewport.aspect)
      now.time = CYCLE_START * CYCLE_SECONDS
      const clock = clockAngles()
      u.uMinute.value = clock.minute
      u.uHour.value = clock.hour
    }

    now.build = still
      ? Number(wanted)
      : THREE.MathUtils.clamp(now.build + dt * (wanted ? 1 / BUILD_SECONDS : -1 / COLLAPSE_SECONDS), 0, 1)
    group.visible = now.build > 0
    systemState.quiet = THREE.MathUtils.smoothstep(now.build, 0, 0.6)
    if (now.build === 0) return

    if (!still) now.time += dt
    const cycle = (now.time % CYCLE_SECONDS) / CYCLE_SECONDS
    const { smoothstep: ease, lerp } = THREE.MathUtils
    u.uBuild.value = now.build
    u.uTime.value = now.time
    u.uWheel.value = now.time * WHEEL_SPEED
    u.uLift.value = LIFT_ANGLE * ease(cycle, 0.1, 0.3) * (1 - ease(cycle, 0.68, 0.88))
    u.uBoat.value.set(lerp(BOAT_LANE.from, BOAT_LANE.to, cycle), ease(cycle, 0, 0.05) * (1 - ease(cycle, 0.93, 1)))
  })

  return <group ref={groupRef}>{geometry && <mesh geometry={geometry} material={material} frustumCulled={false} />}</group>
}
