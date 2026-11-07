// @group Software : The one list of what visitors can install or open. The landing page, the software page and the dossier all read it.

/** When the versions, counts and install commands below were last compared with the registries */
export const SOFTWARE_CHECKED = '7 November 2026'

const GITHUB = 'https://github.com/thechandanbhagat'
const NPM = 'https://www.npmjs.com/package'
const MARKETPLACE = 'https://marketplace.visualstudio.com/items?itemName=thechandanbhagat'
const OPEN_VSX = 'https://open-vsx.org/extension/thechandanbhagat'

export type SoftwareKind = 'desktop' | 'server' | 'ai' | 'extension' | 'library' | 'web' | 'source'

export interface SoftwareLink {
  label: string
  href: string
}

export interface Software {
  name: string
  kind: SoftwareKind
  summary: string
  platforms: string
  version?: string
  /** Works as written against the published package, not just the repository */
  install?: string
  /** The first link is the main way to get it */
  links: SoftwareLink[]
  /** One number a registry reports, left out where the count is too small to mean anything */
  proof?: string
  /** Shown on the landing page and first in its group */
  featured?: boolean
}

export interface RegistryStat {
  ecosystem: string
  metric: string
  detail: string
  href: string
}

export const softwareKinds: { id: SoftwareKind; label: string; statement: string }[] = [
  { id: 'desktop', label: 'Desktop apps', statement: 'Installers for Windows, Linux and macOS.' },
  { id: 'server', label: 'Servers and CLIs', statement: 'One command from npm, PM2 or Docker.' },
  { id: 'ai', label: 'AI and MCP', statement: 'Tools for Claude Code and other MCP clients.' },
  { id: 'extension', label: 'Extensions', statement: 'For VS Code, Open VSX editors and Chrome.' },
  { id: 'library', label: 'Libraries', statement: 'Packages for .NET, Node.js and PowerShell.' },
  { id: 'web', label: 'In the browser', statement: 'Nothing to install.' },
  { id: 'source', label: 'From source', statement: 'No packaged release yet, so clone and build.' },
]

export const software: Software[] = [
  {
    name: 'Alter',
    kind: 'desktop',
    summary: 'Run and manage any app, from Python and Node.js to Go, Rust and .NET, from one binary with a built-in web dashboard.',
    platforms: 'Windows · Linux',
    version: '1.4.0',
    install: 'winget install thechandanbhagat.alter',
    links: [
      { label: 'Download', href: `${GITHUB}/alter-pm/releases/latest` },
      { label: 'User guide', href: 'https://alter-pm.chandanbhagat.com.np' },
      { label: 'Source', href: `${GITHUB}/alter-pm` },
    ],
    proof: '3.2K downloads',
    featured: true,
  },
  {
    name: 'SleekSSH',
    kind: 'desktop',
    summary: 'A desktop workspace for SSH sessions, local terminals, SFTP and command-by-command Claude Code or Codex automation.',
    platforms: 'Windows',
    version: '0.4.0',
    links: [
      { label: 'Download', href: `${GITHUB}/sleek-ssh/releases/latest` },
      { label: 'Source', href: `${GITHUB}/sleek-ssh` },
    ],
    featured: true,
  },
  {
    name: 'KeyNest',
    kind: 'desktop',
    summary: 'A keyboard-first secret manager. Stores encrypted entries and types them into any window from a global shortcut.',
    platforms: 'Windows · macOS · Linux',
    version: '0.3.0',
    links: [
      { label: 'Download', href: `${GITHUB}/key-nest/releases/latest` },
      { label: 'Source', href: `${GITHUB}/key-nest` },
    ],
  },
  {
    name: 'WinUtil',
    kind: 'desktop',
    summary: 'A Windows desktop widget and Spotlight utilities, with a screenshot editor.',
    platforms: 'Windows',
    version: '0.3.0',
    links: [
      { label: 'Download', href: `${GITHUB}/win-util/releases/latest` },
      { label: 'Source', href: `${GITHUB}/win-util` },
    ],
  },
  {
    name: 'Stepwise',
    kind: 'desktop',
    summary: 'Records a workflow as step screenshots and shares approved guides with AI tools through a local MCP server.',
    platforms: 'Windows',
    version: '0.1.0',
    links: [
      { label: 'Download', href: `${GITHUB}/stepwise/releases/latest` },
      { label: 'Source', href: `${GITHUB}/stepwise` },
    ],
  },
  {
    name: 'Distrod',
    kind: 'desktop',
    summary: 'Manage WSL2 distributions, processes, resources, snapshots and terminals from a native desktop app.',
    platforms: 'Windows',
    version: '0.1.0',
    links: [
      // v0.1.1 was published without installers, so "latest" would land on an empty release
      { label: 'Download', href: `${GITHUB}/distrod/releases/tag/v0.1.0` },
      { label: 'Source', href: `${GITHUB}/distrod` },
    ],
  },

  {
    name: 'EZ PM2 GUI',
    kind: 'server',
    summary: 'A web GUI for PM2: processes, logs, deployment and remote servers, with AI log analysis through Ollama or installed CLI agents.',
    platforms: 'Node.js · Docker',
    version: '1.13.0',
    install: 'npm install -g ezpm2gui',
    links: [
      { label: 'npm', href: `${NPM}/ezpm2gui` },
      { label: 'Website', href: 'https://ezpm2gui.chandanbhagat.com.np/' },
      { label: 'Docker Hub', href: 'https://hub.docker.com/r/chandanbhagat/ezpm2gui' },
      { label: 'Source', href: `${GITHUB}/ezpm2gui` },
    ],
    proof: '35 GitHub stars',
    featured: true,
  },
  {
    name: 'EZ Kafka Visualizer',
    kind: 'server',
    summary: 'A web UI for Apache Kafka: topics, messages, consumer groups and several clusters at once.',
    platforms: 'Docker · Node.js',
    version: '1.1.0',
    install: 'docker run -p 3700:3700 chandanbhagat/ezkafka-visualizer:latest',
    links: [
      { label: 'Docker Hub', href: 'https://hub.docker.com/r/chandanbhagat/ezkafka-visualizer' },
      { label: 'npm', href: `${NPM}/ezkafka-visualizer` },
      { label: 'Source', href: `${GITHUB}/ezkafka-visualizer` },
    ],
    proof: '29K+ Docker pulls',
    featured: true,
  },
  {
    name: 'pm2-notifier',
    kind: 'server',
    summary: 'Sends PM2 CPU, restart, stop and crash alerts to Teams, Slack, Discord and webhooks.',
    platforms: 'PM2 module',
    version: '0.2.0',
    install: 'pm2 install @thechandanbhagat/pm2-notifier',
    links: [
      { label: 'npm', href: `${NPM}/@thechandanbhagat/pm2-notifier` },
      { label: 'Source', href: `${GITHUB}/pm2-notifier` },
    ],
  },
  {
    name: 'gitignr',
    kind: 'server',
    summary: 'Generates a .gitignore by name, from the GitHub gitignore collection.',
    platforms: 'Node.js CLI',
    version: '1.1.1',
    install: 'npm install -g gitignr',
    links: [
      { label: 'npm', href: `${NPM}/gitignr` },
      { label: 'Source', href: `${GITHUB}/gitignr` },
    ],
    proof: '14K npm downloads a year',
  },

  {
    name: 'cv-forge',
    kind: 'ai',
    summary: 'An MCP server that writes ATS-friendly CVs, cover letters and email templates for any job description.',
    platforms: 'MCP · Node.js',
    version: '1.0.3',
    install: 'npm install -g cv-forge',
    links: [
      { label: 'npm', href: `${NPM}/cv-forge` },
      { label: 'Source', href: `${GITHUB}/cv-forge` },
    ],
    proof: '30 GitHub stars',
    featured: true,
  },
  {
    name: 'diagram-master',
    kind: 'ai',
    summary: 'An MCP server that turns natural language into Draw.io flowcharts, sequence diagrams, ERDs and network diagrams.',
    platforms: 'MCP · Node.js',
    version: '1.0.1',
    install: 'npm install -g diagram-master',
    links: [
      { label: 'npm', href: `${NPM}/diagram-master` },
      { label: 'Source', href: `${GITHUB}/diagram-master` },
    ],
    proof: '9.6K npm downloads a year',
  },
  {
    name: 'ez-mcp',
    kind: 'ai',
    summary: 'An MCP server for running command-line tools across environments, with setup for Claude, Copilot, LM Studio and Cursor.',
    platforms: 'MCP · Node.js',
    version: '1.0.4',
    install: 'npx ez-mcp setup claude',
    links: [
      { label: 'npm', href: `${NPM}/ez-mcp` },
      { label: 'Source', href: `${GITHUB}/ez-mcp` },
    ],
    proof: '9.4K npm downloads a year',
  },
  {
    name: 'pmem-agent',
    kind: 'ai',
    summary: 'Persistent, concurrent-safe project memory for Claude Code agents.',
    platforms: 'Python',
    version: '1.0.0',
    install: 'pip install pmem-agent',
    links: [
      { label: 'PyPI', href: 'https://pypi.org/project/pmem-agent/' },
      { label: 'Source', href: `${GITHUB}/pmem-agent` },
    ],
  },
  {
    name: 'claude-man',
    kind: 'ai',
    summary: 'Switch between several Claude Code accounts, nvm-style.',
    platforms: 'Windows · Linux',
    version: '0.1.0',
    install: 'npm install -g @chandan.bhagat/claude-man',
    links: [
      { label: 'npm', href: `${NPM}/@chandan.bhagat/claude-man` },
      { label: 'Source', href: `${GITHUB}/claude-man` },
    ],
  },
  {
    name: 'Claude Skills',
    kind: 'ai',
    summary: 'Ready-to-use Claude Code skills for documents, development, data, DevOps and automation.',
    platforms: 'Claude Code',
    links: [{ label: 'Source', href: `${GITHUB}/claude-skills` }],
    proof: '9 GitHub stars',
  },

  {
    name: 'Group Code',
    kind: 'extension',
    summary: 'Navigate large codebases by functionality instead of files.',
    platforms: 'VS Code · Open VSX',
    version: '1.10.0',
    install: 'code --install-extension thechandanbhagat.groupcode',
    links: [
      { label: 'Marketplace', href: `${MARKETPLACE}.groupcode` },
      { label: 'Open VSX', href: `${OPEN_VSX}/groupcode` },
      { label: 'Source', href: `${GITHUB}/group-code` },
    ],
    proof: '5K+ downloads',
    featured: true,
  },
  {
    name: 'PR Hub',
    kind: 'extension',
    summary: 'AI-powered pull request reviews across GitHub, Azure DevOps, GitLab and Bitbucket.',
    platforms: 'VS Code · Open VSX',
    version: '1.1.0',
    install: 'code --install-extension thechandanbhagat.pr-hub',
    links: [
      { label: 'Marketplace', href: `${MARKETPLACE}.pr-hub` },
      { label: 'Open VSX', href: `${OPEN_VSX}/pr-hub` },
      { label: 'Source', href: `${GITHUB}/pr-hub` },
    ],
    proof: '1.4K downloads',
  },
  {
    name: 'Overture',
    kind: 'extension',
    summary: 'Run and manage several app processes from one VS Code sidebar, with terminals, profiles and logs.',
    platforms: 'VS Code · Open VSX',
    version: '1.4.0',
    install: 'code --install-extension thechandanbhagat.overture',
    links: [
      { label: 'Marketplace', href: `${MARKETPLACE}.overture` },
      { label: 'Open VSX', href: `${OPEN_VSX}/overture` },
      { label: 'Source', href: `${GITHUB}/overture` },
    ],
    proof: '2.3K downloads',
  },
  {
    name: 'Repo Rig',
    kind: 'extension',
    summary: 'Manage git settings and hooks from inside your VS Code workspace.',
    platforms: 'VS Code · Open VSX',
    version: '1.0.3',
    install: 'code --install-extension thechandanbhagat.reporig',
    links: [
      { label: 'Marketplace', href: `${MARKETPLACE}.reporig` },
      { label: 'Open VSX', href: `${OPEN_VSX}/reporig` },
      { label: 'Source', href: `${GITHUB}/reporig` },
    ],
    proof: '1.3K downloads',
  },
  {
    name: 'Khukuri Language Support',
    kind: 'extension',
    summary: 'Syntax highlighting for Khukuri, the Nepali slang programming language.',
    platforms: 'VS Code · Open VSX',
    version: '1.4.0',
    install: 'code --install-extension thechandanbhagat.khukuri-language-support',
    links: [
      { label: 'Marketplace', href: `${MARKETPLACE}.khukuri-language-support` },
      { label: 'Open VSX', href: `${OPEN_VSX}/khukuri-language-support` },
    ],
    proof: '900+ downloads',
  },
  {
    name: 'Peek Password',
    kind: 'extension',
    summary: 'Adds a visibility toggle and one-click copy to any password field.',
    platforms: 'Chrome · Edge',
    links: [
      { label: 'Chrome Web Store', href: 'https://chromewebstore.google.com/detail/peek-password/jcoinhahiiighiijhjoplndenopbfbfd' },
      { label: 'Source', href: `${GITHUB}/peek-password` },
    ],
  },

  {
    name: 'dotnet-essential',
    kind: 'library',
    summary: 'Utility libraries and extension methods for .NET, with packages for ASP.NET Core, WPF and Azure Functions.',
    platforms: '.NET',
    version: '7.1.0',
    install: 'dotnet add package dotnet-essential',
    links: [
      { label: 'NuGet', href: 'https://www.nuget.org/packages/dotnet-essential' },
      { label: 'Source', href: `${GITHUB}/dotnet-essesntials` },
    ],
    proof: '59K downloads',
  },
  {
    name: 'Turboline NLQ2SQL',
    kind: 'library',
    summary: 'Natural-language query connectors for PostgreSQL, SQL Server, MySQL and MongoDB, through the Turboline AI API.',
    platforms: '.NET',
    version: '6.2.9',
    install: 'dotnet add package Turboline.NLQ2SQL.PostgresSQL',
    links: [{ label: 'NuGet', href: 'https://www.nuget.org/packages/Turboline.NLQ2SQL.PostgresSQL' }],
    proof: '19K downloads',
  },
  {
    name: 'UtilModule',
    kind: 'library',
    summary: 'PowerShell utilities for Service Bus SAS tokens, JWT decoding and port process management.',
    platforms: 'PowerShell',
    version: '2.0.1',
    install: 'Install-Module -Name UtilModule',
    links: [
      { label: 'PowerShell Gallery', href: 'https://www.powershellgallery.com/packages/UtilModule' },
      { label: 'Source', href: `${GITHUB}/powershell-utilities` },
    ],
    proof: '15K+ downloads',
  },
  {
    name: 'ms-rule-engine',
    kind: 'library',
    summary: 'JSON-based business rules for Node.js with full TypeScript support, inspired by Microsoft Rules Engine.',
    platforms: 'Node.js',
    version: '1.0.0',
    install: 'npm install ms-rule-engine',
    links: [
      { label: 'npm', href: `${NPM}/ms-rule-engine` },
      { label: 'Source', href: `${GITHUB}/ms-rule-engine` },
    ],
    proof: '3.8K npm downloads a year',
  },

  {
    name: 'Utility tools',
    kind: 'web',
    summary: 'Browser applets for Nepal time, a timer and Nepali Unicode typing, driven by keyboard shortcuts.',
    platforms: 'Web',
    links: [{ label: 'Open', href: 'https://util.chandanbhagat.com.np' }],
  },
  {
    name: 'Math tools',
    kind: 'web',
    summary: 'Fractions, derivatives and numerical methods in the browser.',
    platforms: 'Web',
    links: [
      { label: 'Open', href: 'https://math-tools.chandanbhagat.com.np' },
      { label: 'Source', href: `${GITHUB}/math-tools` },
    ],
  },

  {
    name: 'Mac Tools',
    kind: 'source',
    summary: 'A native macOS suite of sixteen tools for storage cleanup, file tasks, startup review and system activity.',
    platforms: 'macOS',
    links: [{ label: 'Source', href: `${GITHUB}/mac-tools` }],
  },
  {
    name: 'iPhone Syncronizer',
    kind: 'source',
    summary: 'A native macOS app to browse and copy iPhone photos and videos over USB, with no iCloud round trip.',
    platforms: 'macOS',
    links: [{ label: 'Source', href: `${GITHUB}/iphone-synchronizer` }],
  },
  {
    name: 'Khukuri',
    kind: 'source',
    summary: 'A Nepali slang programming language, with an interpreter and REPL written in Rust.',
    platforms: 'Rust',
    links: [{ label: 'Source', href: `${GITHUB}/khukuri` }],
    proof: '12 GitHub stars',
  },
  {
    name: 'TTS Forge',
    kind: 'source',
    summary: 'Record samples, train XTTS or VITS models and generate speech in your own voice.',
    platforms: 'Python',
    links: [{ label: 'Source', href: `${GITHUB}/tts-forge` }],
  },
]

export const featuredSoftware = software.filter((item) => item.featured)

export const registryStats: RegistryStat[] = [
  {
    ecosystem: 'NuGet',
    metric: '94K+ downloads',
    detail: '12 packages across dotnet-essential and the Turboline NLQ connectors.',
    href: 'https://www.nuget.org/profiles/chandan.bhagat',
  },
  {
    ecosystem: 'npm',
    metric: '50K+ a year',
    detail: '11 packages: CLI tools, MCP servers and SDKs.',
    href: 'https://www.npmjs.com/~chandan.bhagat',
  },
  {
    ecosystem: 'Docker Hub',
    metric: '30K+ pulls',
    detail: 'Mostly the ezkafka-visualizer image, alongside ezpm2gui.',
    href: 'https://hub.docker.com/u/chandanbhagat',
  },
  {
    ecosystem: 'PowerShell Gallery',
    metric: '15K+ downloads',
    detail: 'UtilModule and SesioWorker.',
    href: 'https://www.powershellgallery.com/profiles/thechandanbhagat',
  },
  {
    ecosystem: 'Open VSX',
    metric: '10K+ downloads',
    detail: 'Five extensions for Open VSX-compatible editors.',
    href: 'https://open-vsx.org/namespace/thechandanbhagat',
  },
  {
    ecosystem: 'VS Code Marketplace',
    metric: '5 extensions',
    detail: 'Group Code, PR Hub, Repo Rig, Overture and Khukuri Language Support.',
    href: 'https://marketplace.visualstudio.com/publishers/thechandanbhagat',
  },
]
