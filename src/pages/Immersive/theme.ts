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
  { position: [1.0, 11.0, 16.0], lookAt: [-0.6, 0, -1.6] }, // hero — full overview
  { position: [-8.3, 15.4, 21.2], lookAt: [-8.3, 0, 2.9] }, // about — request path, copy on the left
  { position: [-2.2, 18.0, 22.8], lookAt: [7.8, 0, 3.9] }, // experience — media pipeline + RAG, copy on the right
  { position: [-19.4, 15.1, 12.0], lookAt: [-8.9, 0, -7.7] }, // capabilities — delivery pipeline, copy on the left
  { position: [11.3, 19.4, 6.5], lookAt: [2.5, 0, -10.1] }, // registry — registries and cluster, copy on the right
  { position: [-4.0, 13.0, 17.0], lookAt: [-0.6, 0, -1.8] }, // contact — calm overview from the other side
]

/**
 * Portrait phones: every section opens with a clear window at the top of the viewport
 * (the hero keeps its copy at the top and the window below), so the focus is framed there.
 */
export const mobileCameraKeyframes: CameraKeyframe[] = [
  { position: [-0.5, 33.9, 17.5], lookAt: [-0.5, 0, -10.5] }, // hero — overview in the lower half
  { position: [-2.3, 16.0, 25.3], lookAt: [-2.3, 0, 4.8] }, // about — request path
  { position: [-3.2, 12.9, 16.0], lookAt: [-0.2, 0, 3.9] }, // experience — media pipeline + RAG
  { position: [-8.9, 15.9, 5.8], lookAt: [-5.0, 0, -1.7] }, // capabilities — delivery pipeline
  { position: [-3.3, 17.0, 8.4], lookAt: [-1.5, 0, -2.0] }, // registry — registries and cluster
  { position: [-0.5, 32.0, 22.0], lookAt: [-0.5, 0, 7.0] }, // contact — overview in the top window
]

/** Below this width, or below this aspect ratio, the page uses the phone layout and the portrait camera */
export const COMPACT_WIDTH = 900
export const COMPACT_ASPECT = 0.9

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

export function particleCountFor(quality: Quality) {
  return quality === 'high' ? 9000 : 3600
}
