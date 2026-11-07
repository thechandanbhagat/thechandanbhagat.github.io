import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Eyebrow, NameLetters, PageTopBar, SiteFooter } from '../Immersive/SiteParts'
import { useReveal, useSitePage } from '../Immersive/pageMotion'
import '../Immersive/Immersive.css'
import './Gallery.css'

// @group Gallery : Talks as a timeline a traced message runs down, a photo viewer, and the index of links

interface Resource {
  type: string
  url: string
  title: string
}

interface Talk {
  program: string
  date: string
  title: string
  category: string
  description: string
  resources: Resource[]
  images: string[]
}

interface LinkGroup {
  category: string
  items: { title: string; url: string; description?: string; platform?: string }[]
}

/** How far down the screen the trace sits as the visitor scrolls */
const TRACE_LINE = 0.62

const ALL = 'all'

/** Undated entries still name their year in the event title */
function yearOf(talk: Talk) {
  const year = new Date(talk.date).getFullYear()
  return Number.isNaN(year) ? Number(talk.program.match(/\b20\d{2}\b/)?.[0] ?? 0) : year
}

function timeOf(talk: Talk) {
  const time = new Date(talk.date).getTime()
  return Number.isNaN(time) ? new Date(yearOf(talk), 0).getTime() : time
}

function groupByYear(talks: Talk[]) {
  const years = new Map<number, Talk[]>()
  talks.forEach((talk) => {
    const year = yearOf(talk)
    years.set(year, [...(years.get(year) ?? []), talk])
  })
  return [...years.entries()]
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

function TalkCard({ talk, onOpen }: { talk: Talk; onOpen: () => void }) {
  return (
    <li className="gal-card rv">
      <button type="button" className="gal-card__open" onClick={onOpen}>
        <span className="gal-card__frame">
          <img src={`/${talk.images[0]}`} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="gal-card__text">
          <span className="imm-mono">{talk.date || yearOf(talk)}</span>
          <span className="gal-card__program">{talk.program}</span>
          <span className="gal-card__title">{talk.title}</span>
          <span className="imm-mono gal-card__count">{plural(talk.images.length, 'photo')}</span>
        </span>
      </button>
    </li>
  )
}

function Viewer({ talk, onClose }: { talk: Talk; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)
  const count = talk.images.length

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const step = (by: number) => setIndex((current) => (current + by + count) % count)

  return (
    <dialog
      ref={dialogRef}
      className="gal-viewer"
      aria-label={talk.program}
      data-lenis-prevent
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close()
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') step(-1)
        if (event.key === 'ArrowRight') step(1)
      }}
    >
      <div className="gal-viewer__body">
        <div className="gal-viewer__stage">
          <img key={talk.images[index]} src={`/${talk.images[index]}`} alt={`${talk.program}, photo ${index + 1} of ${count}`} />
          {count > 1 && (
            <div className="gal-viewer__controls">
              <button type="button" aria-label="Previous photo" onClick={() => step(-1)}>
                ←
              </button>
              <span className="imm-mono">
                {index + 1} / {count}
              </span>
              <button type="button" aria-label="Next photo" onClick={() => step(1)}>
                →
              </button>
            </div>
          )}
        </div>
        <div className="gal-viewer__text">
          <span className="imm-mono">{talk.date || yearOf(talk)}</span>
          <h2>{talk.program}</h2>
          <p className="gal-viewer__title">{talk.title}</p>
          {talk.description && <p className="gal-viewer__description">{talk.description}</p>}
          {talk.resources.length > 0 && (
            <ul className="gal-viewer__resources">
              {talk.resources.map((resource) => (
                <li key={resource.title}>
                  <a href={resource.url} target="_blank" rel="noreferrer">
                    {resource.title}
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <button type="button" className="gal-viewer__close" aria-label="Close" onClick={() => dialogRef.current?.close()}>
        ×
      </button>
    </dialog>
  )
}

export default function Gallery() {
  const rootRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [talks, setTalks] = useState<Talk[]>([])
  const [linkGroups, setLinkGroups] = useState<LinkGroup[]>([])
  const [filter, setFilter] = useState(ALL)
  const [linkIndex, setLinkIndex] = useState(0)
  const [open, setOpen] = useState<Talk | null>(null)

  const categories = useMemo(() => [...new Set(talks.map((talk) => talk.category.toLowerCase()))], [talks])
  const shown = useMemo(() => talks.filter((talk) => filter === ALL || talk.category.toLowerCase() === filter), [talks, filter])
  const years = useMemo(() => groupByYear(shown), [shown])
  const photos = talks.reduce((total, talk) => total + talk.images.length, 0)
  const linkGroup = linkGroups[linkIndex]

  const traceTimeline = useCallback(() => {
    const timeline = timelineRef.current
    if (!timeline) return
    const { top, height } = timeline.getBoundingClientRect()
    const reached = (window.innerHeight * TRACE_LINE - top) / Math.max(height, 1)
    timeline.style.setProperty('--trace', Math.min(Math.max(reached, 0), 1).toFixed(4))
  }, [])

  const { ready, scrollRef } = useSitePage(rootRef, traceTimeline)
  useReveal(rootRef, `${filter}:${talks.length}:${linkGroups.length}:${linkIndex}`)

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then((response) => response.json())
      .then((data: { portfolioItems: Talk[] }) => setTalks([...data.portfolioItems].sort((a, b) => timeOf(b) - timeOf(a))))
      .catch((error) => console.error('Could not load the talks', error))
    fetch('/data/important-links.json')
      .then((response) => response.json())
      .then((data: { links: LinkGroup[] }) => setLinkGroups(data.links))
      .catch((error) => console.error('Could not load the links', error))
  }, [])

  const openTalk = (talk: Talk) => {
    scrollRef.current?.lenis.stop()
    setOpen(talk)
  }

  const closeTalk = () => {
    scrollRef.current?.lenis.start()
    setOpen(null)
  }

  return (
    <div ref={rootRef} className={`imm gal${ready ? ' is-ready' : ''}`}>
      <PageTopBar current="gallery" />

      <main>
        <div className="imm-page-hero">
          <div className="imm-container">
            <p className="imm-hero__kicker">
              {talks.length > 0 ? `${plural(talks.length, 'event')} · ${plural(photos, 'photo')}` : 'Talks and workshops'}
            </p>
            <h1 className="imm-hero__title" aria-label="Gallery">
              <span className="imm-hero__line">
                <NameLetters text="Gallery" />
              </span>
            </h1>
            <p className="imm-hero__sub">Talks, workshops and community work, with links to writing, training materials and demo code.</p>
            <div className="imm-hero__actions">
              <Link className="imm-btn imm-btn--ghost" to="/#talks">
                Back to the map
              </Link>
            </div>
          </div>
        </div>

        <div className="imm-container gal-talks">
          <Eyebrow index="01" label="Talks" />
          <div className="imm-filter rv" role="group" aria-label="Filter talks by topic">
            {[ALL, ...categories].map((category) => (
              <button type="button" key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>
                {category}
              </button>
            ))}
          </div>

          <div className="gal-timeline" ref={timelineRef}>
            <span className="gal-rail" aria-hidden="true">
              <span className="gal-rail__lit" />
              <span className="gal-rail__head" />
            </span>
            {years.map(([year, yearTalks]) => (
              <div className="gal-year" key={year}>
                <h2 className="gal-year__label rv">{year}</h2>
                <ul className="gal-grid">
                  {yearTalks.map((talk) => (
                    <TalkCard talk={talk} key={`${talk.program}${talk.title}`} onOpen={() => openTalk(talk)} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="imm-container gal-links">
          <Eyebrow index="02" label="Links" />
          <h2 className="imm-h2 rv">
            Writing, training <em>and demo code</em>.
          </h2>
          <div className="imm-filter rv" role="group" aria-label="Choose a kind of link">
            {linkGroups.map((group, i) => (
              <button type="button" key={group.category} aria-pressed={i === linkIndex} onClick={() => setLinkIndex(i)}>
                {group.category}
              </button>
            ))}
          </div>
          {linkGroup && (
            <ul className="gal-links__grid rv" key={linkGroup.category}>
              {linkGroup.items.map((item, i) => (
                <li key={item.url} style={{ '--i': i } as CSSProperties}>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.platform && <span className="imm-mono">{item.platform}</span>}
                    <span className="gal-link__name">{item.title}</span>
                    {item.description && <span className="gal-link__description">{item.description}</span>}
                    <span className="gal-link__arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="imm-page-end rv">
          <Link className="imm-btn imm-btn--primary" to="/software">
            See the software
          </Link>
          <Link className="imm-btn imm-btn--ghost" to="/#talks">
            Back to the map
          </Link>
        </div>
      </main>

      <SiteFooter />
      {open && <Viewer talk={open} onClose={closeTalk} />}
    </div>
  )
}
