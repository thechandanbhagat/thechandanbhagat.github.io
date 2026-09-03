import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  capabilityGroups,
  caseStudies,
  certifications,
  profileLinks,
  proofPoints,
  publishedArtifacts,
  registryStats,
} from '../../data/profile'

// @group Overlay : DOM content layered over the WebGL scene, one section per particle shape

const delay = (index: number, step = 0.08): CSSProperties => ({ '--d': `${index * step}s` } as CSSProperties)

function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <p className="imm-eyebrow rv">
      <span className="imm-eyebrow__index">{index}</span>
      <span className="imm-eyebrow__line" />
      <span>{label}</span>
    </p>
  )
}

export default function Overlay({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="imm-overlay">
      <section className="imm-section imm-section--hero" data-section="hero" id="imm-hero">
        <div className="imm-container">
          <p className="imm-hero__kicker" style={delay(0)}>
            Software engineer · London, UK
          </p>
          <h1 className="imm-hero__title">
            <span className="imm-hero__line" style={delay(1)}>
              Chandan
            </span>
            <span className="imm-hero__line imm-hero__line--muted" style={delay(2)}>
              Bhagat
            </span>
          </h1>
          <p className="imm-hero__sub" style={delay(3)}>
            Cloud-native systems, AI products and developer tools. Ten years across .NET, Node.js, Azure and Kubernetes.
          </p>
          <div className="imm-hero__actions" style={delay(4)}>
            <button type="button" className="imm-btn imm-btn--primary" onClick={() => onNavigate('experience')}>
              View work
            </button>
            <button type="button" className="imm-btn imm-btn--ghost" onClick={() => onNavigate('contact')}>
              Get in touch
            </button>
          </div>
        </div>
      </section>

      <section className="imm-section" data-section="about" id="imm-about">
        <div className="imm-container">
          <div className="imm-content">
            <Eyebrow index="01" label="About" />
            <h2 className="imm-h2 rv" style={delay(1)}>
              I turn ambiguous problems into <em>systems that ship</em>.
            </h2>
            <p className="imm-lead rv" style={delay(2)}>
              Tech lead, co-founder and trainer. I have spent ten years building across the .NET and Node.js ecosystems, running
              workloads on Azure and Kubernetes, and lately wiring large language models into products people actually use.
            </p>
            <div className="imm-proof">
              {proofPoints.map((point, i) => (
                <div className="imm-proof__item rv" style={delay(3 + i)} key={point.label}>
                  <span className="imm-proof__value">{point.value}</span>
                  <span className="imm-proof__label">{point.label}</span>
                  <span className="imm-proof__detail">{point.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="imm-section imm-section--right" data-section="experience" id="imm-experience">
        <div className="imm-container">
          <div className="imm-content imm-content--wide">
            <Eyebrow index="02" label="Experience" />
            <h2 className="imm-h2 rv" style={delay(1)}>
              Recent chapters, <em>told by impact</em>.
            </h2>
            <ol className="imm-stack">
              {caseStudies.map((study, i) => (
                <li className="imm-card rv" style={delay(2 + i)} key={study.title}>
                  <div className="imm-card__head">
                    <h3>{study.title}</h3>
                    <span className="imm-mono">{study.period}</span>
                  </div>
                  <p>{study.context}</p>
                  <p className="imm-card__impact">{study.impact}</p>
                  <ul className="imm-chips">
                    {study.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="imm-section" data-section="capabilities" id="imm-capabilities">
        <div className="imm-container">
          <div className="imm-content imm-content--wide">
            <Eyebrow index="03" label="Capabilities" />
            <h2 className="imm-h2 rv" style={delay(1)}>
              Full stack, <em>cloud to cluster</em>.
            </h2>
            <div className="imm-grid imm-grid--2">
              {capabilityGroups.map((group, i) => (
                <div className="imm-card rv" style={delay(2 + i)} key={group.title}>
                  <h3 className="imm-card__title">{group.title}</h3>
                  <ul className="imm-chips imm-chips--lg">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="imm-certs rv" style={delay(6)}>
              <span className="imm-mono imm-certs__label">Credentials</span>
              <ul>
                {certifications.map((cert) => (
                  <li key={cert.title}>
                    <a href={cert.href} target="_blank" rel="noreferrer">
                      {cert.title}
                    </a>
                    <span className="imm-mono">
                      {cert.issuer} · {cert.meta}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="imm-section imm-section--right" data-section="registry" id="imm-registry">
        <div className="imm-container">
          <div className="imm-content imm-content--wide">
            <Eyebrow index="04" label="Published work" />
            <h2 className="imm-h2 rv" style={delay(1)}>
              Shipped to the registries <em>developers already use</em>.
            </h2>
            <div className="imm-grid imm-grid--3">
              {registryStats.map((stat, i) => (
                <a className="imm-card imm-card--link rv" style={delay(2 + i)} key={stat.ecosystem} href={stat.href} target="_blank" rel="noreferrer">
                  <span className="imm-mono">{stat.ecosystem}</span>
                  <strong className="imm-card__metric">{stat.metric}</strong>
                  <p>{stat.detail}</p>
                </a>
              ))}
            </div>
            <ul className="imm-artifacts">
              {publishedArtifacts.map((artifact, i) => (
                <li className="rv" style={delay(8 + i, 0.05)} key={artifact.name}>
                  <a href={artifact.href} target="_blank" rel="noreferrer">
                    <span className="imm-artifacts__name">{artifact.name}</span>
                    <span className="imm-artifacts__desc">{artifact.description}</span>
                    <span className="imm-mono imm-artifacts__meta">
                      {artifact.ecosystem} · {artifact.version}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="imm-section imm-section--contact" data-section="contact" id="imm-contact">
        <div className="imm-container">
          <div className="imm-contact">
            <Eyebrow index="05" label="Contact" />
            <h2 className="imm-h2 imm-h2--xl rv" style={delay(1)}>
              Let’s build something <em>worth shipping</em>.
            </h2>
            <a className="imm-contact__email rv" style={delay(2)} href="mailto:chandan.bhagat@outlook.com">
              chandan.bhagat@outlook.com
            </a>
            <ul className="imm-links rv" style={delay(3)}>
              {profileLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    <i className={link.icon} aria-hidden="true" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <footer className="imm-footer">
          <div className="imm-container imm-footer__inner">
            <span className="imm-mono">© {new Date().getFullYear()} Chandan Bhagat</span>
            <nav className="imm-footer__nav">
              <Link to="/dossier">Dossier</Link>
              <Link to="/terminal">Terminal</Link>
              <Link to="/classic">Classic</Link>
              <Link to="/portfolio">Gallery</Link>
              <Link to="/groupcode">Group Code</Link>
            </nav>
          </div>
        </footer>
      </section>
    </div>
  )
}
