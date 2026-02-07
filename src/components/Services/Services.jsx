import './Services.css'

const Services = () => {
  const technologies = [
    {
      icon: 'bx bxl-microsoft',
      title: 'C# & .NET',
      description: '.NET Core, ASP.NET, Entity Framework, and modern .NET development'
    },
    {
      icon: 'bx bxl-nodejs',
      title: 'Node.js',
      description: 'Server-side JavaScript, Express, API development, and real-time applications'
    },
    {
      icon: 'bx bxs-cloud',
      title: 'Microsoft Azure',
      description: 'Cloud architecture, Azure Functions, App Services, DevOps, and more'
    },
    {
      icon: 'bx bxl-react',
      title: 'React & Angular',
      description: 'Modern frontend frameworks for building dynamic web applications'
    },
    {
      icon: 'bx bxl-docker',
      title: 'Docker & Kubernetes',
      description: 'Container orchestration, microservices, and cloud-native applications'
    },
    {
      icon: 'bx bxl-github',
      title: 'GitHub & DevOps',
      description: 'CI/CD pipelines, GitHub Actions, Azure DevOps, and automation'
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Tools & Technologies</h2>
          <p>Technologies and tools I work with on a regular basis</p>
        </div>

        <div className="row">
          {technologies.map((tech, index) => (
            <div key={index} className="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay={index * 100}>
              <div className="icon-box">
                <div className="icon"><i className={tech.icon}></i></div>
                <h4>{tech.title}</h4>
                <p>{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services