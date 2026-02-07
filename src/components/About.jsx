export default function About() {
  return (
    <section id="about" className="about">
      <div className="container-fluid" data-aos="fade-up">
        <div className="about-wrapper">
          {/* Introduction */}
          <div className="about-intro" data-aos="fade-up">
            <h2 className="section-title">About Me</h2>
            <p className="lead-text">
              With over 10 years of experience in the IT industry, I have honed my skills predominantly in Microsoft technologies. My expertise primarily revolves around C#, Node.js, Azure, and GitHub, among others.
            </p>
          </div>

          <div className="skills-section">
            {/* Core Competencies */}
            <div className="skills-container" data-aos="fade-up" data-aos-delay="100">
              <h3 className="skills-title"><i className="fas fa-star"></i> Core Competencies</h3>
              <div className="skills-grid">
                <div className="skill-card">
                  <h4>C#</h4>
                  <p>I have a deep understanding of C#, enabling me to develop a wide array of applications, from desktop solutions to web-based services. My work emphasizes creating robust, scalable, and maintainable code tailored to meet specific client requirements.</p>
                </div>
                <div className="skill-card">
                  <h4>Node.js</h4>
                  <p>Utilizing the power of JavaScript on the server side, I have built high-performance, real-time applications with Node.js. My projects range from developing simple APIs to architecting complex, data-driven platforms.</p>
                </div>
                <div className="skill-card">
                  <h4>Azure</h4>
                  <p>My proficiency with Microsoft Azure includes deploying, managing, and optimizing cloud-based solutions. I leverage Azure&apos;s extensive services for hosting, storage, networking, and security, ensuring high availability and reliability.</p>
                </div>
                <div className="skill-card">
                  <h4>GitHub</h4>
                  <p>As an active user of GitHub, I manage code repositories, collaborate with other developers, and implement version control strategies. This helps streamline the development process, facilitating continuous integration and delivery.</p>
                </div>
              </div>
            </div>

            {/* Additional Technical Skills */}
            <div className="skills-container" data-aos="fade-up" data-aos-delay="200">
              <h3 className="skills-title"><i className="fas fa-plus-circle"></i> Additional Technical Skills</h3>
              <div className="skills-grid">
                <div className="skill-card">
                  <h4><i className="fas fa-infinity"></i> Devops</h4>
                  <p>I am well-versed in DevOps practices, particularly with Azure DevOps and GitHub Actions. I implement continuous integration/continuous deployment (CI/CD) pipelines to automate the development lifecycle, improving efficiency and reducing errors.</p>
                </div>
                <div className="skill-card">
                  <h4>Mobile Development</h4>
                  <p>I am experienced in building mobile applications using Xamarin and Unity. This includes developing cross-platform solutions and creating interactive, user-friendly mobile experiences.</p>
                </div>
                <div className="skill-card">
                  <h4>IoT and Machine Learning</h4>
                  <p>In my free time, I delve into research and development in IoT and machine learning, exploring new technologies and their applications. This ongoing exploration helps me stay at the forefront of technological advancements and innovate in my projects.</p>
                </div>
              </div>
            </div>

            {/* Community Involvement */}
            <div className="skills-container" data-aos="fade-up" data-aos-delay="300">
              <h3 className="skills-title"><i className="fas fa-users"></i> Community Involvement</h3>
              <div className="skills-grid">
                <div className="skill-card">
                  <h4>Community Engagement</h4>
                  <p>As an active member of the &quot;Nepal Cloud Professionals&quot; community, I regularly share my knowledge and insights. I participate in discussions, present at meetups, and contribute to collaborative learning within the community.</p>
                </div>
                <div className="skill-card">
                  <h4>Teaching and Mentorship</h4>
                  <p>I am also a part-time lecturer at several colleges, teaching various subjects related to my expertise. I find great satisfaction in mentoring students and guiding them through their academic projects, helping to shape the next generation of IT professionals.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="lead-text">
            By combining my technical skills with a passion for teaching and community involvement, I strive to make a meaningful impact in the IT industry. Whether working on cutting-edge projects, sharing knowledge, or mentoring aspiring developers, I am dedicated to continuous learning and professional growth.
          </p>
        </div>

        <div className="profile-container" data-aos="fade-up">
          <div className="profile-card">
            <div className="profile-image">
              <img src="/assets/img/profile-img.jpg" className="img-fluid" alt="Profile Photo" />
              <div className="profile-overlay"></div>
            </div>

            <div className="profile-content">
              <h3 className="profile-title">Software Engineer, Trainer &amp; Cloud Consultant</h3>

              <div className="profile-info">
                <div className="info-group">
                  <div className="info-item">
                    <i className="fas fa-globe"></i>
                    <strong>Website</strong>
                    <a href="https://chandanbhagat.com.np" target="_blank" rel="noreferrer">chandanbhagat.com.np</a>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <strong>Location</strong>
                    <span>London, UK</span>
                  </div>
                </div>

                <div className="info-group">
                  <div className="info-item">
                    <i className="fas fa-graduation-cap"></i>
                    <strong>Education</strong>
                    <span>Bachelors in Computer Engineering</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-envelope"></i>
                    <strong>Email</strong>
                    <a href="mailto:chandan.bhagat@outlook.com">chandan.bhagat@outlook.com</a>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-briefcase"></i>
                    <strong>Consultancy</strong>
                    <span className="status available">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
