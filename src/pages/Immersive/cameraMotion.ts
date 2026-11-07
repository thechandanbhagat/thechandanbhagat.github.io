import { SECTION_COUNT } from './scrollStore'

// @group CameraMotion : What the camera does when nobody is steering it: the descent on load, the drift while the visitor is still and the rise out at the end of the page

/** Seconds without input before the camera takes over */
export const IDLE_AFTER_SECONDS = 1.6
export const INTRO_SECONDS = 4.5
export const OUTRO_SECONDS = 6

/** How far each section lets the camera wander. The tightly framed sections in the middle stay put. */
const DRIFT_BY_SECTION = [1, 0.5, 0, 0, 0, 0, 0, 1]

/** Share of the way the idle camera turns towards the message being traced */
const FOLLOW_LEAN = 0.14

/** Where the page opens from and where it ends up, as changes to the section's own framing */
const INTRO_POSE = { yaw: 0.4, pull: 0.3, rise: 0.22 }
const OUTRO_POSE = { yaw: -0.2, pull: 0.2, rise: 0.16 }

const DRIFT_IN_RATE = 0.8
const DRIFT_OUT_RATE = 3
/** Scrolling back from the end undoes the rise faster than it built up */
const OUTRO_UNWIND = 3

export interface CameraPose {
  /** Radians around the look point */
  yaw: number
  /** Extra distance from the look point, as a fraction */
  pull: number
  /** Extra height, as a fraction */
  rise: number
  /** How far to turn towards the traced message, 0..1 */
  lean: number
}

export interface MotionInput {
  progress: number
  ready: boolean
  reducedMotion: boolean
  secondsSinceInput: number
  /** Hovering a node: hold the view so it does not slide out from under the pointer */
  holding: boolean
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function ease(value: number) {
  const t = clamp01(value)
  return t * t * t * (t * (6 * t - 15) + 10)
}

function driftAt(progress: number) {
  const index = Math.min(Math.floor(progress), SECTION_COUNT - 2)
  const from = DRIFT_BY_SECTION[index]
  return from + (DRIFT_BY_SECTION[index + 1] - from) * (progress - index)
}

export class CameraMotion {
  readonly pose: CameraPose = { yaw: 0, pull: 0, rise: 0, lean: 0 }
  private introTime = 0
  private outroTime = 0
  private idle = 0
  private clock = 0

  step(dt: number, { progress, ready, reducedMotion, secondsSinceInput, holding }: MotionInput) {
    const { pose } = this
    if (reducedMotion) {
      pose.yaw = pose.pull = pose.rise = pose.lean = 0
      return pose
    }

    const last = SECTION_COUNT - 1
    if (ready) this.introTime = Math.min(this.introTime + dt, INTRO_SECONDS)
    const atEnd = progress > last - 0.02
    this.outroTime = Math.min(Math.max(this.outroTime + (atEnd ? dt : -dt * OUTRO_UNWIND), 0), OUTRO_SECONDS)

    const still = ready && secondsSinceInput > IDLE_AFTER_SECONDS
    const rate = still ? DRIFT_IN_RATE : DRIFT_OUT_RATE
    this.idle += ((still ? 1 : 0) - this.idle) * Math.min(1, dt * rate)
    if (!holding) this.clock += dt

    // The opening only belongs to the hero, the closing only to the last section.
    const intro = (1 - ease(this.introTime / INTRO_SECONDS)) * clamp01(1 - progress)
    const outro = ease(this.outroTime / OUTRO_SECONDS) * clamp01(1 - (last - progress))
    const drift = this.idle * driftAt(progress)

    // Unrelated periods so the path never visibly repeats.
    const t = this.clock
    const sway = 0.06 * Math.sin(0.185 * t) + 0.02 * Math.sin(0.41 * t + 1.3)
    pose.yaw = intro * INTRO_POSE.yaw + outro * OUTRO_POSE.yaw + drift * sway
    pose.pull = intro * INTRO_POSE.pull + outro * OUTRO_POSE.pull + drift * 0.025 * Math.sin(0.11 * t + 2)
    pose.rise = intro * INTRO_POSE.rise + outro * OUTRO_POSE.rise + drift * 0.03 * Math.sin(0.13 * t + 0.7)
    pose.lean = drift * FOLLOW_LEAN
    return pose
  }
}
