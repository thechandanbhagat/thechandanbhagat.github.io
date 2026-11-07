import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { registryStats, type Software } from '../../data/software'

// @group SiteParts : Pieces the landing page, the gallery and the software page share, so they read as one site

const COPIED_FOR_MS = 1800

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
        <Link className="imm-topbar__secondary" to="/portfolio" aria-current={here('gallery')}>
          Gallery
        </Link>
        <a className="imm-topbar__optional" href="https://github.com/thechandanbhagat" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <Link className="imm-topbar__cta" to="/#contact">
          Contact
        </Link>
      </nav>
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
