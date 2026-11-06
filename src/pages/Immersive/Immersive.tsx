import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import Overlay from './Overlay'
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
  experience: 'left',
  capabilities: 'right',
  registry: 'left',
  contact: 'hidden',
}

/** Distance from the bottom of the viewport to the top of the status box */
const HUD_CLEARANCE = 110

/** Keeps the fixed chrome in step with the page: the top bar's backing and the side the status box sits on. */
function syncChrome(root: HTMLElement | null, scrollY: number) {
  if (!root) return
  root.dataset.scrolled = String(scrollY > 24)
  root.dataset.hud = HUD_SIDE[sectionAt(scrollY + window.innerHeight - HUD_CLEARANCE)]
}

function useLenis(rootRef: React.RefObject<HTMLDivElement | null>) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollState.reducedMotion = reduced

    const lenis = new Lenis({ lerp: reduced ? 1 : 0.085, smoothWheel: !reduced })
    lenisRef.current = lenis
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      updateScroll(scroll)
      syncChrome(rootRef.current, scroll)
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

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
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [rootRef])

  return lenisRef
}

function usePointer() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
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

function useReveal(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.rv'))
    if (scrollState.reducedMotion) {
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
  }, [rootRef])
}

export default function Immersive() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const quality = useMemo(() => detectQuality(), [])
  const lenisRef = useLenis(rootRef)

  usePointer()
  useReveal(rootRef)

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
          <Link to="/dossier">Dossier</Link>
          <a href="https://github.com/thechandanbhagat" target="_blank" rel="noreferrer">
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
