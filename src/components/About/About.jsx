import './About.css'

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container-fluid" data-aos="fade-up">
        <div className="about-wrapper">
          <div className="about-intro" data-aos="fade-up">
            <h2 className="section-title">About Me</h2>
            <p className="lead-text">
              With over 10 years of experience in the IT industry, I have honed my skills predominantly in Microsoft technologies. 
              My expertise primarily revolves around C#, Node.js, Azure, and GitHub, among others.
            </p>
          </div>

          <div className="skills-section">
            <div className="skills-container" data-aos="fade-up" data-aos-delay="100">
              <h3 className="skills-title"><i className="fas fa-star"></i> Core Competencies</h3>
              <div className="skills-grid">
                <div className="skill-card"> 
                  <h4>C#</h4>
                  <p>I have a deep understanding of C#, enabling me to develop a wide array of applications, from desktop solutions to web-based services. 
                  My work emphasizes creating robust, scalable, and maintainable code tailored to meet specific client requirements.</p>
                </div>
                <div className="skill-card">
                  <h4>Node.js</h4>
                  <p>Utilizing the power of JavaScript on the server side, I have built high-performance, real-time applications with Node.js. 
                  My projects range from developing simple APIs to architecting complex, data-driven platforms.</p>
                </div>
                <div className="skill-card">
                  <h4>Azure</h4>
                  <p>My proficiency with Microsoft Azure includes deploying, managing, and optimizing cloud-based solutions. 
                  I leverage Azure's extensive services for hosting, storage, networking, and security, ensuring high availability and reliability.</p>
                </div>
                <div className="skill-card">
                  <h4>GitHub</h4>
                  <p>As an active user of GitHub, I manage code repositories, collaborate with other developers, and implement version control strategies. 
                  This helps streamline the development process, facilitating continuous integration and delivery.</p>
                </div>
              </div>
            </div>
          
            <div className="skills-container" data-aos="fade-up" data-aos-delay="200">
              <h3 className="skills-title"><i className="fas fa-plus-circle"></i> Additional Technical Skills</h3>
              <div className="skills-grid">
                <div className="skill-card">
                  <h4><i className="fas fa-infinity"></i> DevOps</h4>
                  <p>I am well-versed in DevOps practices, particularly with Azure DevOps and GitHub Actions. 
                  I implement continuous integration/continuous deployment (CI/CD) pipelines to automate the development lifecycle, improving efficiency and reducing errors.</p>
                </div>
                <div className="skill-card">
                  <h4>Mobile Development</h4>
                  <p>I am experienced in building mobile applications using Xamarin and Unity. 
                  This includes developing cross-platform solutions and creating interactive, user-friendly mobile experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About