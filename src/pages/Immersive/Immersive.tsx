import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type Lenis from 'lenis'
import Overlay from './Overlay'
import { prefersReducedMotion, startSmoothScroll, syncHeroExit, useReveal } from './pageMotion'
import SystemHud from './SystemHud'
import { measureSections, scrollState, sectionAt, updateScroll, type SectionId } from './scrollStore'
import { detectQuality } from './theme'
import './Immersive.css'

const Scene = lazy(() => import('./Scene'))

// @group Immersive : Root page — smooth scroll, pointer tracking, scroll reveals and the lazy WebGL scene

/** The side of the screen each section leaves free of copy, where the status box can sit without covering anything */
const HUD_SIDE: Record<SectionId, 'left' | 'right' | 'hidden'> = {
  hero: 'right',
  about: 'right',
  ai: 'left',
  experience: 'left',
  capabilities: 'right',
  registry: 'left',
  talks: 'right',
  contact: 'hidden',
}

/** Distance from the bottom of the viewport to the top of the status box */
const HUD_CLEARANCE = 110

/** Keeps the page's chrome in step with the scroll: the top bar's backing, the side the status box sits on and how far the hero has lifted out. */
function syncChrome(root: HTMLElement | null, scrollY: number) {
  if (!root) return
  root.dataset.scrolled = String(scrollY > 24)
  root.dataset.hud = HUD_SIDE[sectionAt(scrollY + window.innerHeight - HUD_CLEARANCE)]
  syncHeroExit(root, scrollY)
}

function useLenis(rootRef: React.RefObject<HTMLDivElement | null>) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    scrollState.reducedMotion = prefersReducedMotion()

    const scroll = startSmoothScroll((scrollY) => {
      scrollState.lastInput = performance.now()
      updateScroll(scrollY)
      syncChrome(rootRef.current, scrollY)
    })
    lenisRef.current = scroll.lenis

    const measure = () => {
      measureSections(rootRef.current)
      updateScroll(window.scrollY)
      syncChrome(rootRef.current, window.scrollY)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (rootRef.current) observer.observe(rootRef.current)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      scroll.stop()
      lenisRef.current = null
    }
  }, [rootRef])

  return lenisRef
}

function usePointer() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      scrollState.lastInput = performance.now()
      scrollState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      scrollState.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
      scrollState.pointerActive = event.pointerType !== 'touch'
    }
    const onLeave = () => {
      scrollState.pointer.x = 0
      scrollState.pointer.y = 0
      scrollState.pointerActive = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])
}

export default function Immersive() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const quality = useMemo(() => detectQuality(), [])
  const lenisRef = useLenis(rootRef)

  const { hash } = useLocation()

  usePointer()
  useReveal(rootRef)

  // Other pages link straight to a section, for example the gallery's way back to the talks.
  useEffect(() => {
    const section = hash && document.getElementById(`imm-${hash.slice(1)}`)
    if (section) lenisRef.current?.scrollTo(section, { immediate: true, force: true })
  }, [hash, lenisRef])

  useEffect(() => {
    document.body.classList.add('imm-body')
    const id = window.setTimeout(() => {
      setReady(true)
      scrollState.ready = true
    }, 600)
    return () => {
      document.body.classList.remove('imm-body')
      window.clearTimeout(id)
    }
  }, [])

  const navigate = (id: string) => {
    const el = document.getElementById(`imm-${id}`)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={rootRef} className={`imm${ready ? ' is-ready' : ''}`}>
      <Suspense fallback={null}>
        <Scene quality={quality} />
      </Suspense>

      <header className="imm-topbar">
        <button type="button" className="imm-topbar__brand" onClick={() => navigate('hero')}>
          Chandan Bhagat
        </button>
        <nav className="imm-topbar__nav">
          <Link to="/software">Software</Link>
          <Link className="imm-topbar__secondary" to="/portfolio">
            Gallery
          </Link>
          <a className="imm-topbar__optional" href="https://github.com/thechandanbhagat" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <button type="button" className="imm-topbar__cta" onClick={() => navigate('contact')}>
            Contact
          </button>
        </nav>
      </header>

      <Overlay onNavigate={navigate} />
      <SystemHud />
    </div>
  )
}
