import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eyebrow, NameLetters, PageTopBar, RegistryStrip, SiteFooter, SoftwareCard } from '../Immersive/SiteParts'
import { useReveal, useSitePage } from '../Immersive/pageMotion'
import { SOFTWARE_CHECKED, registryStats, software, softwareKinds, type SoftwareKind } from '../../data/software'
import '../Immersive/Immersive.css'
import './Software.css'

// @group Software : Everything that can be installed or opened, one group per kind, with the command or download for each

const ALL = 'all'

const number = (index: number) => String(index + 1).padStart(2, '0')

export default function Software() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<SoftwareKind | typeof ALL>(ALL)

  const groups = useMemo(
    () =>
      softwareKinds.map((kind, index) => ({
        ...kind,
        index,
        items: software.filter((item) => item.kind === kind.id).sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)),
      })),
    []
  )
  const shown = groups.filter((group) => filter === ALL || group.id === filter)

  const { ready } = useSitePage(rootRef)
  useReveal(rootRef, filter)

  return (
    <div ref={rootRef} className={`imm sw${ready ? ' is-ready' : ''}`}>
      <PageTopBar current="software" />

      <main>
        <div className="imm-page-hero">
          <div className="imm-container">
            <p className="imm-hero__kicker">
              {software.length} tools · {registryStats.length} registries
            </p>
            <h1 className="imm-hero__title" aria-label="Software">
              <span className="imm-hero__line">
                <NameLetters text="Software" />
              </span>
            </h1>
            <p className="imm-hero__sub">Desktop apps, servers, AI tools, extensions and libraries, with the command or download for each.</p>
            <div className="imm-hero__actions">
              <Link className="imm-btn imm-btn--ghost" to="/#registry">
                Back to the map
              </Link>
            </div>
          </div>
        </div>

        <div className="imm-container">
          <div className="imm-filter rv" role="group" aria-label="Filter software by kind">
            <button type="button" aria-pressed={filter === ALL} onClick={() => setFilter(ALL)}>
              All
            </button>
            {groups.map((group) => (
              <button type="button" key={group.id} aria-pressed={filter === group.id} onClick={() => setFilter(group.id)}>
                {group.label}
              </button>
            ))}
          </div>

          {shown.map((group) => (
            <section className="sw-group" key={group.id}>
              <Eyebrow index={number(group.index)} label={group.label} />
              <h2 className="sw-group__statement rv">{group.statement}</h2>
              <div className="sw-grid">
                {group.items.map((item) => (
                  <SoftwareCard className="rv" item={item} key={item.name} />
                ))}
              </div>
            </section>
          ))}

          <section className="sw-group">
            <Eyebrow index={number(groups.length)} label="Registries" />
            <h2 className="sw-group__statement rv">What the registries report.</h2>
            <RegistryStrip className="rv" />
            <p className="sw-note rv">Versions, counts and install commands checked against each registry on {SOFTWARE_CHECKED}.</p>
          </section>
        </div>

        <div className="imm-page-end rv">
          <Link className="imm-btn imm-btn--primary" to="/#registry">
            Back to the map
          </Link>
          <a className="imm-btn imm-btn--ghost" href="https://github.com/thechandanbhagat" target="_blank" rel="noreferrer">
            GitHub profile
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
