import React from 'react';

const Facts = () => {
  return (
    <section id="facts" className="facts">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-title">
          <h2>Services & Expertise</h2>
        </div>
    
        <div className="cards-grid">
          <div className="fact-card" data-aos="zoom-in">
            <div className="fact-number">10+</div>
            <div className="fact-title">Years Experience</div>
            <div className="fact-icon">
              <i className="bx bx-time-five"></i>
            </div>
          </div>
    
          <div className="fact-card" data-aos="zoom-in">
            <div className="fact-number">50+</div>
            <div className="fact-title">Projects Completed</div>
            <div className="fact-icon">
              <i className="bx bx-check-circle"></i>
            </div>
          </div>
    
          <div className="fact-card" data-aos="zoom-in">
            <div className="fact-number">100+</div>
            <div className="fact-title">Happy Clients</div>
            <div className="fact-icon">
              <i className="bx bx-happy-beaming"></i>
            </div>
          </div>
    
          <div className="fact-card" data-aos="zoom-in">
            <div className="fact-number">24/7</div>
            <div className="fact-title">Support</div>
            <div className="fact-icon">
              <i className="bx bx-support"></i>
            </div>
          </div>
        </div>
    
        <div className="services-container">
          <div className="service-box" data-aos="fade-right">
            <div className="service-icon">
              <i className="bx bxs-time-five"></i>
            </div>
            <h3>Full Time</h3>
            <p>Dedicated development and support</p>
          </div>
    
          <div className="service-box" data-aos="fade-up">
            <div className="service-icon">
              <i className="bx bxs-timer"></i>
            </div>
            <h3>Part Time</h3>
            <p>Flexible engagement model</p>
          </div>
    
          <div className="service-box" data-aos="fade-up">
            <div className="service-icon">
              <i className="bx bxs-user-voice"></i>
            </div>
            <h3>Consultant</h3>
            <p>Technical strategy & architecture</p>
          </div>
    
          <div className="service-box" data-aos="fade-left">
            <div className="service-icon">
              <i className="bx bxs-graduation"></i>
            </div>
            <h3>Trainer</h3>
            <p>Knowledge transfer & mentoring</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facts;