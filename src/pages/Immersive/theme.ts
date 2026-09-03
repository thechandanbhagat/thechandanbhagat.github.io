// @group Theme : Per-section colour palettes, object keyframes and quality detection for the immersive scene

export interface SectionPalette {
  a: string
  b: string
  c: string
}

export const sectionPalettes: SectionPalette[] = [
  { a: '#dfe7f5', b: '#9cc3ff', c: '#ffffff' }, // hero — silver / soft blue
  { a: '#cfd8e8', b: '#8fb4f0', c: '#ffffff' }, // about
  { a: '#e8e2d6', b: '#c9b48a', c: '#fff8ea' }, // experience — ivory / champagne
  { a: '#d5dde9', b: '#9cc3ff', c: '#ffffff' }, // capabilities
  { a: '#e3e8f0', b: '#aac6f5', c: '#ffffff' }, // registry
  { a: '#dfe7f5', b: '#9cc3ff', c: '#ffffff' }, // contact
]

export interface Keyframe {
  core: [number, number, number]
  coreScale: number
  camera: [number, number, number]
  tilt: number
}

/** Where the hero core and camera sit for each section (desktop layout) */
export const keyframes: Keyframe[] = [
  { core: [0, 0, 0], coreScale: 1.15, camera: [0, 0, 8], tilt: 0 },
  { core: [2.9, 0.3, -1.2], coreScale: 0.75, camera: [0.4, 0.2, 8.4], tilt: -0.04 },
  { core: [-3.1, 0.1, -1.6], coreScale: 0.55, camera: [-0.3, 0.1, 8.8], tilt: 0.05 },
  { core: [3.0, -0.2, -1.4], coreScale: 0.65, camera: [0.3, -0.1, 8.2], tilt: -0.03 },
  { core: [-3.0, 0.4, -1.8], coreScale: 0.6, camera: [-0.4, 0.3, 9.0], tilt: 0.06 },
  { core: [3.4, -1.9, -1.5], coreScale: 0.5, camera: [0, 0.2, 8.2], tilt: 0 },
]

export type Quality = 'high' | 'low'

export function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'low'
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.innerWidth < 820
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  if (coarse || small || cores <= 4 || memory <= 4) return 'low'
  return 'high'
}

export function particleCountFor(quality: Quality) {
  return quality === 'high' ? 42000 : 14000
}
