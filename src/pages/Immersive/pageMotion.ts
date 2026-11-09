import { useEffect, useRef, useState, type RefObject } from 'react'
import Lenis from 'lenis'

// @group PageMotion : Scroll behaviour the landing page, the gallery and the software page share

/** Height of the top bar, which a page's big title has to be gone by */
const TOP_BAR_HEIGHT = 80

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Page position of an element as laid out. Offsets ignore transforms, so this holds while the element is moving. */
export function layoutBox(el: HTMLElement) {
  let left = 0
  let top = 0
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    left += node.offsetLeft
    top += node.offsetTop
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight }
}

/** Sets a data attribute only when it changes, since every write makes the browser look at the styles again */
export function setData(el: HTMLElement, key: string, value: string) {
  if (el.dataset[key] !== value) el.dataset[key] = value
}

/** The page's smooth scroll, so a menu can hold the page still while it covers it */
let activeScroll: Lenis | null = null

/**
 * The smooth wheel moves the page from animation frames, so when the browser hands those out slowly (Low Power Mode
 * and battery savers hold them to 30 a second, a busy machine drops them) the page itself would scroll that slowly.
 * Native scrolling keeps the display's own rate, so the wheel goes back to it until frames come at full speed again.
 */
const SLOW_FRAME_MS = 24
/** Frames per check, about half a second */
const FRAME_SAMPLE = 30
/** Checks in a row at full speed before the smooth wheel comes back */
const RECOVER_CHECKS = 4
/** A machine that keeps slowing down, often only while it scrolls, keeps the native wheel after this many slowdowns */
const SLOWDOWNS_TO_STAY = 2

/** Starts the smooth scroll and reports every position. Call the returned stop() when the page goes away. */
export function startSmoothScroll(onScroll: (scrollY: number) => void) {
  const reduced = prefersReducedMotion()
  const lenis = new Lenis({ lerp: reduced ? 1 : 0.085, smoothWheel: !reduced })
  lenis.on('scroll', ({ scroll }: { scroll: number }) => onScroll(scroll))
  activeScroll = lenis

  const gaps: number[] = []
  let last = 0
  let healthy = 0
  let slowdowns = 0
  const pace = (time: number) => {
    const gap = time - last
    last = time
    // A longer gap is a tab coming back into view, not a slow frame
    if (gap > 0 && gap < 250) gaps.push(gap)
    if (gaps.length < FRAME_SAMPLE) return
    gaps.sort((a, b) => a - b)
    const slow = gaps[FRAME_SAMPLE >> 1] > SLOW_FRAME_MS
    gaps.length = 0
    healthy = slow ? 0 : healthy + 1
    const smooth = !slow && (lenis.options.smoothWheel || (healthy >= RECOVER_CHECKS && slowdowns < SLOWDOWNS_TO_STAY))
    // Never mid-glide: the glide would carry on and pull against the native scroll
    if (smooth === lenis.options.smoothWheel || lenis.isScrolling === 'smooth') return
    if (!smooth) slowdowns += 1
    lenis.options.smoothWheel = smooth
  }

  let frame = 0
  const raf = (time: number) => {
    lenis.raf(time)
    if (!reduced) pace(time)
    frame = requestAnimationFrame(raf)
  }
  frame = requestAnimationFrame(raf)

  return {
    lenis,
    stop() {
      cancelAnimationFrame(frame)
      if (activeScroll === lenis) activeScroll = null
      lenis.destroy()
    },
  }
}

/** Holds the page still behind a full-screen menu, or lets it go again. Release it before scrolling anywhere. */
export function holdScroll(held: boolean) {
  if (held) activeScroll?.stop()
  else activeScroll?.start()
  document.documentElement.classList.toggle('imm-held', held)
}

/** Hero parts that leave as the page scrolls, and the property each one's CSS follows */
const HERO_EXITS = [
  ['.imm-hero__kicker', '--kicker-out'],
  ['.imm-hero__title', '--name-out'],
  ['.imm-hero__actions', '--actions-out'],
] as const

interface HeroExit {
  part: HTMLElement
  property: string
  /** Scroll distance by which the part has gone */
  exit: number
  /** Value written last, so an unchanged one is not written again */
  written: string
}

const heroExits = new WeakMap<HTMLElement, HeroExit[]>()

/**
 * Measures where each hero part leaves. Reading the layout on every scroll would make the browser lay the page out
 * again each frame, so call this whenever the layout may have changed instead: on load, once the fonts are in, and on resize.
 */
export function measureHeroExit(root: HTMLElement) {
  const parts = HERO_EXITS.flatMap(([selector, property]) => {
    const part = root.querySelector<HTMLElement>(selector)
    if (!part) return []
    const box = layoutBox(part)
    return [{ part, property, exit: Math.max(box.top + box.height - TOP_BAR_HEIGHT, 1), written: '' }]
  })
  heroExits.set(root, parts)
}

/** Lifts the kicker, the title and the buttons out, timed so each has gone by the time it would reach the top bar. */
export function syncHeroExit(root: HTMLElement, scrollY: number) {
  if (!heroExits.has(root)) measureHeroExit(root)
  heroExits.get(root)?.forEach((exit) => {
    const value = Math.min(scrollY / exit.exit, 1).toFixed(3)
    if (value === exit.written) return
    exit.written = value
    exit.part.style.setProperty(exit.property, value)
  })
}

/**
 * Starts a page that sits outside the map: smooth scroll, the hero's exit and the top bar's backdrop.
 * @param onScroll keep this stable, it restarts the page when it changes
 */
export function useSitePage(rootRef: RefObject<HTMLElement | null>, onScroll?: (scrollY: number) => void) {
  const [ready, setReady] = useState(false)
  const scrollRef = useRef<ReturnType<typeof startSmoothScroll> | null>(null)

  useEffect(() => {
    document.body.classList.add('imm-body')
    window.scrollTo(0, 0)

    const sync = (scrollY: number) => {
      const root = rootRef.current
      if (root) {
        setData(root, 'scrolled', String(scrollY > 24))
        syncHeroExit(root, scrollY)
      }
      onScroll?.(scrollY)
    }

    const scroll = startSmoothScroll(sync)
    scrollRef.current = scroll
    sync(window.scrollY)
    const id = window.setTimeout(() => setReady(true), 80)

    // The hero's exits are measured once, so they are measured again whenever the page changes size, fonts included
    const observer = new ResizeObserver(() => {
      if (!rootRef.current) return
      measureHeroExit(rootRef.current)
      sync(window.scrollY)
    })
    if (rootRef.current) observer.observe(rootRef.current)

    return () => {
      observer.disconnect()
      window.clearTimeout(id)
      scroll.stop()
      scrollRef.current = null
      document.body.classList.remove('imm-body')
    }
  }, [rootRef, onScroll])

  return { ready, scrollRef }
}

/**
 * Reveals every `.rv` element as it scrolls into view.
 * @param contentKey change this when new elements appear, so they get revealed too
 */
export function useReveal(rootRef: RefObject<HTMLElement | null>, contentKey?: unknown) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.rv:not(.in)'))
    if (prefersReducedMotion()) {
      nodes.forEach((node) => node.classList.add('in'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [rootRef, contentKey])
}
