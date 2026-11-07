// @group Theme : Palette, per-section camera keyframes and quality detection for the living-system scene

/** Restrained palette: silver, one soft blue accent, champagne for events, muted amber for alerts */
export const palette = {
  background: '#0a0c12',
  glass: '#1a2233',
  rim: '#e6ecf5',
  accent: '#9cc3ff',
  warm: '#d9c39a',
  alert: '#d9a05b',
  request: '#e8ecf4',
  event: '#d9c39a',
  deploy: '#9cc3ff',
  grid: '#f4f5f7',
}

export interface CameraKeyframe {
  position: [number, number, number]
  lookAt: [number, number, number]
}

/**
 * Where the camera sits for each section (desktop). Sections with copy on the left push the
 * focus to the right of the screen and vice versa, so the diorama never hides behind the text.
 */
export const cameraKeyframes: CameraKeyframe[] = [
  { position: [1.5, 14.5, 21.8], lookAt: [0, 0, 0.7] }, // hero — full overview, the agent plane in the free band under the copy
  { position: [-8.3, 15.4, 21.2], lookAt: [-8.3, 0, 2.9] }, // about — request path, copy on the left
  { position: [-10.0, 20.0, 16.0], lookAt: [2.0, 0, 14.0] }, // ai — looks along the agent plane so it stacks in the strip left of the copy
  { position: [-2.2, 18.0, 22.8], lookAt: [7.8, 0, 3.9] }, // experience — media pipeline + RAG, copy on the right
  { position: [-19.4, 15.1, 12.0], lookAt: [-8.9, 0, -7.7] }, // capabilities — delivery pipeline, copy on the left
  { position: [11.3, 19.4, 6.5], lookAt: [2.5, 0, -10.1] }, // registry — registries and cluster, copy on the right
  { position: [-11.0, 17.0, 23.0], lookAt: [-10.3, 0, 1.6] }, // talks — wide view pushed right of the copy on the left
  { position: [-4.5, 15.5, 22.5], lookAt: [-0.2, 0, 0.9] }, // contact — calm overview from the other side
]

/**
 * Portrait phones: every section opens with a clear window at the top of the viewport
 * (the hero keeps its copy at the top and the window below), so the focus is framed there.
 */
export const mobileCameraKeyframes: CameraKeyframe[] = [
  { position: [-0.5, 38.0, 20.5], lookAt: [-0.5, 0, -10.5] }, // hero — overview in the lower half
  { position: [-2.3, 16.0, 25.3], lookAt: [-2.3, 0, 4.8] }, // about — request path
  { position: [1.8, 20.0, 26.0], lookAt: [1.9, 0, 13.0] }, // ai — agent plane and its trust boundary
  { position: [-3.2, 12.9, 16.0], lookAt: [-0.2, 0, 3.9] }, // experience — media pipeline + RAG
  { position: [-8.9, 15.9, 5.8], lookAt: [-5.0, 0, -1.7] }, // capabilities — delivery pipeline
  { position: [-3.3, 17.0, 8.4], lookAt: [-1.5, 0, -2.0] }, // registry — registries and cluster
  { position: [-1.0, 30.0, 22.0], lookAt: [-1.0, 0, 5.0] }, // talks — overview in the top window
  { position: [-0.5, 36.0, 25.0], lookAt: [-0.5, 0, 8.0] }, // contact — overview in the top window
]

/** Below this width, or below this aspect ratio, the page uses the phone layout and the portrait camera */
export const COMPACT_WIDTH = 900
export const COMPACT_ASPECT = 0.9

export function isCompact(width: number, aspect: number) {
  return aspect < COMPACT_ASPECT || width < COMPACT_WIDTH
}

/** Tablets back the desktop camera off a little */
export function cameraPullback(aspect: number, compact: boolean) {
  if (compact) return 1
  return aspect < 1.2 ? 1.35 : aspect < 1.6 ? 1.12 : 1
}

export const FOV_LANDSCAPE = 34
export const FOV_PORTRAIT = 48

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

/** Most messages in flight at once, and how busy the system is relative to its normal load */
export function trafficFor(quality: Quality) {
  return quality === 'high' ? { capacity: 200, load: 1.4 } : { capacity: 120, load: 0.9 }
}
