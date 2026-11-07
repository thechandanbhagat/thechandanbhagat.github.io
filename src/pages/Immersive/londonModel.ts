// @group LondonModel : The voxel London behind the hero easter egg, drawn in code so nothing is built until someone finds it

/** What a voxel does once the city stands. Still voxels only move during the build. */
export const Role = {
  still: 0,
  wheel: 1,
  leafLeft: 2,
  leafRight: 3,
  boat: 4,
  dial: 5,
  minuteHand: 6,
  hourHand: 7,
  window: 8,
  water: 9,
} as const

/** Stone and glass from the site's palette, so the city reads as part of the same scene */
export const tones = {
  stone: '#8b96a8',
  stoneLight: '#b9c2d0',
  stoneDark: '#596375',
  shadow: '#333b4a',
  rim: '#e6ecf5',
  lead: '#7d8fa9',
  glass: '#6d8bb3',
  glassLight: '#9cc3ff',
  glassDark: '#3f5678',
  warm: '#d9c39a',
  gold: '#d9a05b',
  water: '#1b2840',
  pane: '#262e3d',
} as const

export type Tone = keyof typeof tones

export const LONDON_WIDTH = 200
export const LONDON_HEIGHT = 95

/** The points the moving parts turn around, in voxels from the left end of the model */
export const pivots = {
  wheel: [36, 29],
  leafLeft: [130, 13],
  leafRight: [160, 13],
  dial: [70, 53],
} as const

/** The boat's run: up the channel, under the bridge, out into the river */
export const BOAT_LANE = { from: -44, to: 30 }

const CHANNEL = { left: 131, right: 159, back: -46 }
const BANK_FRONT = 13
const RIVER_FRONT = 30

type Random = () => number

/** Seeded, so the city is the same one every time */
function seededRandom(seed: number): Random {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Voxel {
  x: number
  y: number
  z: number
  tone: Tone
  role: number
}

class Voxels {
  private cells = new Map<number, Voxel>()
  private loose: Voxel[] = []

  private static key(x: number, y: number, z: number) {
    return ((x + 64) * 256 + y) * 512 + z + 256
  }

  has(x: number, y: number, z: number) {
    return this.cells.has(Voxels.key(x, y, z))
  }

  put(x: number, y: number, z: number, tone: Tone, role: number = Role.still) {
    this.cells.set(Voxels.key(x, y, z), { x, y, z, tone, role })
  }

  /** Upper bounds are exclusive */
  box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, tone: Tone, role: number = Role.still) {
    for (let x = x0; x < x1; x += 1) {
      for (let y = y0; y < y1; y += 1) {
        for (let z = z0; z < z1; z += 1) this.put(x, y, z, tone, role)
      }
    }
  }

  /** Off the grid, for parts that turn: a rounded position would wobble as it goes round */
  float(x: number, y: number, z: number, tone: Tone, role: number) {
    this.loose.push({ x, y, z, tone, role })
  }

  /** A disc of voxels on one floor */
  disc(cx: number, cz: number, y: number, radius: number, paint: (angle: number) => Tone) {
    const reach = Math.ceil(radius)
    for (let dx = -reach; dx <= reach; dx += 1) {
      for (let dz = -reach; dz <= reach; dz += 1) {
        if (Math.hypot(dx, dz) <= radius + 0.25) this.put(cx + dx, y, cz + dz, paint(Math.atan2(dz, dx)))
      }
    }
  }

  /** A straight run from one point to another in the plane of the skyline */
  line(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, tone: Tone) {
    const steps = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)))
    for (let i = 0; i <= steps; i += 1) {
      const x = Math.round(x0 + ((x1 - x0) * i) / steps)
      const y = Math.round(y0 + ((y1 - y0) * i) / steps)
      for (let z = z0; z < z1; z += 1) this.put(x, y, z, tone)
    }
  }

  /** Everything the camera can reach. It never sees the back or underneath, so anything covered on the other four sides is left out. */
  visible() {
    const shown = [...this.loose]
    this.cells.forEach((cell) => {
      const { x, y, z, role } = cell
      const buried = role === Role.still && this.has(x, y + 1, z) && this.has(x, y, z + 1) && this.has(x - 1, y, z) && this.has(x + 1, y, z)
      if (!buried) shown.push(cell)
    })
    return shown
  }
}

function thames(v: Voxels, random: Random) {
  for (let x = 0; x < LONDON_WIDTH; x += 1) {
    // The ends break up into loose pixels instead of stopping at a straight edge.
    const edge = Math.min(Math.min(x, LONDON_WIDTH - 1 - x) / 20, 1)
    for (let z = BANK_FRONT; z < RIVER_FRONT; z += 1) {
      if (random() < edge * Math.min((RIVER_FRONT - z) / 5, 1)) v.put(x, 0, z, 'water', Role.water)
    }
    if (x >= CHANNEL.left && x < CHANNEL.right) {
      for (let z = CHANNEL.back; z < BANK_FRONT; z += 1) {
        if (random() < (z - CHANNEL.back) / 14) v.put(x, 0, z, 'water', Role.water)
      }
    } else if (random() < edge + 0.25) {
      v.box(x, x + 1, 0, 2, 7, BANK_FRONT, 'stoneDark')
      v.put(x, 1, BANK_FRONT - 1, 'stoneLight')
      if (x % 15 === 4) {
        v.put(x, 2, BANK_FRONT - 1, 'stoneDark')
        v.put(x, 3, BANK_FRONT - 1, 'warm', Role.dial)
      }
    }
  }
}

function londonEye(v: Voxels) {
  const [cx, cy] = pivots.wheel
  const rim = 25

  // The legs lean in from the embankment and hold the wheel by its hub.
  v.line(cx - 13, 1, cx, cy, 3, 5, 'stoneLight')
  v.line(cx + 13, 1, cx, cy, 3, 5, 'stoneLight')
  v.box(cx - 2, cx + 3, cy - 2, cy + 3, -2, 5, 'stoneLight')

  const ring = (radius: number, tone: Tone) => {
    const steps = Math.round(Math.PI * 2 * radius)
    for (let i = 0; i < steps; i += 1) {
      const angle = (i / steps) * Math.PI * 2
      v.float(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 0, tone, Role.wheel)
    }
  }
  ring(rim, 'stoneLight')
  ring(rim - 3, 'stone')

  const spokes = 16
  for (let s = 0; s < spokes; s += 1) {
    const angle = (s / spokes) * Math.PI * 2
    for (let r = 3; r < rim - 3; r += 1.25) {
      v.float(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 0, 'stoneDark', Role.wheel)
    }
  }

  const pods = 24
  for (let p = 0; p < pods; p += 1) {
    const angle = (p / pods) * Math.PI * 2
    const x = cx + Math.cos(angle) * (rim + 1.5)
    const y = cy + Math.sin(angle) * (rim + 1.5)
    v.float(x, y, 0, 'rim', Role.wheel)
    v.float(x, y, 1, 'glassLight', Role.wheel)
  }
}

function elizabethTower(v: Voxels) {
  const [cx, dy] = pivots.dial

  for (let y = 0; y < 46; y += 1) {
    for (let x = cx - 4; x <= cx + 4; x += 1) {
      for (let z = -4; z <= 4; z += 1) {
        const course = y % 11 === 10
        const rib = (x + z) % 2 === 0
        v.put(x, y, z, course ? 'stoneLight' : rib ? 'stone' : 'stoneDark')
      }
    }
  }
  v.box(cx - 5, cx + 6, 46, 60, -5, 6, 'stoneLight')

  // The face on the front carries the hands, the one on the side catches the camera from the right.
  for (let a = -6; a <= 6; a += 1) {
    for (let b = -6; b <= 6; b += 1) {
      const d = Math.hypot(a, b)
      if (d <= 4.7) {
        v.put(cx + a, dy + b, 6, 'warm', Role.dial)
        v.put(cx + 6, dy + b, a, 'warm', Role.dial)
      } else if (d <= 5.8) {
        v.put(cx + a, dy + b, 6, 'stoneDark')
        v.put(cx + 6, dy + b, a, 'stoneDark')
      }
    }
  }
  for (let r = 1; r <= 4; r += 1) v.float(cx, dy + r, 7, 'shadow', Role.minuteHand)
  for (let r = 1; r <= 2.6; r += 0.8) v.float(cx, dy + r, 7, 'shadow', Role.hourHand)
  v.put(cx, dy, 7, 'shadow')

  // The belfry, then the spire.
  for (let y = 60; y < 64; y += 1) {
    for (let x = cx - 4; x <= cx + 4; x += 1) {
      for (let z = -4; z <= 4; z += 1) v.put(x, y, z, x % 2 === 0 ? 'stoneLight' : 'shadow')
    }
  }
  for (let y = 64; y < 80; y += 1) {
    const half = Math.round(4.6 * (1 - (y - 64) / 16))
    v.box(cx - half, cx + half + 1, y, y + 1, -half, half + 1, 'lead')
  }
  v.box(cx, cx + 1, 80, 84, 0, 1, 'gold')
}

function parliament(v: Voxels, random: Random) {
  v.box(76, 98, 0, 17, -5, 6, 'stone')
  for (let x = 76; x < 98; x += 1) {
    for (let y = 2; y < 16; y += 1) {
      if (x % 3 === 0) v.put(x, y, 5, 'stoneLight')
      else if (y % 4 === 1 && x % 3 === 1) v.put(x, y, 5, random() < 0.5 ? 'warm' : 'pane', Role.window)
    }
    if (x % 4 === 0) v.box(x, x + 1, 17, 20, 5, 6, 'stoneLight')
  }
  v.box(84, 88, 17, 24, -2, 2, 'stoneLight')
  for (let y = 24; y < 32; y += 1) {
    const half = y < 28 ? 1 : 0
    v.box(86 - half, 86 + half + 1, y, y + 1, 0 - half, half + 1, 'lead')
  }

  // Victoria Tower closes off the far end.
  v.box(97, 105, 0, 33, -4, 4, 'stone')
  for (let y = 4; y < 33; y += 1) v.put(101, y, 3, y % 5 === 0 ? 'stoneLight' : 'stoneDark')
  ;[97, 104].forEach((x) => v.box(x, x + 1, 33, 38, 3, 4, 'stoneLight'))
}

function stPauls(v: Voxels) {
  const cx = 112
  const cz = -14

  for (let x = 98; x < 127; x += 1) {
    for (let y = 0; y < 13; y += 1) {
      for (let z = -24; z < -4; z += 1) v.put(x, y, z, x % 2 === 0 && y > 1 && y < 12 ? 'stoneLight' : 'stone')
    }
  }
  for (let y = 13; y < 19; y += 1) {
    const half = 9 - Math.round((y - 13) * 1.6)
    v.box(cx - half, cx + half + 1, y, y + 1, -5, -3, 'stoneLight')
  }
  ;[101, 123].forEach((x) => {
    v.box(x - 2, x + 3, 13, 25, -9, -4, 'stone')
    for (let y = 25; y < 30; y += 1) v.disc(x, -7, y, 2.4 - (y - 25) * 0.5, () => 'lead')
  })

  for (let y = 13; y < 25; y += 1) v.disc(cx, cz, y, 9, (angle) => (Math.round(angle * 7) % 2 === 0 ? 'stoneLight' : 'stoneDark'))
  for (let y = 25; y <= 38; y += 1) {
    const t = (y - 25) / 13
    v.disc(cx, cz, y, 9.6 * Math.sqrt(Math.max(1 - t * t, 0)), (angle) => (Math.round(angle * 4.5) % 2 === 0 ? 'lead' : 'stone'))
  }
  for (let y = 38; y < 45; y += 1) v.disc(cx, cz, y, y < 42 ? 2 : 1, () => 'stoneLight')
  v.box(cx, cx + 1, 45, 50, cz, cz + 1, 'gold')
  v.box(cx - 1, cx + 2, 48, 49, cz, cz + 1, 'gold')
}

function towerBridge(v: Voxels) {
  const deck = pivots.leafLeft[1]

  ;[126, 164].forEach((cx) => {
    v.box(cx - 5, cx + 5, 0, deck, -6, 6, 'stoneDark')
    for (let y = deck; y < 46; y += 1) {
      for (let x = cx - 4; x < cx + 4; x += 1) {
        for (let z = -5; z < 5; z += 1) v.put(x, y, z, y % 8 === 0 ? 'stoneLight' : 'stone')
      }
    }
    ;[20, 27, 34, 41].forEach((y) => {
      v.box(cx - 1, cx + 1, y, y + 4, 4, 5, 'pane')
      v.put(cx - 1, y + 1, 4, 'warm', Role.window)
      v.put(cx, y + 2, 4, 'warm', Role.window)
    })
    for (let y = 46; y < 54; y += 1) {
      const half = Math.round(3.6 * (1 - (y - 46) / 8))
      v.box(cx - half, cx + half, y, y + 1, -half, half, 'lead')
    }
    v.box(cx, cx + 1, 54, 57, 0, 1, 'gold')
    ;[cx - 4, cx + 3].forEach((x) => {
      ;[-5, 4].forEach((z) => {
        v.box(x, x + 1, 46, 51, z, z + 1, 'stoneLight')
        v.put(x, 51, z, 'gold')
      })
    })
  })

  // Two leaves meet in the middle and open on their hinges.
  const [left] = pivots.leafLeft
  const [right] = pivots.leafRight
  const middle = (left + right) / 2
  v.box(left, middle, deck, deck + 2, -3, 3, 'stoneLight', Role.leafLeft)
  v.box(middle, right, deck, deck + 2, -3, 3, 'stoneLight', Role.leafRight)
  for (let x = left; x < right; x += 3) {
    const role = x < middle ? Role.leafLeft : Role.leafRight
    v.put(x, deck + 2, 2, 'glassLight', role)
    v.put(x, deck + 2, -3, 'glassLight', role)
  }

  // The high walkways, a lattice between two rails, in the bridge's blue.
  for (let x = left; x < right; x += 1) {
    const zig = Math.abs(((x - left) % 6) - 3)
    ;[-2, 1].forEach((z) => {
      v.put(x, 37, z, 'glass')
      v.put(x, 41, z, 'glass')
      v.put(x, 38 + zig, z, 'glassDark')
    })
  }

  // Side spans and the chains that hang them from the towers.
  const sideSpan = (tower: number, end: number) => {
    const low = Math.min(tower, end)
    const high = Math.max(tower, end)
    v.box(low, high, deck, deck + 2, -3, 3, 'stone')
    v.box(end - 1, end + 1, 0, deck, -3, 3, 'stoneDark')
    const reach = Math.abs(end - tower)
    for (let i = 0; i <= reach; i += 1) {
      const x = tower + Math.sign(end - tower) * i
      const t = 1 - i / reach
      const y = Math.round(deck + 3 + 22 * t * t)
      ;[-3, 2].forEach((z) => {
        v.put(x, y, z, 'glass')
        if (i % 3 === 0) v.box(x, x + 1, deck + 2, y, z, z + 1, 'glassDark')
      })
    }
  }
  sideSpan(121, 106)
  sideSpan(168, 182)
}

function gherkin(v: Voxels) {
  const cx = 168
  const cz = -24
  const height = 66
  for (let y = 0; y < height; y += 1) {
    const t = y / height
    const radius = 8.6 * Math.pow(Math.sin(Math.PI * (0.16 + 0.8 * t)), 0.75)
    // Dark bands wind round the building the way its real glazing does.
    v.disc(cx, cz, y, radius, (angle) => {
      if (t > 0.93) return 'glassLight'
      return Math.floor((angle / (Math.PI * 2)) * 6 + t * 7 + 12) % 2 === 0 ? 'glass' : 'glassDark'
    })
  }
}

function shard(v: Voxels, random: Random) {
  const cx = 186
  const cz = -12
  const height = LONDON_HEIGHT
  for (let y = 0; y < height; y += 1) {
    const half = Math.round(12 * (1 - y / height))
    // The top splinters into loose glass.
    if (y > height - 8 && y % 2 === 1) continue
    for (let x = -half; x <= half; x += 1) {
      for (let z = -half; z <= half; z += 1) {
        const corner = Math.abs(x) === half && Math.abs(z) === half
        const onFront = z === half || x === half
        if (onFront && !corner && y > 3 && y % 3 === 0 && random() < 0.22) {
          v.put(cx + x, y, cz + z, 'warm', Role.window)
        } else {
          v.put(cx + x, y, cz + z, corner ? 'glassLight' : y % 6 === 0 ? 'glassDark' : 'glass')
        }
      }
    }
  }
}

/** The rest of the city: quiet blocks that sit back and give the landmarks something to stand out from */
function rooftops(v: Voxels, random: Random, from: number, to: number, low: number, high: number) {
  let x = from
  while (x < to) {
    const width = 5 + Math.floor(random() * 7)
    const right = Math.min(x + width, to)
    const height = low + Math.floor(random() * (high - low))
    const back = -34 + Math.floor(random() * 6)
    const front = back + 6 + Math.floor(random() * 6)
    v.box(x, right, 0, height, back, front, random() < 0.5 ? 'stoneDark' : 'shadow')
    for (let wx = x + 1; wx < right - 1; wx += 2) {
      for (let wy = 2; wy < height - 1; wy += 3) {
        if (random() < 0.42) v.put(wx, wy, front - 1, 'warm', Role.window)
      }
    }
    x = right + 1 + Math.floor(random() * 2)
  }
}

export interface LondonModel {
  count: number
  /** x, y, z per voxel, centred on the skyline and standing on the ground */
  home: Float32Array
  /** role, build delay (0..1), seed per voxel */
  meta: Float32Array
  tone: Tone[]
}

export function buildLondon(): LondonModel {
  const random = seededRandom(1894)
  const city = new Voxels()

  thames(city, random)
  rooftops(city, random, 6, 96, 7, 22)
  rooftops(city, random, 169, 176, 12, 26)
  londonEye(city)
  elizabethTower(city)
  parliament(city, random)
  stPauls(city)
  towerBridge(city)
  gherkin(city)
  shard(city, random)

  // A little boat, set on the water where the channel meets the bridge. The shader carries it along its lane.
  const boat = new Voxels()
  const lane = (pivots.leafLeft[0] + pivots.leafRight[0]) / 2
  boat.box(lane - 2, lane + 3, 1, 3, -5, 6, 'stoneLight', Role.boat)
  boat.box(lane - 1, lane + 2, 1, 3, 6, 8, 'stoneLight', Role.boat)
  boat.box(lane - 1, lane + 2, 3, 5, -3, 3, 'rim', Role.boat)
  boat.box(lane, lane + 1, 5, 7, -1, 0, 'gold', Role.boat)
  boat.put(lane, 4, 3, 'warm', Role.boat)

  const voxels = [...city.visible(), ...boat.visible()]
  const count = voxels.length
  const home = new Float32Array(count * 3)
  const meta = new Float32Array(count * 3)
  const tone: Tone[] = []

  voxels.forEach((voxel, i) => {
    home[i * 3] = voxel.x - LONDON_WIDTH / 2
    home[i * 3 + 1] = voxel.y + 0.5
    home[i * 3 + 2] = voxel.z
    // The build starts under the word in the top right and sweeps across, each column stacking upwards.
    const across = 1 - voxel.x / LONDON_WIDTH
    meta[i * 3] = voxel.role
    meta[i * 3 + 1] = Math.min(across * 0.6 + (voxel.y / LONDON_HEIGHT) * 0.32 + random() * 0.08, 1)
    meta[i * 3 + 2] = random()
    tone.push(voxel.tone)
  })

  return { count, home, meta, tone }
}
