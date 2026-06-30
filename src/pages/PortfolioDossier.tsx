import { useEffect, useRef, type CSSProperties } from 'react'
import './PortfolioDossier.css'

// @group Motion : Stagger delay helper for scroll-reveal sequencing
const stagger = (index: number): CSSProperties =>
  ({ '--reveal-delay': `${index * 0.07}s` } as unknown as CSSProperties)

// @group Types : Portfolio dossier data contracts
interface ProofPoint {
  value: string
  label: string
  detail: string
}

interface CaseStudy {
  title: string
  period: string
  context: string
  impact: string
  stack: string[]
}

interface FieldNote {
  title: string
  meta: string
  image: string
  category: string
}

interface CapabilityGroup {
  title: string
  items: string[]
}

interface Credential {
  title: string
  issuer: string
  meta: string
  href?: string
}

interface TimelineEntry {
  title: string
  meta: string
  detail: string
}

interface ProfileLink {
  label: string
  href: string
  icon: string
}

interface RegistryStat {
  ecosystem: string
  metric: string
  detail: string
  href: string
}

interface PublishedArtifact {
  name: string
  ecosystem: string
  version: string
  description: string
  href: string
}

// @group Content : Curated content for the redesigned portfolio
const proofPoints: ProofPoint[] = [
  {
    value: '10+',
    label: 'years building',
    detail: 'Software, cloud, AI products, teams, and community',
  },
  {
    value: '20+',
    label: 'services automated',
    detail: 'GitHub Actions, Azure DevOps, Docker, Kubernetes, and CI/CD',
  },
  {
    value: '25+',
    label: 'talks and workshops',
    detail: 'Azure Functions, gRPC, Kubernetes, Power Automate, and ML.NET',
  },
  {
    value: '5',
    label: 'cloud ecosystems',
    detail: 'Azure, AWS, Google Cloud, IBM Cloud, and Salesforce integrations',
  },
]

const caseStudies: CaseStudy[] = [
  {
    title: 'Tech Lead at Outernet London',
    period: 'April 2025 - Present',
    context: 'Building dynamic selection and media integration systems across Node.js, React, Linux, Postgres, Kafka, Redis, SSP, GAM, VAST, and Ventuz.',
    impact: 'Solo developer delivering application work and DevOps automation through GitHub Actions and Azure.',
    stack: ['Node.js', 'React', 'Postgres', 'Kafka', 'Redis', 'Microservices', 'Azure'],
  },
  {
    title: 'Co-Founder / Lead Dev at Turboline AI',
    period: 'September 2023 - Present',
    context: 'Building Data Query Studio, a natural-language way to query MSSQL, MySQL, Postgres, MongoDB, and Cosmos DB.',
    impact: 'Developing Azure OpenAI/RAG services, geospatial workflows, APIs, Bicep infrastructure, Docker, Kubernetes, and deployment automation.',
    stack: ['Azure OpenAI', 'RAG', 'Python', 'TypeScript', 'ASP.NET Core', 'Postgres', 'Docker', 'Kubernetes'],
  },
  {
    title: 'Co-Founder / Software Engineer at Sesio AI',
    period: 'September 2024 - April 2025',
    context: 'Developed dynamic AI agents configured through YAML on Azure OpenAI and Azure Functions.',
    impact: 'Shipped RAG, Document Intelligence, Cosmos DB, Entra, Redis, TypeScript/Python services, and Azure infrastructure automation.',
    stack: ['Azure OpenAI', 'Document Intelligence', 'Cosmos DB', 'Azure Functions', 'Python', 'TypeScript', 'Bicep'],
  },
  {
    title: 'Software Engineer at AE Live',
    period: 'December 2022 - May 2024',
    context: 'Built broadcast graphics, APIs, and cloud-native services for live production workflows.',
    impact: 'Improved WPF rendering performance by 40% and supported ASP.NET Core APIs handling 100K+ requests per day.',
    stack: ['C#', 'WPF', 'ASP.NET Core', 'Angular', 'Azure', 'Kafka', 'Redis', 'Kubernetes'],
  },
]

const fieldNotes: FieldNote[] = [
  {
    title: 'Event-driven development with Service Bus and Functions',
    meta: 'Reactor Meetup, London',
    image: '/assets/img/portfolio/LondonReactorMeetup (1).JPG',
    category: 'Cloud architecture',
  },
  {
    title: 'Creating and managing gRPC apps in Azure',
    meta: 'Nepal Cloud Summit',
    image: '/assets/img/portfolio/NCS2022.jpg',
    category: 'Azure talks',
  },
  {
    title: 'Mentoring teams through product thinking',
    meta: 'Ideathon 2021',
    image: '/assets/img/portfolio/Ideathon2021.jpg',
    category: 'Community',
  },
]

const capabilityGroups: CapabilityGroup[] = [
  {
    title: 'Application development',
    items: ['C#', '.NET Core', 'ASP.NET Core', 'Node.js', 'Angular', 'React', 'Next.js', 'WPF'],
  },
  {
    title: 'Cloud, AI and data',
    items: ['Azure OpenAI', 'RAG', 'Document Intelligence', 'Cosmos DB', 'Postgres', 'Azure Functions', 'Service Bus', 'AWS'],
  },
  {
    title: 'DevOps and delivery',
    items: ['CI/CD', 'GitHub Actions', 'Azure DevOps', 'Docker', 'Kubernetes', 'Bicep', 'PowerShell', 'Infrastructure as Code'],
  },
  {
    title: 'Leadership and training',
    items: ['Mentoring', 'Team leadership', '.NET training', 'Cloud computing', 'OOP', 'Network programming'],
  },
]

const certifications: Credential[] = [
  {
    title: 'Azure AI Fundamentals',
    issuer: 'Microsoft',
    meta: 'March 2024',
    href: 'https://learn.microsoft.com/en-us/users/chandanbhagat/credentials/c6cae068c19caa1a',
  },
  {
    title: 'Principles of Secure Coding',
    issuer: 'Udemy',
    meta: 'March 2024',
    href: 'https://www.udemy.com/certificate/UC-e5cf7457-e545-4703-8b03-ae02ea5da66c/',
  },
  {
    title: 'Develop an ASP.NET Core web app that consumes an API',
    issuer: 'Microsoft',
    meta: 'January 2024',
    href: 'https://learn.microsoft.com/en-us/users/chandanbhagat/credentials/9695ccb3071bf5a2',
  },
  {
    title: 'DevOps Foundations: Microservices',
    issuer: 'LinkedIn Learning',
    meta: 'July 2020',
    href: 'https://www.linkedin.com/learning/certificates/2c3d20fc58a3ff718af08736592a56e9b10e350fb5ae3612ffac03d5f0843e45',
  },
  {
    title: 'MTA: Networking Fundamentals',
    issuer: 'Microsoft',
    meta: 'November 2016',
    href: 'https://www.credly.com/badges/3dba0ee7-1549-4394-bf8b-f281ea6c215a/',
  },
]

const teachingEntries: TimelineEntry[] = [
  {
    title: '.NET Trainer',
    meta: 'Broadway Infosys, Kathmandu | February 2020 - October 2022',
    detail: '.NET Core, OOP in C#, MSSQL, Windows Forms, ASP.NET Core MVC, Entity Framework, Web API, Angular, IIS, and Azure deployment.',
  },
  {
    title: 'Part-time lecturer',
    meta: 'Orchid College, Aadim College, Academia | 2018 - 2022',
    detail: 'Network Programming, Computer Networks, Distributed Systems, Numerical Methods, Web Technology, and Cloud Computing.',
  },
  {
    title: '.NET Trainer',
    meta: 'IT Training Nepal | January 2016 - June 2018',
    detail: 'Practical, hands-on .NET development training for real-world web and database projects.',
  },
]

const educationEntries: TimelineEntry[] = [
  {
    title: 'Bachelor in Computer Engineering',
    meta: 'Institute of Engineering, Pulchowk Campus | January 2011 - July 2015',
    detail: 'Engineering foundation across software, systems, networks, and applied computing.',
  },
  {
    title: 'High School',
    meta: 'Bhanu Memorial Higher Secondary School | August 2008 - August 2010',
    detail: 'Science and mathematics foundation before engineering studies.',
  },
]

const profileLinks: ProfileLink[] = [
  { label: 'NuGet', href: 'https://www.nuget.org/profiles/chandan.bhagat', icon: 'bi bi-box-seam' },
  { label: 'Open VSX', href: 'https://open-vsx.org/namespace/thechandanbhagat', icon: 'bi bi-puzzle' },
  { label: 'VS Marketplace', href: 'https://marketplace.visualstudio.com/publishers/thechandanbhagat', icon: 'bi bi-shop' },
  { label: 'npm', href: 'https://www.npmjs.com/~chandan.bhagat', icon: 'bi bi-box' },
  { label: 'Docker Hub', href: 'https://hub.docker.com/repository/docker/chandanbhagat/ezkafka-visualizer/general', icon: 'bi bi-boxes' },
  { label: 'PowerShell', href: 'https://www.powershellgallery.com/profiles/thechandanbhagat', icon: 'bi bi-terminal' },
  { label: 'GitHub', href: 'https://github.com/thechandanbhagat', icon: 'bi bi-github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/guptac', icon: 'bi bi-linkedin' },
  { label: 'Utility tools', href: 'https://util.chandanbhagat.com.np', icon: 'bi bi-tools' },
  { label: 'Math tools', href: 'https://math-tools.chandanbhagat.com.np', icon: 'bi bi-calculator' },
]

const registryStats: RegistryStat[] = [
  {
    ecosystem: 'NuGet',
    metric: '12 packages',
    detail: '83K+ downloads across dotnet-essential and Turboline NLQ packages.',
    href: 'https://www.nuget.org/profiles/chandan.bhagat',
  },
  {
    ecosystem: 'npm',
    metric: '10 packages',
    detail: 'CLI tools, MCP servers, SDKs, Kafka tooling, and AI-focused packages.',
    href: 'https://www.npmjs.com/~chandan.bhagat',
  },
  {
    ecosystem: 'VS Code Marketplace',
    metric: '5 extensions',
    detail: 'Group Code, PR Hub, Repo Rig, Overture, and Khukuri Language Support.',
    href: 'https://marketplace.visualstudio.com/publishers/thechandanbhagat',
  },
  {
    ecosystem: 'Open VSX',
    metric: '3K+ downloads',
    detail: 'Group Code and PR Hub published for Open VSX-compatible editors.',
    href: 'https://open-vsx.org/namespace/thechandanbhagat',
  },
  {
    ecosystem: 'Docker Hub',
    metric: '20K+ pulls',
    detail: 'ezkafka-visualizer image for managing and visualizing Kafka clusters.',
    href: 'https://hub.docker.com/repository/docker/chandanbhagat/ezkafka-visualizer/general',
  },
  {
    ecosystem: 'PowerShell Gallery',
    metric: '2 modules',
    detail: '15K+ downloads across UtilModule and SesioWorker modules.',
    href: 'https://www.powershellgallery.com/profiles/thechandanbhagat',
  },
]

const publishedArtifacts: PublishedArtifact[] = [
  {
    name: 'dotnet-essential',
    ecosystem: 'NuGet',
    version: '7.1.0',
    description: 'Essential package for .NET projects.',
    href: 'https://www.nuget.org/packages/dotnet-essential',
  },
  {
    name: 'Turboline.NLQ2SQL.PostgresSQL',
    ecosystem: 'NuGet',
    version: '6.2.9',
    description: 'Natural-language query connector for Turboline AI applications.',
    href: 'https://www.nuget.org/packages/Turboline.NLQ2SQL.PostgresSQL',
  },
  {
    name: 'ezpm2gui',
    ecosystem: 'npm',
    version: '1.11.1',
    description: 'Modern web-based GUI for the PM2 process manager.',
    href: 'https://www.npmjs.com/package/ezpm2gui',
  },
  {
    name: 'cv-forge',
    ecosystem: 'npm',
    version: '1.0.3',
    description: 'MCP server for generating ATS-friendly CVs tailored to job descriptions.',
    href: 'https://www.npmjs.com/package/cv-forge',
  },
  {
    name: 'ezkafka-visualizer',
    ecosystem: 'Docker Hub',
    version: '20K+ pulls',
    description: 'Web app and container image for managing Kafka clusters.',
    href: 'https://hub.docker.com/repository/docker/chandanbhagat/ezkafka-visualizer/general',
  },
  {
    name: 'Group Code',
    ecosystem: 'VS Code / Open VSX',
    version: '1.8.0',
    description: 'Navigate and organize codebases by functionality across file types.',
    href: 'https://marketplace.visualstudio.com/items?itemName=thechandanbhagat.groupcode',
  },
  {
    name: 'PR Hub',
    ecosystem: 'VS Code / Open VSX',
    version: '1.1.0',
    description: 'AI-powered pull request reviews across GitHub, Azure DevOps, GitLab, and Bitbucket.',
    href: 'https://marketplace.visualstudio.com/items?itemName=thechandanbhagat.pr-hub',
  },
  {
    name: 'UtilModule',
    ecosystem: 'PowerShell Gallery',
    version: '2.0.1',
    description: 'PowerShell utility module with many functions.',
    href: 'https://www.powershellgallery.com/packages/UtilModule/2.0.1',
  },
]

const bootLines = [
  'mount /dev/azure /systems',
  'load .NET + Node.js runtimes',
  'wire Azure OpenAI agents',
  'start kubernetes.service',
  'ship useful software',
]

// @group PortfolioDossier : New root portfolio page
export default function PortfolioDossier() {
  const progressRef = useRef<HTMLDivElement>(null)

  // @group Motion : Scroll-reveal, stat count-up, and read-progress wiring
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const countEls = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'))

    if (reducedMotion) {
      revealEls.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    revealEls.forEach((el) => revealObserver.observe(el))

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          countObserver.unobserve(el)
          const raw = el.dataset.count ?? ''
          const target = parseInt(raw, 10)
          const suffix = raw.replace(/[0-9]/g, '')
          if (Number.isNaN(target)) return
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            el.textContent = `${Math.round(eased * target)}${suffix}`
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.6 }
    )
    countEls.forEach((el) => {
      const raw = el.dataset.count ?? ''
      el.textContent = `0${raw.replace(/[0-9]/g, '')}`
      countObserver.observe(el)
    })

    return () => {
      revealObserver.disconnect()
      countObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const bar = progressRef.current
      if (!bar) return
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0
      bar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <main className="dossier-shell">
      <div className="dossier-progress" ref={progressRef} aria-hidden="true" />
      <section className="dossier-hero" aria-labelledby="dossier-title">
        <nav className="dossier-nav" aria-label="Portfolio navigation">
          <a className="dossier-brand" href="/">
            <span className="dossier-brand-mark">CB</span>
            <span>Chandan Gupta Bhagat</span>
          </a>
          <div className="dossier-nav-links">
            <a href="#work">Work</a>
            <a href="#tools">Tools</a>
            <a href="#speaking">Speaking</a>
            <a href="#contact">Contact</a>
            <a href="/terminal">Terminal</a>
          </div>
        </nav>

        <div className="dossier-hero-content">
          <p className="dossier-kicker">London / Kent software engineer, cloud architect, trainer</p>
          <h1 id="dossier-title">Chandan Gupta Bhagat</h1>
          <p className="dossier-manifesto">Cloud systems, AI products, calm delivery.</p>
          <p className="dossier-hero-copy">
            Senior engineer across C#, Azure, Node.js, React, and AI systems, with hands-on
            experience in web, desktop, cloud, data, DevOps, training, and mentorship.
          </p>
          <div className="dossier-actions" aria-label="Primary actions">
            <a href="mailto:chandan.bhagat@outlook.com" className="dossier-action primary">
              <i className="bi bi-envelope" aria-hidden="true"></i>
              Start a conversation
            </a>
            <a href="https://linkedin.com/in/guptac" target="_blank" rel="noreferrer" className="dossier-action">
              <i className="bi bi-linkedin" aria-hidden="true"></i>
              LinkedIn
            </a>
            <a href="https://github.com/thechandanbhagat" target="_blank" rel="noreferrer" className="dossier-action icon-only" aria-label="GitHub">
              <i className="bi bi-github" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div className="dossier-console" aria-label="Portfolio boot sequence">
          <div className="dossier-console-top">
            <span></span>
            <span></span>
            <span></span>
            <strong>portfolio.deploy</strong>
          </div>
          <div className="dossier-console-body">
            {bootLines.map((line) => (
              <p key={line}>
                <span>$</span> {line}
              </p>
            ))}
            <p className="dossier-console-ready">
              <span>ok</span> available for senior engineering, cloud architecture, AI product work, and technical leadership
            </p>
          </div>
        </div>
      </section>

      <section className="dossier-proof" aria-label="Proof points">
        {proofPoints.map((point, index) => (
          <article className="dossier-proof-item reveal" style={stagger(index)} key={point.label}>
            <strong data-count={point.value}>{point.value}</strong>
            <span>{point.label}</span>
            <p>{point.detail}</p>
          </article>
        ))}
      </section>

      <section id="work" className="dossier-section dossier-split">
        <div className="dossier-section-heading reveal">
          <p>Delivery record</p>
          <h2>Current product work.</h2>
        </div>
        <div className="dossier-case-list">
          {caseStudies.map((study, index) => (
            <article className="dossier-case reveal" style={stagger(index)} key={study.title}>
              <div>
                <span className="dossier-case-period">{study.period}</span>
                <h3>{study.title}</h3>
                <p>{study.context}</p>
              </div>
              <strong>{study.impact}</strong>
              <div className="dossier-tags">
                {study.stack.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="speaking" className="dossier-section">
        <div className="dossier-section-heading compact reveal">
          <p>Field notes</p>
          <h2>Talks, workshops, and community work.</h2>
        </div>
        <div className="dossier-field-grid">
          {fieldNotes.map((note, index) => (
            <article className="dossier-field-note reveal" style={stagger(index)} key={note.title}>
              <img src={note.image} alt={note.title} />
              <div>
                <span>{note.category}</span>
                <h3>{note.title}</h3>
                <p>{note.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dossier-section dossier-capabilities">
        <div className="dossier-section-heading compact reveal">
          <p>Operating range</p>
          <h2>The toolkit I reach for most often.</h2>
        </div>
        <div className="dossier-capability-grid">
          {capabilityGroups.map((group, index) => (
            <article className="dossier-capability reveal" style={stagger(index)} key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="tools" className="dossier-section dossier-tools">
        <div className="dossier-section-heading compact reveal">
          <p>Published tools</p>
          <h2>Packages, extensions, modules, and containers.</h2>
        </div>
        <div className="dossier-registry-grid">
          {registryStats.map((stat, index) => (
            <a href={stat.href} target="_blank" rel="noreferrer" className="dossier-registry-card reveal" style={stagger(index)} key={stat.ecosystem}>
              <span>{stat.ecosystem}</span>
              <strong>{stat.metric}</strong>
              <p>{stat.detail}</p>
            </a>
          ))}
        </div>
        <div className="dossier-artifact-grid">
          {publishedArtifacts.map((artifact, index) => (
            <a href={artifact.href} target="_blank" rel="noreferrer" className="dossier-artifact reveal" style={stagger(index)} key={`${artifact.ecosystem}-${artifact.name}`}>
              <span>{artifact.ecosystem} | {artifact.version}</span>
              <strong>{artifact.name}</strong>
              <p>{artifact.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="dossier-section dossier-credentials">
        <div className="dossier-section-heading compact reveal">
          <p>Credentials and teaching</p>
          <h2>Built in public, taught in classrooms, certified in practice.</h2>
        </div>
        <div className="dossier-credential-layout">
          <article className="dossier-credential-panel reveal" style={stagger(0)}>
            <h3>Selected certifications</h3>
            <div className="dossier-credential-list">
              {certifications.map((credential) => {
                const content = (
                  <>
                    <strong>{credential.title}</strong>
                    <span>{credential.issuer} | {credential.meta}</span>
                  </>
                )

                return credential.href ? (
                  <a href={credential.href} target="_blank" rel="noreferrer" key={credential.title}>
                    {content}
                  </a>
                ) : (
                  <div key={credential.title}>{content}</div>
                )
              })}
            </div>
          </article>

          <article className="dossier-credential-panel reveal" style={stagger(1)}>
            <h3>Training and mentoring</h3>
            <div className="dossier-timeline">
              {teachingEntries.map((entry) => (
                <div key={entry.title + entry.meta}>
                  <strong>{entry.title}</strong>
                  <span>{entry.meta}</span>
                  <p>{entry.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="dossier-credential-panel reveal" style={stagger(2)}>
            <h3>Education</h3>
            <div className="dossier-timeline">
              {educationEntries.map((entry) => (
                <div key={entry.title}>
                  <strong>{entry.title}</strong>
                  <span>{entry.meta}</span>
                  <p>{entry.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="contact" className="dossier-contact">
        <div className="reveal">
          <p>Current signal</p>
          <h2>Available for senior engineering, AI product, and cloud architecture roles.</h2>
        </div>
        <div className="dossier-contact-actions reveal" style={stagger(1)}>
          <a href="mailto:chandan.bhagat@outlook.com">
            <i className="bi bi-envelope" aria-hidden="true"></i>
            chandan.bhagat@outlook.com
          </a>
          <a href="tel:+447818620731">
            <i className="bi bi-telephone" aria-hidden="true"></i>
            +44 7818 620731
          </a>
        </div>
        <div className="dossier-profile-grid" aria-label="Public profiles and tools">
          {profileLinks.map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
              <i className={link.icon} aria-hidden="true"></i>
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
