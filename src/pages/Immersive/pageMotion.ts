import { useEffect, useRef, useState, type RefObject } from 'react'
import Lenis from 'lenis'

// @group PageMotion : Scroll behaviour the landing page, the gallery and the software page share

/** Height of the top bar, which a page's big title has to be gone by */
const TOP_BAR_HEIGHT = 80

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** The page's smooth scroll, so a menu can hold the page still while it covers it */
let activeScroll: Lenis | null = null

/** Starts the smooth scroll and reports every position. Call the returned stop() when the page goes away. */
export function startSmoothScroll(onScroll: (scrollY: number) => void) {
  const reduced = prefersReducedMotion()
  const lenis = new Lenis({ lerp: reduced ? 1 : 0.085, smoothWheel: !reduced })
  lenis.on('scroll', ({ scroll }: { scroll: number }) => onScroll(scroll))
  activeScroll = lenis

  let frame = 0
  const raf = (time: number) => {
    lenis.raf(time)
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

/** Lifts the kicker, the title and the buttons out, timed so each has gone by the time it would reach the top bar. */
export function syncHeroExit(root: HTMLElement, scrollY: number) {
  HERO_EXITS.forEach(([selector, property]) => {
    const part = root.querySelector<HTMLElement>(selector)
    if (!part) return
    const exit = Math.max(part.getBoundingClientRect().bottom + scrollY - TOP_BAR_HEIGHT, 1)
    part.style.setProperty(property, Math.min(scrollY / exit, 1).toFixed(3))
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
        root.dataset.scrolled = String(scrollY > 24)
        syncHeroExit(root, scrollY)
      }
      onScroll?.(scrollY)
    }

    const scroll = startSmoothScroll(sync)
    scrollRef.current = scroll
    sync(window.scrollY)
    const id = window.setTimeout(() => setReady(true), 80)

    return () => {
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
