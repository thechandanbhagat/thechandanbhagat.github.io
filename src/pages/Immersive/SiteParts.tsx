import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { registryStats, type Software } from '../../data/software'
import { holdScroll } from './pageMotion'

// @group SiteParts : Pieces the landing page, the gallery and the software page share, so they read as one site

const COPIED_FOR_MS = 1800
const CONTACT_EMAIL = 'chandan.bhagat@outlook.com'
const GITHUB_URL = 'https://github.com/thechandanbhagat'
/** The phone layout. Keep in step with the media query in Immersive.css and isCompact in theme.ts */
const COMPACT_QUERY = '(max-width: 900px), (max-aspect-ratio: 9/10)'

export function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <p className="imm-eyebrow rv">
      <span className="imm-eyebrow__index">{index}</span>
      <span className="imm-eyebrow__line" />
      <span>{label}</span>
    </p>
  )
}

/** Letters on their own so a title can rise in and lift out one at a time. Screen readers get the words from the parent. */
export function NameLetters({ text, from = 0 }: { text: string; from?: number }) {
  return (
    <>
      {[...text].map((letter, i) => (
        <span className="imm-name" aria-hidden="true" key={i}>
          <span className="imm-name__glyph" style={{ '--i': from + i } as CSSProperties}>
            {letter}
          </span>
        </span>
      ))}
    </>
  )
}

/** A message walking the outline of a pill button. Goes inside the button; the radius is half the button's height. */
export function TraceRing() {
  return (
    <svg className="imm-btn__trace" aria-hidden="true">
      <rect width="100%" height="100%" rx="28" pathLength="100" />
    </svg>
  )
}

/** One line of the phone menu: a small index, then the name in the display face */
export function MenuLabel({ index, external, children }: { index: string; external?: boolean; children: ReactNode }) {
  return (
    <>
      <span className="imm-menu__index" aria-hidden="true">
        {index}
      </span>
      <span className={`imm-menu__label${external ? ' imm-menu__label--external' : ''}`}>{children}</span>
    </>
  )
}

/**
 * On phones the links fold away behind a menu button and open as a sheet over the whole page.
 * The page supplies the links and gets a close() to call before it scrolls anywhere; links close it themselves.
 */
export function MenuSheet({ children }: { children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Lets the page go straight away, so a scroll the caller starts next is not swallowed
  const close = useCallback(() => {
    holdScroll(false)
    setOpen(false)
  }, [])

  useEffect(() => {
    const root = toggleRef.current?.closest<HTMLElement>('.imm')
    if (root) root.dataset.menu = open ? 'open' : 'closed'
    if (!open) return

    holdScroll(true)
    sheetRef.current?.querySelector<HTMLElement>('.imm-menu__item')?.focus({ preventScroll: true })
    const header = toggleRef.current?.closest('header')

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        toggleRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !header) return
      // The sheet covers the page, so the keyboard stays within the bar and the sheet
      const stops = Array.from(header.querySelectorAll<HTMLElement>('a, button')).filter(
        (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
      )
      const first = stops[0]
      const last = stops[stops.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    const compact = window.matchMedia(COMPACT_QUERY)
    const onLayout = () => !compact.matches && close()

    document.addEventListener('keydown', onKey)
    compact.addEventListener('change', onLayout)
    return () => {
      document.removeEventListener('keydown', onKey)
      compact.removeEventListener('change', onLayout)
      holdScroll(false)
    }
  }, [open, close])

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="imm-menu-toggle"
        aria-expanded={open}
        aria-controls="imm-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="imm-menu-toggle__bar" />
        <span className="imm-menu-toggle__bar" />
      </button>
      <div
        ref={sheetRef}
        id="imm-menu"
        className="imm-menu"
        data-open={open}
        onClick={(event) => (event.target as Element).closest('a') && close()}
      >
        <nav className="imm-menu__nav" aria-label="Menu">
          {children(close)}
        </nav>
        <div className="imm-menu__foot">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <span>London, UK</span>
        </div>
      </div>
    </>
  )
}

/** Top bar for the pages outside the map, where the brand goes home instead of scrolling */
export function PageTopBar({ current }: { current: 'software' | 'gallery' }) {
  const here = (page: typeof current) => (page === current ? ('page' as const) : undefined)
  return (
    <header className="imm-topbar">
      <Link className="imm-topbar__brand" to="/">
        Chandan Bhagat
      </Link>
      <nav className="imm-topbar__nav">
        <Link to="/software" aria-current={here('software')}>
          Software
        </Link>
        <Link to="/portfolio" aria-current={here('gallery')}>
          Gallery
        </Link>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <Link className="imm-topbar__cta" to="/#contact">
          Contact
        </Link>
      </nav>
      <MenuSheet>
        {() => (
          <>
            <Link className="imm-menu__item" to="/">
              <MenuLabel index="01">Home</MenuLabel>
            </Link>
            <Link className="imm-menu__item" to="/software" aria-current={here('software')}>
              <MenuLabel index="02">Software</MenuLabel>
            </Link>
            <Link className="imm-menu__item" to="/portfolio" aria-current={here('gallery')}>
              <MenuLabel index="03">Gallery</MenuLabel>
            </Link>
            <a className="imm-menu__item" href={GITHUB_URL} target="_blank" rel="noreferrer">
              <MenuLabel index="04" external>
                GitHub
              </MenuLabel>
            </a>
            <Link className="imm-menu__item" to="/#contact">
              <MenuLabel index="05">Contact</MenuLabel>
            </Link>
          </>
        )}
      </MenuSheet>
    </header>
  )
}

/** A command with a copy button. If the browser refuses the clipboard, the text is selected for a manual copy instead. */
export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const textRef = useRef<HTMLElement>(null)
  const timerRef = useRef(0)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setCopied(false), COPIED_FOR_MS)
    } catch {
      if (textRef.current) window.getSelection()?.selectAllChildren(textRef.current)
    }
  }

  return (
    <div className="imm-install">
      <code ref={textRef}>{command}</code>
      <button type="button" onClick={copy} aria-label={`Copy command: ${command}`}>
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}

export function SoftwareCard({ item, className = '', style }: { item: Software; className?: string; style?: CSSProperties }) {
  return (
    <article className={`imm-soft${item.featured ? ' imm-soft--featured' : ''} ${className}`} style={style}>
      <div className="imm-soft__head">
        <span className="imm-mono">{item.platforms}</span>
        {item.proof && <span className="imm-mono imm-soft__proof">{item.proof}</span>}
      </div>
      <h3 className="imm-soft__name">
        {item.name}
        {item.version && <span className="imm-mono imm-soft__version">v{item.version}</span>}
      </h3>
      <p className="imm-soft__summary">{item.summary}</p>
      {item.install && <InstallCommand command={item.install} />}
      <ul className="imm-soft__links">
        {item.links.map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noreferrer" aria-label={`${link.label}: ${item.name}`}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}

/** What each registry reports, in one line of proof under the software itself */
export function RegistryStrip({ className = '' }: { className?: string }) {
  return (
    <ul className={`imm-registries ${className}`}>
      {registryStats.map((stat) => (
        <li key={stat.ecosystem}>
          <a href={stat.href} target="_blank" rel="noreferrer" title={stat.detail}>
            <strong>{stat.metric}</strong>
            <span className="imm-mono">{stat.ecosystem}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export function SiteFooter() {
  return (
    <footer className="imm-footer">
      <div className="imm-container imm-footer__inner">
        <span className="imm-mono">© {new Date().getFullYear()} Chandan Bhagat</span>
        <nav className="imm-footer__nav">
          <Link to="/dossier">Dossier</Link>
          <Link to="/terminal">Terminal</Link>
          <Link to="/classic">Classic</Link>
          <Link to="/software">Software</Link>
          <Link to="/portfolio">Gallery</Link>
          <Link to="/groupcode">Group Code</Link>
        </nav>
      </div>
    </footer>
  )
}
