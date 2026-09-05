// @group ScrollStore : Frame-synchronised scroll and pointer state shared between the DOM overlay and the WebGL scene

export const SECTION_IDS = ['hero', 'about', 'experience', 'capabilities', 'registry', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

export const SECTION_COUNT = SECTION_IDS.length

export interface ScrollState {
  /** Continuous section index: 0 = top of hero, 5 = top of contact */
  morph: number
  /** Camera progress: holds each section's keyframe while its copy is on screen, glides in the last 40% */
  progress: number
  /** Normalised device coordinates of the pointer (-1..1) */
  pointer: { x: number; y: number }
  /** False until a real pointer event arrives, so nothing counts as hovered by default */
  pointerActive: boolean
  reducedMotion: boolean
  /** Whether the intro fade has finished */
  ready: boolean
}

export const scrollState: ScrollState = {
  morph: 0,
  progress: 0,
  pointer: { x: 0, y: 0 },
  pointerActive: false,
  reducedMotion: false,
  ready: false,
}

let sectionTops: number[] = []

export function measureSections(root: HTMLElement | null) {
  if (!root) return
  sectionTops = SECTION_IDS.map((id) => {
    const node = root.querySelector<HTMLElement>(`[data-section="${id}"]`)
    return node ? node.getBoundingClientRect().top + window.scrollY : 0
  })
}

export function updateScroll(scrollY: number) {
  if (sectionTops.length < 2) return
  const anchor = scrollY + window.innerHeight * 0.35
  let index = 0
  for (let i = 0; i < sectionTops.length - 1; i += 1) {
    if (anchor >= sectionTops[i]) index = i
  }
  const from = sectionTops[index]
  const to = sectionTops[index + 1] ?? from + window.innerHeight
  const fraction = Math.min(Math.max((anchor - from) / Math.max(to - from, 1), 0), 1)
  scrollState.morph = Math.min(index + fraction, SECTION_COUNT - 1)
  const glide = Math.min(Math.max((fraction - 0.6) / 0.4, 0), 1)
  const eased = glide * glide * (3 - 2 * glide)
  scrollState.progress = Math.min(index + eased, SECTION_COUNT - 1)
}
