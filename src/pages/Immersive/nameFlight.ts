import { layoutBox, prefersReducedMotion, setData } from './pageMotion'

// @group NameFlight : The hero name leaves by flying up into the top bar, where it becomes the brand

/** The phone layout. Keep in step with the media query in Immersive.css and isCompact in theme.ts */
const COMPACT_QUERY = '(max-width: 900px), (max-aspect-ratio: 9/10)'

/**
 * With a mouse or trackpad the name follows the scroll: each line rides up with the page, shrinking and
 * sliding over as it goes, and lands just as its baseline meets the bar's. Each letter lands this much
 * later than the one before it, as a share of its line's travel.
 */
const LETTER_LAG = 0.015

/**
 * On a phone the name sits just under the bar and a flick of the finger covers that in an instant, so
 * instead the name glides up on its own once the page starts to move, and back when it returns to the top.
 */
const GLIDE_SECONDS = 1
/** How long the second line waits after the first, in glides. Each line moves as one word. */
const GLIDE_LINE = 0.14
/** The share of the first line's climb at which the glide sets off, and the share it must come back under to return */
const GLIDE_GO = 0.35
const GLIDE_BACK = 0.12
/** How much faster the glide finishes once a quick flick has carried the copy up to the bar, which then needs its backing */
const GLIDE_HURRY = 2.5
/** Before this scroll the bar is clear, so nothing covers the letters on their way up */
const BAR_BACKED_FROM = 24

interface Flight {
  glyph: HTMLElement
  letter: HTMLElement
  /** Scroll distance over which this letter flies, when it follows the scroll */
  travel: number
  /** How long it waits before it glides, in glides */
  delay: number
  /** Size it lands at: the brand's size, shrunk again where the brand's letter is a lowercase one */
  scale: number
  /** How much its line shrinks as a whole: the brand's size over the title's */
  wordScale: number
  /** Baseline centre of the letter as laid out, in page coordinates */
  fromX: number
  fromY: number
  /** Baseline centre of the brand letter it becomes, on screen: the bar never scrolls */
  toX: number
  toY: number
  /** Where the first letter of its line starts and lands. The line keeps its shape around it as it shrinks. */
  lineFromX: number
  lineToX: number
  /** From the glyph's transform origin (bottom centre) up to its baseline */
  rise: number
}

/** Where a letter is part way up: how far its line has moved over, how small it is and where its baseline is on screen */
interface Pose {
  along: number
  close: number
  shrink: number
  baseline: number
  handover: number
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
const smoothstep = (t: number) => t * t * (3 - 2 * t)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeOut = (t: number) => 1 - (1 - t) ** 3

let probe: CanvasRenderingContext2D | null = null

/** Where the baseline sits in a line of this element's font, and how tall a letter stands next to its capital */
function fontMetrics(el: Element) {
  const style = getComputedStyle(el)
  const size = parseFloat(style.fontSize)
  probe ??= document.createElement('canvas').getContext('2d')
  const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  const measure = (text: string) => {
    if (!probe) return null
    probe.font = font
    return probe.measureText(text)
  }
  const capital = measure('H')
  const caps = style.textTransform === 'uppercase'
  return {
    size,
    ascent: capital?.fontBoundingBoxAscent || size * 0.92,
    descent: capital?.fontBoundingBoxDescent || size * 0.25,
    /** 'a' stands about as tall as an x, 'h' nearly as tall as an H */
    heightNextToCapital(letter: string) {
      const shown = caps ? letter.toUpperCase() : letter
      const own = measure(shown)?.actualBoundingBoxAscent
      const upper = measure(shown.toUpperCase())?.actualBoundingBoxAscent
      return own && upper ? own / upper : shown === shown.toUpperCase() ? 1 : 0.72
    },
  }
}

export class NameFlight {
  private flights: Flight[] = []
  private readonly still = prefersReducedMotion()
  private gliding = false
  /** Scroll position by which every letter has landed, when the name follows the scroll */
  private landedBy = BAR_BACKED_FROM
  /** Every letter is in the bar: nothing changes again until the page comes back up */
  private landed = false
  /** Where the glide is: 0 with the name in the hero, glideEnd with every letter in the bar */
  private glide = 0
  private glideTo = 0
  private glideEnd = 1
  /** The glide drawn last, when it has stopped: nothing moves until it starts again */
  private drawn = -1
  /** Scroll position at which the copy under the name would reach the bar, so the bar has to take its backing */
  private clearance = Infinity
  private measured = false
  private frame = 0
  private last = 0

  constructor(private readonly root: HTMLElement) {}

  /** Call whenever the layout may have changed: on load, once the fonts are in, and on resize. */
  measure() {
    const title = this.root.querySelector<HTMLElement>('.imm-hero__title--flies')
    const brand = this.root.querySelector<HTMLElement>('.imm-topbar__brand--lands')
    if (!title || !brand) return
    const glyphs = Array.from(title.querySelectorAll<HTMLElement>('.imm-name__glyph'))
    const letters = Array.from(brand.querySelectorAll<HTMLElement>('.imm-topbar__letter')).filter((letter) => letter.textContent?.trim())
    if (glyphs.length === 0 || glyphs.length !== letters.length) return

    const from = fontMetrics(glyphs[0])
    const to = fontMetrics(brand)
    let lineFromX = 0
    let lineToX = 0
    let line = -1
    let place = 0

    this.flights = glyphs.map((glyph, i) => {
      const box = layoutBox(glyph)
      const target = letters[i].getBoundingClientRect()
      // The glyph's line is shorter than its font, so the text overhangs the box evenly above and below.
      const rise = (box.height - from.ascent + from.descent) / 2
      const fromX = box.left + box.width / 2
      const fromY = box.top + box.height - rise
      const toX = target.left + target.width / 2
      const toY = target.bottom - to.descent
      if (glyph.closest('.imm-hero__line')?.querySelector('.imm-name__glyph') === glyph) {
        lineFromX = fromX
        lineToX = toX
        line++
        place = 0
      }
      return {
        glyph,
        letter: letters[i],
        travel: Math.max(fromY - toY, 1) * (1 + LETTER_LAG * place++),
        delay: line * GLIDE_LINE,
        scale: (to.size / from.size) * to.heightNextToCapital(letters[i].textContent ?? ''),
        wordScale: to.size / from.size,
        fromX,
        fromY,
        toX,
        toY,
        lineFromX,
        lineToX,
        rise,
      }
    })

    this.landedBy = Math.max(...this.flights.map((flight) => flight.travel))
    this.landed = false
    this.drawn = -1
    this.glideEnd = 1 + Math.max(...this.flights.map((flight) => flight.delay))
    const sub = this.root.querySelector<HTMLElement>('.imm-hero__sub')
    const bar = this.root.querySelector<HTMLElement>('.imm-topbar')
    this.clearance = sub && bar ? layoutBox(sub).top - bar.getBoundingClientRect().bottom : Infinity

    // A page that opens part way down, or a screen that turns, starts with the name already where it belongs
    const gliding = window.matchMedia(COMPACT_QUERY).matches
    if (!this.measured || gliding !== this.gliding) {
      this.stop()
      this.gliding = gliding
      this.glide = this.glideTo = window.scrollY > this.flights[0].travel * GLIDE_GO ? this.glideEnd : 0
    }
    this.measured = true
  }

  /** Call on every scroll */
  update(scrollY: number) {
    // Without motion, or until the letters can be measured, the name stays put and the brand fades in once it has gone by.
    if (this.still || this.flights.length === 0) {
      const gone = scrollY > (this.flights[0]?.travel ?? window.innerHeight * 0.3) * 0.6
      setData(this.root, 'scrolled', String(scrollY > BAR_BACKED_FROM))
      setData(this.root, 'flight', 'off')
      setData(this.root, 'brand', gone ? 'shown' : 'hidden')
      this.root.querySelectorAll<HTMLElement>('.imm-topbar__brand--lands .imm-topbar__letter').forEach((letter) => letter.style.setProperty('--lit', gone ? '1' : '0'))
      return
    }

    if (this.gliding) {
      const climb = this.flights[0].travel
      if (scrollY > climb * GLIDE_GO) this.glideToward(this.glideEnd)
      else if (scrollY < climb * GLIDE_BACK) this.glideToward(0)
      this.drawGlide(scrollY)
    } else {
      this.drawScrub(scrollY)
    }
  }

  stop() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
  }

  private glideToward(target: number) {
    if (this.glideTo === target) return
    this.glideTo = target
    if (this.frame) return
    this.last = performance.now()
    this.frame = requestAnimationFrame(this.tick)
  }

  private tick = (now: number) => {
    const hurry = window.scrollY > this.clearance ? GLIDE_HURRY : 1
    const step = (Math.min(Math.max(now - this.last, 0) / 1000, 0.05) / GLIDE_SECONDS) * hurry
    this.last = now
    this.glide = this.glideTo > this.glide ? Math.min(this.glide + step, this.glideTo) : Math.max(this.glide - step, this.glideTo)
    this.frame = this.glide === this.glideTo ? 0 : requestAnimationFrame(this.tick)
    this.drawGlide(window.scrollY)
  }

  /** Phones: each letter glides from wherever the page has carried it to its place in the bar */
  private drawGlide(scrollY: number) {
    // The glide only depends on the scroll while it moves: at rest the name is either laid out or in the bar
    const resting = this.frame === 0
    if (resting && this.drawn === this.glide) return
    this.drawn = resting ? this.glide : -1

    let lit = false
    for (const flight of this.flights) {
      const t = clamp01(this.glide - flight.delay)
      // Each line draws in to its size and slides over to its place first, then rises into the bar, so the
      // surname lines up under the first name before it slots in beside it
      const across = easeOut(t)
      const up = easeInOut(t)
      // Never from above the bar: a letter the page has already carried past it slides along it instead
      const from = Math.max(flight.fromY - scrollY, flight.toY)
      const handover = t >= 1 ? 1 : 0
      lit ||= handover > 0
      this.pose(flight, scrollY, { along: across, close: across ** 3, shrink: across, baseline: from + (flight.toY - from) * up, handover })
    }

    setData(this.root, 'flight', this.glide > 0 ? 'on' : 'off')
    setData(this.root, 'brand', lit ? 'shown' : 'hidden')
    // The bar takes its backing once the name is in it, or sooner if the copy below would otherwise reach it first
    setData(this.root, 'scrolled', String(this.glide >= this.glideEnd || scrollY > this.clearance))
  }

  /** Mouse and trackpad: the flight follows the scroll */
  private drawScrub(scrollY: number) {
    setData(this.root, 'flight', scrollY > 0 ? 'on' : 'off')
    // The bar only takes its backing once the name has landed in it, so nothing blurs the letters on the way up.
    setData(this.root, 'scrolled', String(scrollY > this.landedBy))

    const landed = scrollY >= this.landedBy
    if (landed && this.landed) return
    this.landed = landed

    let lit = false
    for (const flight of this.flights) {
      const t = clamp01(scrollY / flight.travel)
      // The brand is the same wordmark, so the hero letter hands over to it on the spot as it lands
      const handover = t >= 1 ? 1 : 0
      lit ||= handover > 0
      this.pose(flight, scrollY, {
        along: smoothstep(t),
        close: t ** 3,
        // Shrinks gently at first and faster near the bar, at a rate that is even to the eye rather than in pixels
        shrink: t ** 1.5,
        // The page carries it up; once its baseline reaches the bar's it stays there for the last of its slide.
        baseline: Math.max(flight.fromY - scrollY, flight.toY),
        handover,
      })
    }
    setData(this.root, 'brand', lit ? 'shown' : 'hidden')
  }

  private pose(flight: Flight, scrollY: number, pose: Pose) {
    const scale = flight.scale ** pose.shrink
    const wordScale = flight.wordScale ** pose.shrink
    // The line's first letter heads for its place and the rest keep their spacing to it, scaled with the word, until
    // the very end, when they close up to the brand's own spacing.
    const offset = flight.fromX - flight.lineFromX
    const settled = flight.toX - flight.lineToX
    const x =
      flight.lineFromX +
      (flight.lineToX - flight.lineFromX) * pose.along +
      offset * wordScale +
      (settled - offset * flight.wordScale) * pose.close -
      flight.fromX
    const y = flight.rise * (scale - 1) + pose.baseline - (flight.fromY - scrollY)

    const style = flight.glyph.style
    style.setProperty('--fly-x', `${x.toFixed(2)}px`)
    style.setProperty('--fly-y', `${y.toFixed(2)}px`)
    style.setProperty('--fly-s', scale.toFixed(4))
    style.setProperty('--fly-fade', pose.handover.toFixed(3))
    flight.letter.style.setProperty('--lit', pose.handover.toFixed(3))
  }
}
