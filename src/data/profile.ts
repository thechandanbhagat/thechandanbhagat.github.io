// @group Profile : Shared portfolio content used by the dossier and the immersive 3D landing page

// @group Types : Portfolio dossier data contracts
export interface ProofPoint {
  value: string
  label: string
  detail: string
}

export interface CaseStudy {
  title: string
  period: string
  context: string
  impact: string
  stack: string[]
}

export interface FieldNote {
  title: string
  meta: string
  image: string
  category: string
}

export interface CapabilityGroup {
  title: string
  items: string[]
}

export interface Credential {
  title: string
  issuer: string
  meta: string
  href?: string
}

export interface TimelineEntry {
  title: string
  meta: string
  detail: string
}

export interface ProfileLink {
  label: string
  href: string
  icon: string
}

export interface AiPractice {
  title: string
  detail: string
  links: { label: string; href: string }[]
}

// @group Content : Curated content for the redesigned portfolio
export const proofPoints: ProofPoint[] = [
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

/** How the AI work is designed, each area backed by something shipped or published */
export const aiPractices: AiPractice[] = [
  {
    title: 'Retrieval and language interfaces',
    detail: 'Azure OpenAI and RAG services at Turboline AI and Sesio AI, from Document Intelligence to natural-language queries across five databases.',
    links: [{ label: 'Turboline.NLQ2SQL on NuGet', href: 'https://www.nuget.org/packages/Turboline.NLQ2SQL.PostgresSQL' }],
  },
  {
    title: 'Agents and tools',
    detail: 'Dynamic agents configured through YAML on Azure OpenAI and Azure Functions at Sesio AI, and MCP servers published for other agents to use.',
    links: [{ label: 'cv-forge MCP server', href: 'https://www.npmjs.com/package/cv-forge' }],
  },
  {
    title: 'Guardrails',
    detail: 'One gateway for every tool call: policy as data, human approval, budgets, a kill switch and an append-only audit log.',
    links: [
      {
        label: 'Bounded Autonomy, 10 parts',
        href: 'https://chandanbhagat.com.np/bounded-autonomy-ai-agents-python-part-1-threat-model-gateway/',
      },
    ],
  },
  {
    title: 'Cost and reliability',
    detail: 'An LLM gateway with failover, token accounting and tenant quotas, and cost attribution for every agent run.',
    links: [
      { label: 'LLM gateway, 10 parts', href: 'https://chandanbhagat.com.np/llm-inference-gateway-from-scratch-part-1-the-layer-every-team-writes/' },
      { label: 'FinOps for agents', href: 'https://chandanbhagat.com.np/finops-ai-agents-nodejs-postgres-part-1-what-the-invoice-cannot-tell-you/' },
    ],
  },
]

export const caseStudies: CaseStudy[] = [
  {
    title: 'Tech Lead at Outernet London',
    period: 'April 2025 - Present',
    context: 'Building dynamic selection and media integration systems across Node.js, React, Linux, Postgres, Kafka, Redis, SSP, GAM, VAST, and Ventuz.',
    impact: 'Delivering application work and DevOps automation through GitHub Actions and Azure.',
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

export const fieldNotes: FieldNote[] = [
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

/** The newest talks, shown on the landing page as a way into the gallery */
export const talkHighlights = [
  { program: 'Reactor Meetup, London', date: 'May 2024', image: '/assets/img/portfolio/LondonReactorMeetup (1).JPG' },
  { program: 'Nepal Cloud Summit', date: 'April 2022', image: '/assets/img/portfolio/NCS2022.jpg' },
  { program: 'Global Azure Bootcamp', date: 'April 2021', image: '/assets/img/portfolio/GBAC2021.jpg' },
]

export const capabilityGroups: CapabilityGroup[] = [
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

export const certifications: Credential[] = [
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

export const teachingEntries: TimelineEntry[] = [
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

export const educationEntries: TimelineEntry[] = [
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

export const profileLinks: ProfileLink[] = [
  { label: 'NuGet', href: 'https://www.nuget.org/profiles/chandan.bhagat', icon: 'bi bi-box-seam' },
  { label: 'Open VSX', href: 'https://open-vsx.org/namespace/thechandanbhagat', icon: 'bi bi-puzzle' },
  { label: 'VS Marketplace', href: 'https://marketplace.visualstudio.com/publishers/thechandanbhagat', icon: 'bi bi-shop' },
  { label: 'npm', href: 'https://www.npmjs.com/~chandan.bhagat', icon: 'bi bi-box' },
  { label: 'Docker Hub', href: 'https://hub.docker.com/u/chandanbhagat', icon: 'bi bi-boxes' },
  { label: 'PowerShell', href: 'https://www.powershellgallery.com/profiles/thechandanbhagat', icon: 'bi bi-terminal' },
  { label: 'GitHub', href: 'https://github.com/thechandanbhagat', icon: 'bi bi-github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/guptac', icon: 'bi bi-linkedin' },
  { label: 'Utility tools', href: 'https://util.chandanbhagat.com.np', icon: 'bi bi-tools' },
  { label: 'Math tools', href: 'https://math-tools.chandanbhagat.com.np', icon: 'bi bi-calculator' },
]
