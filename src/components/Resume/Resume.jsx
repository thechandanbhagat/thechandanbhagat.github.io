import './Resume.css'

const Resume = () => {
  return (
    <section id="resume" className="resume">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Resume</h2>
          <p>Check out my professional journey and qualifications</p>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <h3 className="resume-title">Summary</h3>
            <div className="resume-item pb-0">
              <h4>Chandan Gupta Bhagat</h4>
              <p><em>Innovative and experienced Software Engineer with 10+ years of expertise in developing robust applications, 
              cloud solutions, and enterprise systems using Microsoft technologies.</em></p>
              <ul>
                <li>Software Engineer & Cloud Consultant</li>
                <li>Freelancer & Trainer</li>
                <li>Microsoft Technologies Specialist</li>
              </ul>
            </div>

            <h3 className="resume-title">Education</h3>
            <div className="resume-item">
              <h4>Bachelor of Computer Engineering</h4>
              <h5>2008 - 2012</h5>
              <p><em>Computer Engineering</em></p>
            </div>
          </div>

          <div className="col-lg-6">
            <h3 className="resume-title">Professional Experience</h3>
            <div className="resume-item">
              <h4>Software Engineer & Trainer</h4>
              <h5>2012 - Present</h5>
              <p><em>Freelancer & Corporate Trainer</em></p>
              <ul>
                <li>Develop and deploy enterprise applications using C#, .NET Core, and Azure</li>
                <li>Conduct training sessions on Azure, DevOps, and Microsoft technologies</li>
                <li>Implement CI/CD pipelines and DevOps best practices</li>
                <li>Build microservices and cloud-native applications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resume