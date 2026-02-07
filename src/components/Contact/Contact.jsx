import './Contact.css'

const Contact = () => {
  return (
    <section id="contact" className="contact">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Contact</h2>
          <p>Get in touch with me</p>
        </div>

        <div className="row mt-1">
          <div className="col-lg-4">
            <div className="info">
              <div className="address">
                <i className="bx bx-location-plus"></i>
                <h4>Location:</h4>
                <p>Kathmandu, Nepal</p>
              </div>

              <div className="email">
                <i className="bx bx-envelope"></i>
                <h4>Email:</h4>
                <p>contact@chandanbhagat.com.np</p>
              </div>

              <div className="social-links mt-3">
                <a href="https://twitter.com/chandangbhagat" className="twitter" target="_blank" rel="noreferrer">
                  <i className="bx bxl-twitter"></i>
                </a>
                <a href="https://facebook.com/thechandanbhagat" className="facebook" target="_blank" rel="noreferrer">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href="https://instagram.com/thechandanbhagat" className="instagram" target="_blank" rel="noreferrer">
                  <i className="bx bxl-instagram"></i>
                </a>
                <a href="https://linkedin.com/in/guptac" className="linkedin" target="_blank" rel="noreferrer">
                  <i className="bx bxl-linkedin"></i>
                </a>
                <a href="https://github.com/thechandanbhagat" className="github" target="_blank" rel="noreferrer">
                  <i className="bx bxl-github"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-8 mt-5 mt-lg-0">
            <div className="info">
              <p>
                Feel free to reach out to me for consulting, training, or collaboration opportunities. 
                I'm always open to discussing new projects and innovative ideas.
              </p>
              <p className="mt-3">
                <strong>Available for:</strong>
              </p>
              <ul>
                <li>Cloud Architecture Consulting</li>
                <li>Software Development Projects</li>
                <li>Training & Workshops</li>
                <li>Technical Speaking Engagements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact