import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import LondonTrigger from './LondonTrigger'
import { Eyebrow, NameLetters, RegistryStrip, SiteFooter, SoftwareCard, TraceRing } from './SiteParts'
import {
  aiPractices,
  capabilityGroups,
  caseStudies,
  certifications,
  profileLinks,
  proofPoints,
  talkHighlights,
} from '../../data/profile'
import { featuredSoftware, software } from '../../data/software'

// @group Overlay : DOM content layered over the WebGL scene, each section steers the camera to a different part of the system

const delay = (index: number, step = 0.08): CSSProperties => ({ '--d': `${index * step}s` } as CSSProperties)

export default function Overlay({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="imm-overlay">
      <section className="imm-section imm-section--hero" data-section="hero" id="imm-hero">
        <div className="imm-container">
          <p className="imm-hero__kicker imm-hero__kicker--split" style={delay(0)}>
            <span>AI architect · Software architect · Tech lead</span>
            <LondonTrigger />
          </p>
          <h1 className="imm-hero__title imm-hero__title--flies" aria-label="Chandan Bhagat">
            <span className="imm-hero__line">
              <NameLetters text="Chandan" />
            </span>
            <span className="imm-hero__line imm-hero__line--muted">
              <NameLetters text="Bhagat" from={7} />
            </span>
          </h1>
          <p className="imm-hero__sub" style={delay(3)}>
            Production AI: agents, retrieval and the guardrails around them. Ten years across .NET, Azure and Kubernetes.
          </p>
          <div className="imm-hero__actions" style={delay(4)}>
            <button type="button" className="imm-btn imm-btn--primary" onClick={() => onNavigate('experience')}>
              View work
            </button>
            <button type="button" className="imm-btn imm-btn--ghost" onClick={() => onNavigate('registry')}>
              Get the software
              <TraceRing />
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
              AI and software architect, tech lead, co-founder and trainer. After ten years building across .NET and Node.js and running workloads
              on Azure and Kubernetes, I design how large language models fit into products people actually use.
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

      <section className="imm-section imm-section--right" data-section="ai" id="imm-ai">
        <div className="imm-container">
          <div className="imm-content imm-content--wide">
            <Eyebrow index="02" label="AI architecture" />
            <h2 className="imm-h2 rv" style={delay(1)}>
              The model proposes, <em>the gateway disposes</em>.
            </h2>
            <p className="imm-lead rv" style={delay(2)}>
              I design the system around the model. Agents get clear limits, anything high stakes goes to a person, and every decision
              leaves a record you can replay.
            </p>
            <div className="imm-grid imm-grid--2">
              {aiPractices.map((practice, i) => (
                <div className="imm-card rv" style={delay(3 + i)} key={practice.title}>
                  <h3 className="imm-card__title">{practice.title}</h3>
                  <p>{practice.detail}</p>
                  <ul className="imm-card__links">
                    {practice.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noreferrer">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="imm-note imm-mono rv" style={delay(7)}>
              On the map: the reference design from my Bounded Autonomy series. Watch a tool call stop at the gateway.
            </p>
          </div>
        </div>
      </section>

      <section className="imm-section imm-section--right" data-section="experience" id="imm-experience">
        <div className="imm-container">
          <div className="imm-content imm-content--wide">
            <Eyebrow index="03" label="Experience" />
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
            <Eyebrow index="04" label="Capabilities" />
            <h2 className="imm-h2 rv" style={delay(1)}>
              Full-stack AI, <em>model to cluster</em>.
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
            <Eyebrow index="05" label="Software" />
            <h2 className="imm-h2 rv" style={delay(1)}>
              Software you can <em>install today</em>.
            </h2>
            <p className="imm-lead rv" style={delay(2)}>
              Desktop apps, servers, AI tools and extensions, each one a command or an installer away.
            </p>
            <div className="imm-grid imm-grid--2">
              {featuredSoftware.map((item, i) => (
                <SoftwareCard className="rv" style={delay(3 + i)} item={item} key={item.name} />
              ))}
            </div>
            <RegistryStrip className="rv" />
            <div className="rv" style={delay(3)}>
              <Link className="imm-btn imm-btn--primary" to="/software">
                All {software.length} tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="imm-section" data-section="talks" id="imm-talks">
        <div className="imm-container">
          <div className="imm-content imm-content--wide">
            <Eyebrow index="06" label="Talks" />
            <h2 className="imm-h2 rv" style={delay(1)}>
              On stage, <em>and in the room</em>.
            </h2>
            <p className="imm-lead rv" style={delay(2)}>
              Talks and workshops on Azure, Kubernetes, gRPC and ML.NET, from Reactor Meetup in London to Nepal Cloud Summit.
            </p>
            <ul className="imm-talks">
              {talkHighlights.map((talk, i) => (
                <li className="rv" style={delay(3 + i)} key={talk.program}>
                  <Link to="/portfolio">
                    <img src={talk.image} alt="" loading="lazy" decoding="async" />
                    <span className="imm-talks__program">{talk.program}</span>
                    <span className="imm-mono">{talk.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rv" style={delay(6)}>
              <Link className="imm-btn imm-btn--primary" to="/portfolio">
                Open the gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="imm-section imm-section--contact" data-section="contact" id="imm-contact">
        <div className="imm-container">
          <div className="imm-contact">
            <Eyebrow index="07" label="Contact" />
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
        <SiteFooter />
      </section>
    </div>
  )
}
