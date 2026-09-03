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

export interface RegistryStat {
  ecosystem: string
  metric: string
  detail: string
  href: string
}

export interface PublishedArtifact {
  name: string
  ecosystem: string
  version: string
  description: string
  href: string
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

export const caseStudies: CaseStudy[] = [
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
  { label: 'Docker Hub', href: 'https://hub.docker.com/repository/docker/chandanbhagat/ezkafka-visualizer/general', icon: 'bi bi-boxes' },
  { label: 'PowerShell', href: 'https://www.powershellgallery.com/profiles/thechandanbhagat', icon: 'bi bi-terminal' },
  { label: 'GitHub', href: 'https://github.com/thechandanbhagat', icon: 'bi bi-github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/guptac', icon: 'bi bi-linkedin' },
  { label: 'Utility tools', href: 'https://util.chandanbhagat.com.np', icon: 'bi bi-tools' },
  { label: 'Math tools', href: 'https://math-tools.chandanbhagat.com.np', icon: 'bi bi-calculator' },
]

export const registryStats: RegistryStat[] = [
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

export const publishedArtifacts: PublishedArtifact[] = [
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
