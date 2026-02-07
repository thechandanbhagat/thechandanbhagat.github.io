export default function Resume() {
  const experiences = [
    {
      title: 'Software Engineer - AE Live',
      period: 'December 2022 - May 2024',
      location: 'London, United Kingdom',
      techTags: ['C#', 'ASP.NET Core', 'Web API', 'Entity Framework', 'WPF', 'XAML', 'Angular', 'TypeScript', 'Azure', 'Kubernetes', 'Docker', 'CI/CD'],
      achievements: [
        'Engineered broadcast graphics solutions using WPF, improving rendering performance by 40%',
        'Developed and maintained scalable ASP.NET Core Web APIs handling 100K+ daily requests',
        'Implemented Kubernetes orchestration reducing deployment time by 60%',
        'Architected cloud-native solutions on Azure optimizing operational costs',
      ],
    },
    {
      title: 'Technical Lead - Amazing Digital',
      period: 'May 2021 - October 2022',
      location: 'Seattle, US (Remote)',
      techTags: ['Team Management', 'Agile', 'Scrum', 'Microservices', 'RESTful APIs', 'Cloud Architecture', 'GitHub Actions', 'IBM Cloud', 'Docker', 'Kubernetes', 'C#', 'Next.Js', 'AWS', 'React'],
      achievements: [
        'Led an 12-member development team across 3 time zones, delivering 5 major projects',
        'Implemented CI/CD pipelines reducing deployment time from 2 hours to 20 minutes',
        'Mentored 12+ developers through code reviews and technical guidance',
        'Automated deployment workflows using GitHub Actions and IBM Cloud',
      ],
    },
    {
      title: 'DevOps/Software Engineer - AgriSync',
      period: 'March 2020 - March 2021',
      location: 'Des Moines, Iowa',
      techTags: ['C#', 'DevOps', 'Shell Scripting', 'Azure Function', 'Container', 'Kubernetes', 'Azure', 'Angular', 'Salesforce'],
      achievements: [
        'Spearheaded DevOps transformation reducing deployment failures by 80%',
        'Built custom GitHub Actions workflows automating deployment for 20+ services',
        'Managed Kubernetes clusters on Azure handling production workloads',
        'Developed Salesforce solutions integrated with .NET Core backend',
      ],
    },
    {
      title: 'Technical Lead - Blue Panda Communications',
      period: 'July 2019 - February 2020',
      location: 'Kathmandu, Nepal',
      techTags: ['Team Management', 'Agile', 'Scrum', 'Microservices', 'RESTful APIs', 'Cloud Architecture', 'C#', 'DevOps', 'Shell Scripting', 'Azure Function', 'Container', 'Kubernetes', 'Azure', 'Angular', 'Salesforce', 'Service Bus', 'Event Grid', 'Event Hub'],
      achievements: [
        'Led technical initiatives across cloud migration projects',
        'Managed Azure resources and Kubernetes clusters',
        'Implemented CI/CD pipelines using Azure DevOps',
      ],
    },
  ]

  const earlierRoleTags = [
    'Team Management', 'Agile', 'Scrum', 'Microservices', 'RESTful APIs', 'Cloud Architecture',
    'C#', 'DevOps', 'Shell Scripting', 'Azure Function', 'Container', 'Kubernetes', 'Azure',
    'Angular', 'Salesforce', 'Service Bus', 'Event Grid', 'Event Hub', 'WPF', 'Windows Forms',
    'ASP.NET Core', 'ASP.NET MVC', 'ASP.NET Web Forms',
  ]

  const earlierRoles = [
    { role: 'Engineering Manager', company: 'Insight Workshop', period: '2018-2019', desc: 'Led .NET development teams and cloud initiatives' },
    { role: 'Software Engineer', company: 'Multiple Organizations', period: '2014-2018', desc: 'Developed solutions using .NET, WPF, and web technologies' },
    { role: 'Co-Founder', company: 'Yorbit Technologies', period: '2013-2017', desc: 'Led IoT and vehicle tracking solutions development' },
  ]

  const sidebarSkills = [
    { title: 'Backend & Cloud', tags: ['.NET Core', 'C#', 'Node.JS', 'Shell Scripting', 'Powershell script', 'Azure', 'Azure Function', 'AWS'] },
    { title: 'DevOps & Tools', tags: ['Kubernetes', 'Docker', 'CI/CD', 'Git', 'Azure Devops', 'SonaQube', 'Jenkins'] },
    { title: 'Frontend', tags: ['Angular', 'TypeScript', 'React', 'Next.JS', 'Lit Framework', 'WPF'] },
  ]

  return (
    <section id="resume" className="resume">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-title">
          <h2>Professional Experience</h2>
          <div className="status-banner">
            <span className="open-badge">Open to Work - Available Immediately</span>
          </div>
        </div>

        <div className="row">
          {/* Main Experience Column */}
          <div className="col-lg-8">
            <div>
              {experiences.map((exp, i) => (
                <div className="resume-item" data-aos="fade-up" key={i}>
                  <h4>{exp.title}</h4>
                  <h5>{exp.period}</h5>
                  <p><em>{exp.location}</em></p>
                  <div className="tech-stack">
                    {exp.techTags.map((tag, j) => (
                      <span className="tech-tag" key={j}>{tag}</span>
                    ))}
                  </div>
                  <ul className="achievements">
                    {exp.achievements.map((ach, j) => (
                      <li key={j}>{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Earlier Roles */}
              <div className="earlier-roles" data-aos="fade-up">
                <h4>Earlier Roles</h4>
                <div className="tech-stack">
                  {earlierRoleTags.map((tag, i) => (
                    <span className="tech-tag" key={i}>{tag}</span>
                  ))}
                </div>
                <ul className="role-list">
                  {earlierRoles.map((role, i) => (
                    <li key={i}>
                      <strong>{role.role}</strong> at {role.company} ({role.period})
                      <br />{role.desc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Skills Sidebar */}
          <div className="col-lg-4">
            <div className="resume-sidebar" data-aos="fade-left">
              <div className="skills-section">
                <h3>Core Expertise</h3>
                {sidebarSkills.map((cat, i) => (
                  <div className="skill-category" key={i}>
                    <h4>{cat.title}</h4>
                    <div className="skill-tags">
                      {cat.tags.map((tag, j) => (
                        <span className="skill-tag" key={j}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="education-section">
                <h3>Education</h3>
                <div className="education-item">
                  <h4>Bachelor in Computer Engineering</h4>
                  <p>IOE, Pulchowk Campus</p>
                  <span>2011 - 2014</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
