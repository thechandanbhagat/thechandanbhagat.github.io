import { prefersReducedMotion } from './pageMotion'

// @group NameFlight : The hero name leaves by flying, letter by letter, up into the top bar, where it becomes the brand

/** Scroll distance the whole flight takes, as a share of the screen height */
const FLIGHT_SCREENS = 0.75
/** The letters set off almost together, so none is left behind for the page to carry off the top of the screen... */
const DEPART_STAGGER = 0.012
/** ...and come in one after another: the first lands this far into the flight, each next one a little later */
const FIRST_LANDS = 0.5
const ARRIVE_STAGGER = 0.034
/** Over the last part of its own flight a letter fades out and the brand's letter fades in where it lands */
const HANDOVER = 0.2
/** The brand stays out of reach until the first letters are close */
const BRAND_FROM = 0.25

interface Flight {
  glyph: HTMLElement
  letter: HTMLElement
  /** When this letter sets off and lands, as shares of the flight */
  start: number
  end: number
  /** Size it lands at: the brand's size, shrunk again where the brand's letter is a lowercase one */
  scale: number
  /** How much the word as a whole shrinks: the brand's size over the title's */
  wordScale: number
  /** Baseline centre of the letter as laid out, in page coordinates */
  fromX: number
  fromY: number
  /** Baseline centre of the brand letter it becomes, on screen: the bar never scrolls */
  toX: number
  toY: number
  /** Where the first letter of its line starts and lands. The line travels as one word, shrinking as it goes. */
  lineFromX: number
  lineToX: number
  /** From the glyph's transform origin (bottom centre) up to its baseline */
  rise: number
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

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
  return {
    size,
    ascent: capital?.fontBoundingBoxAscent || size * 0.92,
    descent: capital?.fontBoundingBoxDescent || size * 0.25,
    /** 'a' stands about as tall as an x, 'h' nearly as tall as an H */
    heightNextToCapital(letter: string) {
      const own = measure(letter)?.actualBoundingBoxAscent
      const upper = measure(letter.toUpperCase())?.actualBoundingBoxAscent
      return own && upper ? own / upper : letter === letter.toUpperCase() ? 1 : 0.72
    },
  }
}

/** Page position of an element as laid out. Offsets ignore transforms, so this holds mid-flight and mid-intro. */
function layoutBox(el: HTMLElement) {
  let left = 0
  let top = 0
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    left += node.offsetLeft
    top += node.offsetTop
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight }
}

export class NameFlight {
  private flights: Flight[] = []
  private distance = 1
  private readonly still = prefersReducedMotion()
  /** Scroll position by which every letter has landed */
  landedBy = 24

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
    this.distance = Math.max(window.innerHeight * FLIGHT_SCREENS, 1)
    this.landedBy = this.distance * Math.min(FIRST_LANDS + ARRIVE_STAGGER * (glyphs.length - 1), 1)

    let lineFromX = 0
    let lineToX = 0
    this.flights = glyphs.map((glyph, i) => {
      const box = layoutBox(glyph)
      const target = letters[i].getBoundingClientRect()
      const char = letters[i].textContent ?? ''
      // The glyph's line is shorter than its font, so the text overhangs the box evenly above and below.
      const rise = (box.height - from.ascent + from.descent) / 2
      const fromX = box.left + box.width / 2
      const toX = target.left + target.width / 2
      if (glyph.closest('.imm-hero__line')?.querySelector('.imm-name__glyph') === glyph) {
        lineFromX = fromX
        lineToX = toX
      }
      return {
        glyph,
        letter: letters[i],
        start: i * DEPART_STAGGER,
        end: Math.min(FIRST_LANDS + i * ARRIVE_STAGGER, 1),
        scale: (to.size / from.size) * to.heightNextToCapital(char),
        wordScale: to.size / from.size,
        fromX,
        fromY: box.top + box.height - rise,
        toX,
        toY: target.bottom - to.descent,
        lineFromX,
        lineToX,
        rise,
      }
    })
  }

  update(scrollY: number) {
    const progress = clamp01(scrollY / this.distance)
    this.root.dataset.brand = progress > BRAND_FROM ? 'shown' : 'hidden'
    this.root.dataset.flight = progress > 0 && !this.still ? 'on' : 'off'

    // Without motion, or until the letters can be measured, the name stays put and the brand fades in once the hero is on its way out.
    if (this.still || this.flights.length === 0) {
      const lit = progress > 0.5 ? '1' : '0'
      this.root.querySelectorAll<HTMLElement>('.imm-topbar__brand--lands .imm-topbar__letter').forEach((letter) => letter.style.setProperty('--lit', lit))
      return
    }

    for (const flight of this.flights) {
      const k = ease(clamp01((progress - flight.start) / (flight.end - flight.start)))
      // Shrinks at an even rate to the eye, which also gets the big letters small before they near the top of the screen
      const scale = flight.scale ** k
      const handover = clamp01((k - (1 - HANDOVER)) / HANDOVER)
      // The line's first letter heads straight for its place and the rest keep their spacing to it, scaled with the word,
      // until the end, when they close up to the brand's own spacing (its typeface is narrower than the title's).
      const offset = flight.fromX - flight.lineFromX
      const settled = flight.toX - flight.lineToX
      const x =
        flight.lineFromX + (flight.lineToX - flight.lineFromX) * k + offset * flight.wordScale ** k + (settled - offset * flight.wordScale) * k ** 3 - flight.fromX
      const y = flight.rise * (scale - 1) + (flight.toY - (flight.fromY - scrollY)) * k
      const style = flight.glyph.style
      style.setProperty('--fly-x', `${x.toFixed(2)}px`)
      style.setProperty('--fly-y', `${y.toFixed(2)}px`)
      style.setProperty('--fly-s', scale.toFixed(4))
      style.setProperty('--fly-fade', handover.toFixed(3))
      flight.letter.style.setProperty('--lit', handover.toFixed(3))
    }
  }
}
