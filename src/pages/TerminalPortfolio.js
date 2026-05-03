// @group Imports : React core and styles
import React, { useEffect, useRef, useState, useCallback } from 'react';
import './TerminalPortfolio.css';

// @group Data : Portfolio content for terminal commands
const DATA = {
  experience: [
    {
      title: 'Software Engineer', company: 'AE Live',
      period: 'Dec 2022 – May 2024', loc: 'London, UK',
      achievements: [
        'WPF broadcast graphics → ↑40% render perf',
        'ASP.NET Core API → 100K+ daily req',
        'Kubernetes → ↓60% deploy time',
        'Azure cloud-native architecture',
      ],
      stack: ['C#', 'ASP.NET Core', 'WPF', 'Angular', 'Azure', 'K8s', 'Docker', 'TypeScript'],
    },
    {
      title: 'Technical Lead', company: 'Amazing Digital',
      period: 'May 2021 – Oct 2022', loc: 'Seattle (Remote)',
      achievements: [
        '12-member team × 3 timezones · 5 major projects',
        'CI/CD: 2h → 20min deploy',
        'Mentored 12+ engineers',
        'GitHub Actions + IBM Cloud automation',
      ],
      stack: ['Team Lead', 'Microservices', 'GitHub Actions', 'IBM Cloud', 'Next.js', 'React', 'AWS'],
    },
    {
      title: 'DevOps / Engineer', company: 'AgriSync',
      period: 'Mar 2020 – Mar 2021', loc: 'Des Moines, Iowa',
      achievements: [
        'DevOps transformation → ↓80% deploy failures',
        'GitHub Actions → 20+ services automated',
        'K8s clusters on Azure production',
        'Salesforce + .NET Core integration',
      ],
      stack: ['C#', 'DevOps', 'Azure', 'Kubernetes', 'Salesforce', 'Angular', 'Shell'],
    },
    {
      title: 'Technical Lead', company: 'Blue Panda Comms',
      period: 'Jul 2019 – Feb 2020', loc: 'Kathmandu, Nepal',
      achievements: [
        'Azure cloud migration → microservices',
        'Service Bus · Event Grid · Event Hub',
        'CI/CD via Azure DevOps',
      ],
      stack: ['Azure', 'Service Bus', 'Event Grid', 'K8s', 'Microservices'],
    },
  ],
  skills: {
    'Backend & Cloud':  [['C# / .NET Core', 97], ['Azure', 94], ['Azure Functions', 91], ['Service Bus', 89], ['Node.js', 80], ['ML.NET', 76]],
    'DevOps & Infra':   [['Docker', 96], ['Kubernetes', 93], ['GitHub Actions', 92], ['Azure DevOps', 90], ['CI/CD', 92], ['Shell/PS', 83]],
    'Frontend':         [['Angular', 88], ['TypeScript', 86], ['React / Next.js', 80], ['WPF / XAML', 88]],
  },
  talks: [
    { year: '2024', title: 'Service Bus & Azure Functions – Event-Driven Arch', event: 'Reactor Meetup, London' },
    { year: '2022', title: 'Creating and Managing gRPC Apps in Azure',          event: 'Nepal Cloud Summit' },
    { year: '2021', title: 'Power Your .NET App with ML.NET',                   event: 'Global AI Bootcamp' },
    { year: '2021', title: 'Azure and GitHub Combo – DevOps Workflows',          event: 'Global Azure Bootcamp' },
    { year: '2021', title: 'Power ASP.NET Apps with Power Automate',             event: 'Dynamics 365 & Power Platform' },
    { year: '2020', title: 'Azure Container Instances and AKS Deep Dive',        event: 'Kubernetes Discovery Day' },
    { year: '2020', title: 'Azure and GitHub – Virtual Edition',                 event: 'Global Azure Virtual' },
    { year: '2019', title: 'Azure Container Instances and Kubernetes',           event: 'Azure Saturday' },
  ],
  contact: {
    email:    'chandan.bhagat@outlook.com',
    phone:    '+44 7818 620731',
    linkedin: 'linkedin.com/in/guptac',
    github:   'github.com/thechandanbhagat',
    location: 'London, United Kingdom',
    web:      'chandanbhagat.com.np',
  },
};

// @group Helpers : HTML span builder and output helpers
function h(cls, text) {
  return `<span class="${cls}">${text}</span>`;
}

// @group TerminalPortfolio : Main terminal portfolio component
const TerminalPortfolio = () => {
  // @group State : Component state refs
  const outputRef  = useRef(null);
  const inputRef   = useRef(null);
  const historyRef = useRef([]);
  const histIdxRef = useRef(-1);

  const [inputValue,  setInputValue]  = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [sbClock,     setSbClock]     = useState('Ln 1, Col 1');
  const [tbClock,     setTbClock]     = useState('00:00');
  const [tbDate,      setTbDate]      = useState('');

  const currentPathRef = useRef('~');

  // @group OutputHelpers : DOM helpers for terminal output
  const append = useCallback((html, gap = false) => {
    const out = outputRef.current;
    if (!out) return;
    const d = document.createElement('div');
    d.className = 'tp-line' + (gap ? ' gap' : '');
    d.innerHTML = html;
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }, []);

  const blank = useCallback((n = 1) => {
    for (let i = 0; i < n; i++) append('&nbsp;');
  }, [append]);

  const updatePath = useCallback((path) => {
    currentPathRef.current = path;
    setCurrentPath(path);
  }, []);

  const printPrompt = useCallback((cmd) => {
    const path = currentPathRef.current;
    append(
      `<div class="tp-prompt">` +
        `<span class="user">chandan</span>` +
        `<span class="at">@</span>` +
        `<span class="host">portfolio</span>` +
        `<span class="colon">:</span>` +
        `<span class="path">${path}</span>` +
        `<span class="dollar"> $ </span>` +
        `<span class="cmd">${cmd}</span>` +
      `</div>`
    );
  }, [append]);

  // @group Commands : All terminal command implementations
  const COMMANDS = useCallback(() => {
    const cmds = {};

    // @group Commands > Help : Show available commands
    cmds['help'] = () => {
      append(`${h('g2 b', 'Available commands:')}`);
      blank();
      const list = [
        ['neofetch',              'System info + ASCII art'],
        ['whoami',                'Current user info'],
        ['uname -a',              'Kernel/system info'],
        ['uptime',                'System uptime'],
        ['ls -la',                'List portfolio files'],
        ['cat about.md',          'About Chandan'],
        ['cat experience.json',   'Work history'],
        ['cat skills.txt',        'Technical skills'],
        ['cat talks.log',         'Conference talks (25+)'],
        ['cat contact.sh',        'Contact information'],
        ['cat projects/groupcode.md', 'GroupCode VS Code extension'],
        ['ps aux',                'Running processes (skills view)'],
        ['top',                   'System monitor view'],
        ['ssh hire@me',           'Start the hiring process 🚀'],
        ['history',               'Command history'],
        ['clear',                 'Clear terminal'],
        ['sudo hire-me',          'The most important command'],
      ];
      list.forEach(([c, d]) => {
        append(`  ${h('g', c.padEnd(28))}${h('gr', d)}`);
      });
      blank();
      append(`${h('gr', 'Tip: Click files in the sidebar or use Tab completion')}`);
    };

    // @group Commands > Neofetch : System info with ASCII art
    cmds['neofetch'] = () => {
      const ascii = [
        '        .-/+oossssoo+/-.        ',
        '      :+ssssssssssssssssss+:      ',
        '    .ossssssssssssssssssyyssss/.   ',
        '   osssssssssssssssssss dMMMNysssso',
        '  ossssssssssssssssssss dMMMMMyssss/',
        ' /ssssssssssssssssssssyMMNyssssssss\\',
        ' +ssssssssssshdmmNNmmyNMMMMhssssssss+',
        ' /ssssssssshmydMMMMMMMNddddyssssssss/',
        ' +sssssssshNMMMyhhyyyyhmNMMMNhssssss+',
        ' osssssssdMMMNhsssssssssshNMMMdssssso',
        ' osssssssdMMMNhsssssssssshNMMMdssssso',
        ' +sssssssshNMMMyhhyyyyhdNMMMNhssssss+',
        ' /ssssssssshmydMMMMMMMNdddddyssssssss/',
        ' +ssssssssssshdmNNNNmyNMMMMhssssssss+',
        ' \\ssssssssssssssssssssyMMNyssssssss/  ',
        '  ossssssssssssssssssss dMMMyssss/   ',
        '   osssssssssssssssssss dMMMNysssso  ',
        '    .+ossssssssssssssssssyyyyssso/.  ',
        '      :+ssssssssssssssssss+:        ',
        '        .-/+oossssoo+/-.            ',
      ];
      const info = [
        ['', ''],
        [h('g2 b', 'chandan') + '@' + h('c b', 'portfolio'), ''],
        ['─'.repeat(32), ''],
        [h('g', 'OS'),       'Ubuntu 24.04 LTS x86_64'],
        [h('g', 'Host'),     'portfolio.chandanbhagat.com.np'],
        [h('g', 'Kernel'),   '6.8.0-arch1-1'],
        [h('g', 'Uptime'),   '10 years, 3 months'],
        [h('g', 'Shell'),    'bash 5.2.0'],
        [h('g', 'Role'),     'Software Engineer · Cloud Architect'],
        [h('g', 'Location'), 'London, United Kingdom 🇬🇧'],
        [h('g', 'Stack'),    '.NET · Azure · Kubernetes · Docker'],
        [h('g', 'Status'),   h('g2 b', '✓ OPEN TO WORK')],
        [h('g', 'GitHub'),   'github.com/thechandanbhagat'],
        [h('g', 'Email'),    'chandan.bhagat@outlook.com'],
        ['', ''],
        [h('r', '███') + h('y', '███') + h('g', '███') + h('c', '███') + h('p', '███') + '  ', ''],
      ];
      const rows = Math.max(ascii.length, info.length);
      for (let i = 0; i < rows; i++) {
        const a = ascii[i] || ''.padEnd(38);
        const inf = info[i] ? `${info[i][0]}  ${info[i][1]}` : '';
        append(
          `<span style="display:inline-flex;gap:16px;font-size:12px">` +
          `<span style="color:#3fb950;font-family:'JetBrains Mono',monospace;white-space:pre;min-width:38ch">${a}</span>` +
          `<span>${inf}</span>` +
          `</span>`
        );
      }
    };

    // @group Commands > Whoami : User info
    cmds['whoami'] = () => {
      append(h('g2', 'chandan'));
      blank();
      append(
        `${h('gr', 'uid=')}${h('g', '1000')}${h('gr', '(chandan)')} ` +
        `${h('gr', 'gid=')}${h('g', '1000')}${h('gr', '(engineers)')} ` +
        `groups=${h('c', 'senior-engineers')},${h('y', 'cloud-architects')},${h('p', 'tech-speakers')},${h('g', 'mentors')}`
      );
    };

    cmds['uname -a'] = () => {
      append('Linux portfolio-server 6.8.0-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux');
    };

    cmds['uptime'] = () => {
      const now = new Date().toLocaleTimeString('en-GB', { hour12: false });
      append(` ${now} ${h('g', 'up')} 10 years, 3 months,  ${h('c', '2')} users,  load average: ${h('y', '0.12')}, ${h('y', '0.08')}, ${h('y', '0.05')}`);
    };

    // @group Commands > LsLa : List portfolio files
    cmds['ls -la'] = () => {
      append(`total ${h('y', '64')}`);
      append(`${h('c', 'drwxr-xr-x')} 1 chandan engineers  ${h('y', '4096')} May  3 ${h('g', 'portfolio/')}`);
      [
        ['about.md',        '2024-05-01', 'g2', '4.2K'],
        ['experience.json', '2024-05-01', 'y',  '8.1K'],
        ['skills.txt',      '2024-05-01', 'c',  '2.8K'],
        ['talks.log',       '2024-05-01', 'p',  '3.6K'],
        ['contact.sh',      '2024-05-01', 'o',  '1.1K'],
      ].forEach(([f, d, col, sz]) => {
        append(`${h('g', '-rw-r--r--')} 1 chandan engineers  ${h('y', sz.padStart(5))} ${d} ${h(col, f)}`);
      });
      append(`${h('c', 'drwxr-xr-x')} 1 chandan engineers  ${h('y', '4096')} May  3 ${h('g', 'projects/')}`);
      append(`${h('c', 'drwxr-xr-x')} 1 chandan engineers  ${h('y', '4096')} May  3 ${h('gr', 'config/')}`);
    };

    // @group Commands > About : About section
    cmds['cat about.md'] = () => {
      updatePath('~/portfolio');
      append(`${h('c', '# About Chandan Gupta Bhagat')}`);
      blank();
      append(`${h('y', '> 10 years')} building cloud-native systems at scale.`);
      append(`Specialising in ${h('g', '.NET, Azure')} and event-driven architecture.`);
      append(`Speaker at ${h('p', '25+')} global tech conferences. Based in ${h('c', 'London, UK')}.`);
      blank();
      append(`${h('c', '## Core Competencies')}`);
      [
        'Cloud-native application development',
        'Microservices architecture design',
        'DevOps and CI/CD implementation',
        'Machine Learning with ML.NET',
        'Event-driven systems',
        'Container orchestration',
        'Technical speaking & presentations',
        'Team leadership & mentoring',
      ].forEach(s => append(`  ${h('g', '- ')}${s}`));
      blank();
      append(`${h('c', '## Education')}`);
      append(`  ${h('g', 'Degree:   ')} Bachelor of Computer Engineering`);
      append(`  ${h('g', 'School:   ')} IOE, Pulchowk Campus`);
      append(`  ${h('g', 'Year:     ')} 2011 – 2014`);
      blank();
      append(`${h('c', '## Philosophy')}`);
      append(`  ${h('p', 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन')}`);
      append(`  ${h('gr', '"You have the right to perform actions,')}`);
      append(`  ${h('gr', ' but never to the fruits of those actions."')}`);
      append(`  ${h('gr', '— Bhagavad Gita 2.47')}`);
    };

    // @group Commands > Experience : Work history
    cmds['cat experience.json'] = () => {
      updatePath('~/portfolio');
      append(`${h('p', '{')}  ${h('gr', '// experience.json')}`);
      append(`  ${h('c', '"roles"')}: [`);
      DATA.experience.forEach((job, i) => {
        const last = i === DATA.experience.length - 1;
        append(`    ${h('p', '{')}`);
        append(`      ${h('c', '"title"')}:        ${h('y', '"' + job.title + '"')},`);
        append(`      ${h('c', '"company"')}:      ${h('y', '"' + job.company + '"')},`);
        append(`      ${h('c', '"period"')}:       ${h('y', '"' + job.period + '"')},`);
        append(`      ${h('c', '"location"')}:     ${h('y', '"' + job.loc + '"')},`);
        append(`      ${h('c', '"achievements"')}: [`);
        job.achievements.forEach(a => append(`        ${h('g2', '"' + a + '"')},`));
        append(`      ],`);
        append(`      ${h('c', '"stack"')}: [${job.stack.map(s => `${h('o', '"' + s + '"')}`).join(', ')}]`);
        append(`    ${h('p', '}')}${last ? '' : ','}`);
        blank();
      });
      append(`  ]`);
      append(`${h('p', '}')}`);
    };

    // @group Commands > Skills : Technical skills
    cmds['cat skills.txt'] = () => {
      updatePath('~/portfolio');
      Object.entries(DATA.skills).forEach(([cat, skills]) => {
        append(`${h('y', '## ')}${h('c b', cat)}`);
        skills.forEach(([name, pct]) => {
          const filled = Math.round(pct / 10);
          const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
          append(`  ${h('g', name.padEnd(22))} ${h('g2', bar)} ${h('y', pct + '%')}`);
        });
        blank();
      });
      append(`${h('gr', '# Run')} ${h('g', 'ps aux')} ${h('gr', 'for interactive view')}`);
    };

    // @group Commands > Talks : Conference talks
    cmds['cat talks.log'] = () => {
      updatePath('~/portfolio');
      append(`${h('gr', '# Conference talks log — 25+ events')}`);
      append(`${h('gr', '# format: [YEAR] [EVENT] TITLE')}`);
      blank();
      DATA.talks.forEach(t => {
        append(`[${h('y', t.year)}] ${h('gr', '[' + t.event + ']')} ${h('w', t.title)}`);
      });
      blank();
      append(`${h('gr', '# All talks include live demos and open-source code')}`);
      append(`${h('gr', '# GitHub: github.com/thechandanbhagat')}`);
    };

    // @group Commands > Contact : Contact info
    cmds['cat contact.sh'] = () => {
      updatePath('~/portfolio');
      append(`${h('gr', '#!/bin/bash')}`);
      append(`${h('gr', '# contact.sh — get in touch with Chandan')}`);
      blank();
      append(`${h('p', 'NAME')}="${h('g2', 'Chandan Gupta Bhagat')}"`);
      append(`${h('p', 'ROLE')}="${h('g2', 'Software Engineer · Cloud Architect')}"`);
      append(`${h('p', 'LOCATION')}="${h('g2', 'London, United Kingdom')}"`);
      blank();
      append(`${h('p', 'EMAIL')}="${h('c', DATA.contact.email)}"`);
      append(`${h('p', 'PHONE')}="${h('c', DATA.contact.phone)}"`);
      append(`${h('p', 'LINKEDIN')}="${h('c', DATA.contact.linkedin)}"`);
      append(`${h('p', 'GITHUB')}="${h('c', DATA.contact.github)}"`);
      append(`${h('p', 'WEB')}="${h('c', DATA.contact.web)}"`);
      blank();
      append(`${h('gr', '# Reach out for:')}`);
      append(`${h('gr', '#  - Senior Software Engineering roles')}`);
      append(`${h('gr', '#  - Technical leadership positions')}`);
      append(`${h('gr', '#  - Cloud architecture consulting')}`);
      append(`${h('gr', '#  - Conference speaking engagements')}`);
      blank();
      append(`echo ${h('g', '"Open to work — available immediately"')}`);
      blank();
      append(`${h('gr', '# Run')} ${h('g', 'ssh hire@me')} ${h('gr', 'to start the conversation')}`);
    };

    // @group Commands > GroupCode : GroupCode project
    cmds['cat projects/groupcode.md'] = () => {
      updatePath('~/portfolio/projects');
      append(`${h('c', '# GroupCode — VS Code Extension')}`);
      blank();
      append(`${h('y', '> Navigate Code by Functionality, Not Just Files')}`);
      blank();
      append(`GroupCode transforms how you organize and navigate your codebase`);
      append(`using special comments to tag related code sections across files.`);
      blank();
      append(`${h('c', '## Install')}`);
      append(`  ${h('g', 'code --install-extension')} thechandanbhagat.groupcode`);
      blank();
      append(`${h('c', '## Usage')}`);
      append(`  ${h('gr', '// JavaScript / TypeScript / C# / Python / Go / Java')}`);
      append(`  ${h('g', '// @group')} ${h('y', 'authentication')}`);
      append(`  function login(user, pass) { ... }`);
      blank();
      append(`  ${h('g', '// @group')} ${h('y', 'authentication')}`);
      append(`  function logout() { ... }`);
      blank();
      append(`${h('c', '## Links')}`);
      append(`  ${h('g', 'Marketplace:')} ${h('c', 'marketplace.visualstudio.com/items?itemName=thechandanbhagat.groupcode')}`);
      append(`  ${h('g', 'GitHub:     ')} ${h('c', 'github.com/thechandanbhagat/groupcode')}`);
      append(`  ${h('g', 'Stars:      ')} ${h('y', '150+')}`);
      append(`  ${h('g', 'Downloads:  ')} ${h('y', '1.2K+')}`);
    };

    // @group Commands > PsAux : Skills as process list
    cmds['ps aux'] = () => {
      append(`${h('gr', 'USER         PID %CPU %MEM    VSZ   RSS STAT COMMAND')}`);
      [
        ['chandan', '1001', '97.2', '10.0', 'C#/.NET Core',     'S+'],
        ['chandan', '1002', '94.1',  '8.5', 'Azure',             'S+'],
        ['chandan', '1003', '96.0',  '7.2', 'Docker',            'S+'],
        ['chandan', '1004', '93.2',  '6.8', 'Kubernetes',        'S+'],
        ['chandan', '1005', '92.5',  '5.9', 'GitHub Actions',    'S+'],
        ['chandan', '1006', '91.5',  '5.2', 'Azure Functions',   'S+'],
        ['chandan', '1007', '90.8',  '5.0', 'Azure DevOps',      'S+'],
        ['chandan', '1008', '88.3',  '4.8', 'Angular',           'S+'],
        ['chandan', '1009', '88.7',  '4.7', 'WPF/XAML',          'S+'],
        ['chandan', '1010', '86.1',  '4.5', 'TypeScript',        'S+'],
        ['chandan', '1011', '83.0',  '4.2', 'Shell/PS',          'S+'],
        ['chandan', '1012', '80.1',  '3.8', 'Node.js',           'S+'],
        ['chandan', '1013', '80.5',  '3.6', 'React/Next.js',     'S+'],
        ['chandan', '1014', '76.4',  '3.2', 'ML.NET/AI',         'S+'],
      ].forEach(([user, pid, cpu, mem, cmd, stat]) => {
        const cpuCol = parseFloat(cpu) > 90 ? 'r' : parseFloat(cpu) > 80 ? 'y' : 'g';
        append(
          `${h('g', user.padEnd(12))} ${h('gr', pid.padEnd(6))} ${h(cpuCol, cpu.padEnd(5))} ` +
          `${h('c', mem.padEnd(5))} ${h('gr', '16384  8192')} ${h('y', stat.padEnd(5))} ${h('w', cmd)}`
        );
      });
    };

    // @group Commands > Top : System monitor
    cmds['top'] = () => {
      append(`${h('g2 b', 'top')} - ${new Date().toLocaleTimeString('en-GB', { hour12: false })} up 10 years,  2 users,  load average: 0.12, 0.08, 0.05`);
      append(`${h('c', 'Tasks:')} ${h('g', '14')} total, ${h('g2', '14')} running, 0 sleeping`);
      append(`${h('c', '%Cpu(s):')} ${h('r', '92.1')} us,  ${h('y', '4.2')} sy,  0.0 ni,  ${h('g', '3.1')} id`);
      append(`${h('c', 'MiB Mem :')} ${h('y', '16384.0')} total, ${h('g', '4096.0')} free, ${h('r', '8192.0')} used`);
      blank();
      append(`${h('gr', '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND')}`);
      [
        ['1001', 'C#/.NET',      '97.2', '10.0'],
        ['1003', 'Docker',        '96.0',  '7.2'],
        ['1002', 'Azure',         '94.1',  '8.5'],
        ['1004', 'Kubernetes',    '93.2',  '6.8'],
        ['1005', 'GitHubActions', '92.5',  '5.9'],
      ].forEach(([pid, cmd, cpu, mem]) => {
        append(
          ` ${h('y', pid.padStart(5))} ${h('g', 'chandan')}  20   0  16384   8192   4096 R ` +
          `${h('r', cpu.padStart(6))} ${h('c', mem.padStart(5))} 520:30.${Math.floor(Math.random() * 99).toString().padStart(2, '0')} ${h('w', cmd)}`
        );
      });
      blank();
      append(`${h('gr', 'Press')} ${h('g', 'q')} ${h('gr', 'to quit (or type another command)')}`);
    };

    // @group Commands > History : Command history
    cmds['history'] = () => {
      historyRef.current.forEach((cmd, i) => {
        append(`  ${h('y', (i + 1).toString().padStart(4))}  ${cmd}`);
      });
    };

    cmds['clear'] = () => {
      if (outputRef.current) outputRef.current.innerHTML = '';
    };

    // @group Commands > SshHireMe : Hire contact card
    cmds['ssh hire@me'] = () => {
      append(`${h('c', 'ssh')} hire@me`);
      blank();
      append(`Connecting to ${h('g', 'chandan.bhagat@outlook.com')} ...`);
      setTimeout(() => append(`Connected. ${h('g2', 'Welcome!')}`), 300);
      setTimeout(() => {
        blank();
        append(`${h('y b', '┌──────────────────────────────────────────────────┐')}`);
        append(`${h('y b', '│')}   ${h('g2 b', '      READY TO HIRE CHANDAN?              ')}   ${h('y b', '│')}`);
        append(`${h('y b', '│')}                                                  ${h('y b', '│')}`);
        append(`${h('y b', '│')}   ${h('c', 'Email:    ')} chandan.bhagat@outlook.com      ${h('y b', '│')}`);
        append(`${h('y b', '│')}   ${h('c', 'LinkedIn: ')} linkedin.com/in/guptac              ${h('y b', '│')}`);
        append(`${h('y b', '│')}   ${h('c', 'GitHub:   ')} github.com/thechandanbhagat         ${h('y b', '│')}`);
        append(`${h('y b', '│')}   ${h('c', 'Location: ')} London, United Kingdom               ${h('y b', '│')}`);
        append(`${h('y b', '│')}   ${h('c', 'Status:   ')} ${h('g2', '✓ AVAILABLE NOW')}                       ${h('y b', '│')}`);
        append(`${h('y b', '└──────────────────────────────────────────────────┘')}`);
      }, 600);
    };

    // @group Commands > SudoHireMe : Deployment animation
    cmds['sudo hire-me'] = () => {
      append(`[sudo] password for chandan: `);
      setTimeout(() => {
        append(`${h('g2', '✓')} Authentication successful`);
        blank();
        append(`${h('r b', 'WARNING:')} You are about to hire a highly skilled engineer.`);
        blank();
        append(`${h('g', 'Deploying')} ${h('c', 'chandan-gupta-bhagat')} to your team...`);
        const steps = [
          'Checking availability              [████████████] 100%',
          'Verifying 10+ years experience     [████████████] 100%',
          'Loading .NET/Azure expertise       [████████████] 100%',
          'Initialising leadership modules    [████████████] 100%',
          'Configuring mentoring protocols    [████████████] 100%',
        ];
        steps.forEach((s, i) => setTimeout(() => append(`  ${h('g', s)}`), 300 + i * 400));
        setTimeout(() => {
          blank();
          append(`${h('g2 b', '✓ Deployment successful. Chandan is now on your team.')}`);
          blank();
          append(`Contact: ${h('c', 'chandan.bhagat@outlook.com')}`);
        }, 300 + steps.length * 400 + 200);
      }, 800);
    };

    // @group Commands > Misc : Various utility commands
    cmds['vim']       = () => append(`${h('y', 'E492:')} Not a valid command. ${h('gr', '(hint: use')} ${h('g', 'nano')}${h('gr', ')')}`);
    cmds['emacs']     = () => append(`${h('r', 'Error:')} emacs: command not found. ${h('gr', 'This is a vim household.')}`);
    cmds['git log']   = () => {
      [
        ['a3f2c1d', 'feat: add Kubernetes orchestration (↓60% deploy time)'],
        ['b7e4f2a', 'fix: ASP.NET Core API performance optimisation'],
        ['c9d8e3b', 'feat: GitHub Actions CI/CD pipeline → 20+ services'],
        ['d1f0a4c', 'feat: Azure Service Bus event-driven architecture'],
        ['e5c7b2d', 'refactor: WPF broadcast graphics engine (+40% perf)'],
      ].forEach(([hash, msg]) => append(`${h('y', hash)} ${h('w', msg)}`));
    };
    cmds['git status'] = () => append(`On branch ${h('g', 'main')}\nYour branch is up to date with origin/main.\n\nnothing to commit, working tree clean`);
    cmds['pwd']        = () => append(`/home/chandan/${currentPathRef.current.replace('~', '').replace(/^\//, '')}`);
    cmds['date']       = () => append(new Date().toString());
    cmds['hostname']   = () => append('portfolio.chandanbhagat.com.np');
    cmds['echo $USER'] = () => append('chandan');
    cmds['echo $HOME'] = () => append('/home/chandan');
    cmds['cat /etc/os-release'] = () => {
      append(`NAME="${h('g2', 'Ubuntu')}"`);
      append(`VERSION="${h('y', '24.04.1 LTS (Noble Numbat')}"`);
      append(`ID=ubuntu`);
      append(`PRETTY_NAME="${h('c', 'Ubuntu 24.04.1 LTS')}"`);
    };
    cmds['ls']          = cmds['ls -la'];
    cmds['cat skills.md']  = cmds['cat skills.txt'];
    cmds['cat about']      = cmds['cat about.md'];
    cmds['cat experience'] = cmds['cat experience.json'];
    cmds['cat skills']     = cmds['cat skills.txt'];
    cmds['cat talks']      = cmds['cat talks.log'];
    cmds['cat contact']    = cmds['cat contact.sh'];
    cmds['man chandan']    = () => {
      append(`${h('c', 'CHANDAN(1)')}${' '.repeat(20)}User Commands${' '.repeat(20)}${h('c', 'CHANDAN(1)')}`);
      blank();
      append(`${h('c', 'NAME')}`);
      append(`       chandan - senior software engineer and cloud architect`);
      blank();
      append(`${h('c', 'SYNOPSIS')}`);
      append(`       chandan [OPTION]... [PROJECT]...`);
      blank();
      append(`${h('c', 'DESCRIPTION')}`);
      append(`       Builds scalable cloud-native systems. Leads engineering teams.`);
      append(`       Speaks at conferences. Ships products. Based in London, UK.`);
      blank();
      append(`${h('c', 'OPTIONS')}`);
      append(`       ${h('g', '--full-time')}     Available immediately for senior roles`);
      append(`       ${h('g', '--consultant')}    Available for cloud architecture consulting`);
      append(`       ${h('g', '--speaker')}       Available for conference talks`);
      blank();
      append(`${h('c', 'VERSION')}`);
      append(`       10.3.22 (10 years, 3 months, 22 days of experience)`);
    };

    return cmds;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [append, blank, updatePath]);

  // @group CommandRunner : Execute a terminal command
  const runCmd = useCallback((raw) => {
    const cmd = raw.trim();
    if (!cmd) return;

    const hist = historyRef.current;
    if (hist[hist.length - 1] !== cmd) hist.push(cmd);
    histIdxRef.current = hist.length;

    printPrompt(cmd);

    const cmds = COMMANDS();

    if (cmds[cmd]) {
      cmds[cmd]();
    } else if (cmd.startsWith('echo ')) {
      append(cmd.slice(5).replace(/['"]/g, ''));
    } else if (cmd.startsWith('cd ')) {
      const dir = cmd.slice(3).trim();
      if (dir === '~' || dir === '') {
        updatePath('~');
      } else if (dir === '..') {
        const cur = currentPathRef.current;
        const next = cur.includes('/')
          ? cur.split('/').slice(0, -1).join('/') || '~'
          : '~';
        updatePath(next);
      } else {
        const cur = currentPathRef.current;
        updatePath(cur === '~' ? `~/portfolio/${dir}` : `${cur}/${dir}`);
      }
    } else {
      append(
        `${h('r', 'bash: ' + cmd.split(' ')[0] + ':')} command not found. ` +
        `Type ${h('g', 'help')} for available commands.`
      );
    }
    blank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [append, blank, printPrompt, updatePath, COMMANDS]);

  // @group SidebarClick : Handle sidebar file clicks
  const handleSidebarClick = useCallback((cmd, el) => {
    document.querySelectorAll('.tp-ft-item').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    runCmd(cmd);
    if (inputRef.current) inputRef.current.focus();
  }, [runCmd]);

  // @group InputHandler : Keyboard handler for terminal input
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      const v = inputValue;
      setInputValue('');
      runCmd(v);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const hist = historyRef.current;
      if (histIdxRef.current > 0) {
        histIdxRef.current--;
        setInputValue(hist[histIdxRef.current] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const hist = historyRef.current;
      if (histIdxRef.current < hist.length - 1) {
        histIdxRef.current++;
        setInputValue(hist[histIdxRef.current] || '');
      } else {
        histIdxRef.current = hist.length;
        setInputValue('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cmds = COMMANDS();
      const matches = Object.keys(cmds).filter(k => k.startsWith(inputValue));
      if (matches.length === 1) {
        setInputValue(matches[0]);
      } else if (matches.length > 1) {
        printPrompt(inputValue);
        append(matches.map(m => h('g', m)).join('  '));
        blank();
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      if (outputRef.current) outputRef.current.innerHTML = '';
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      append(
        `<div class="tp-prompt">` +
        `<span class="user">chandan</span><span class="at">@</span>` +
        `<span class="host">portfolio</span><span class="colon">:</span>` +
        `<span class="path">${currentPathRef.current}</span>` +
        `<span class="dollar"> $ </span><span class="cmd">${inputValue}</span>` +
        `${h('w', '^C')}` +
        `</div>`
      );
      blank();
      setInputValue('');
    }

    const out = outputRef.current;
    if (out) {
      setSbClock(`Ln ${out.children.length}, Col ${inputValue.length + 1}`);
    }
  }, [inputValue, runCmd, COMMANDS, printPrompt, append, blank]);

  // @group BootSequence : Terminal startup animation
  useEffect(() => {
    const lines = [
      { t: 0,    fn: () => append(`${h('g', '[    0.000000]')} Booting portfolio kernel v6.8.0...`) },
      { t: 80,   fn: () => append(`${h('g', '[    0.082341]')} Detected ${h('c', 'x86_64')} architecture`) },
      { t: 160,  fn: () => append(`${h('g', '[    0.163412]')} Loading chandan-bhagat.ko module...`) },
      { t: 240,  fn: () => append(`${h('g', '[    0.241003]')} Initialising ${h('y', '10')} years of experience...`) },
      { t: 320,  fn: () => append(`${h('g', '[    0.322891]')} Mounting ${h('c', '/dev/azure')} on ${h('c', '/mnt/cloud')}... ${h('g2', 'OK')}`) },
      { t: 400,  fn: () => append(`${h('g', '[    0.401234]')} Starting ${h('p', 'kubernetes')} daemon... ${h('g2', 'OK')}`) },
      { t: 480,  fn: () => append(`${h('g', '[    0.482341]')} Loading ${h('o', '.NET 8.0')} runtime... ${h('g2', 'OK')}`) },
      { t: 560,  fn: () => append(`${h('g', '[    0.561209]')} ${h('g2', 'All systems operational')}`) },
      { t: 680,  fn: () => { blank(); append('Ubuntu 24.04.1 LTS portfolio tty1'); blank(); } },
      { t: 800,  fn: () => append(`${h('g2', 'chandan@portfolio')} login: ${h('w', 'chandan')}`) },
      { t: 960,  fn: () => { append(`Last login: ${new Date().toDateString()} from 127.0.0.1`); blank(); } },
      { t: 1100, fn: () => {
        append(`${h('y b', "Welcome to Chandan Gupta Bhagat's Portfolio Terminal")}`);
        append(`${h('gr', '─'.repeat(52))}`);
        append(`Type ${h('g', 'help')} to see all commands, or click files in the sidebar.`);
        append(`Try: ${h('g', 'neofetch')}, ${h('g', 'cat about.md')}, ${h('g', 'ssh hire@me')}, ${h('g', 'sudo hire-me')}`);
        blank();
      }},
    ];

    const timers = lines.map(({ t, fn }) => setTimeout(fn, t));
    const focusTimer = setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 1200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(focusTimer);
    };
  }, [append, blank]);

  // @group Clock : Live clock updates
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit', minute: '2-digit',
      });
      const date = now.toLocaleDateString('en-GB', {
        weekday: 'short', day: '2-digit', month: 'short',
      });
      setTbClock(time);
      setTbDate(date);
    };
    updateClocks();
    const id = setInterval(updateClocks, 10000);
    return () => clearInterval(id);
  }, []);

  // @group BodyOverride : Prevent body scroll while terminal is active
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // @group Render : Component JSX
  return (
    <div className="tp-wrap" onClick={() => inputRef.current && inputRef.current.focus()}>

      {/* Title Bar */}
      <div className="tp-titlebar">
        <div className="tp-tb-btn tp-tb-close"></div>
        <div className="tp-tb-btn tp-tb-min"></div>
        <div className="tp-tb-btn tp-tb-max"></div>
        <div className="tp-tb-title">chandan@portfolio-server: ~</div>
        <div className="tp-tb-right">
          <span>{tbClock}</span>
          <span>{tbDate}</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tp-tabbar">
        <div className="tp-tab active">
          <span className="tp-tab-dot"></span>
          bash — chandan@portfolio: ~
        </div>
        <div className="tp-tab">
          <span className="tp-tab-dot yellow"></span>
          ssh chandan@server
        </div>
        <div className="tp-tab">
          <span className="tp-tab-dot red"></span>
          htop
        </div>
        <div className="tp-tab" style={{ color: '#8b949e', padding: '0 12px', fontSize: '18px', lineHeight: '32px' }}>+</div>
      </div>

      {/* Workspace */}
      <div className="tp-workspace">

        {/* Sidebar */}
        <div className="tp-sidebar">
          <div className="tp-sidebar-header">Explorer</div>
          <div className="tp-filetree">
            <div className="tp-ft-item tp-ft-dir">
              <span className="icon">▾</span><span>portfolio/</span>
            </div>
            {[
              { cmd: 'cat about.md',          icon: '📄', color: 'g2', label: 'about.md' },
              { cmd: 'cat experience.json',   icon: '📋', color: 'y',  label: 'experience.json' },
              { cmd: 'cat skills.txt',        icon: '📊', color: 'c',  label: 'skills.txt' },
              { cmd: 'cat talks.log',         icon: '🎤', color: 'p',  label: 'talks.log' },
              { cmd: 'cat contact.sh',        icon: '📞', color: 'o',  label: 'contact.sh' },
            ].map(({ cmd, icon, label }) => (
              <div
                key={cmd}
                className="tp-ft-item tp-ft-i1"
                onClick={(e) => { e.stopPropagation(); handleSidebarClick(cmd, e.currentTarget); }}
              >
                <span className="icon">{icon}</span>
                <span>{label}</span>
              </div>
            ))}

            <div className="tp-ft-item tp-ft-dir tp-ft-i1" style={{ marginTop: '4px' }}>
              <span className="icon">▾</span><span>projects/</span>
            </div>
            <div
              className="tp-ft-item tp-ft-i2"
              onClick={(e) => { e.stopPropagation(); handleSidebarClick('cat projects/groupcode.md', e.currentTarget); }}
            >
              <span className="icon">🔧</span><span>groupcode.md</span>
            </div>

            <div className="tp-ft-item tp-ft-dir tp-ft-i1" style={{ marginTop: '4px' }}>
              <span className="icon">▸</span><span>config/</span>
            </div>

            <div className="tp-ft-item tp-ft-divider" style={{ marginTop: '8px' }}>
              <span className="icon" style={{ color: '#8b949e' }}>⌘</span>
              <span style={{ color: '#8b949e', fontSize: '11px' }}>COMMANDS</span>
            </div>
            {[
              'help', 'whoami', 'ls -la', 'uname -a', 'neofetch', 'clear',
            ].map((cmd) => (
              <div
                key={cmd}
                className="tp-ft-item tp-ft-i1"
                style={{ color: '#8b949e', fontSize: '11px' }}
                onClick={(e) => { e.stopPropagation(); runCmd(cmd); if (inputRef.current) inputRef.current.focus(); }}
              >
                <span className="icon">$</span>
                <span>{cmd}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div className="tp-terminal">
          <div ref={outputRef} className="tp-output"></div>
          <div className="tp-input-area">
            <div className="tp-prompt">
              <span className="user">chandan</span>
              <span className="at">@</span>
              <span className="host">portfolio</span>
              <span className="colon">:</span>
              <span className="path">{currentPath}</span>
              <span className="dollar"> $ </span>
            </div>
            <input
              ref={inputRef}
              className="tp-cli-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type a command or click a file..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="tp-statusbar">
        <div className="tp-sb-item">NORMAL</div>
        <div className="tp-sb-item blue">main</div>
        <div className="tp-sb-item"><span className="g">✓</span> up to date</div>
        <div className="tp-sb-item">portfolio/</div>
        <div className="tp-sb-item">UTF-8</div>
        <div className="tp-sb-item right">{sbClock}</div>
        <div className="tp-sb-item right">bash 5.2.0</div>
      </div>

    </div>
  );
};

export default TerminalPortfolio;
