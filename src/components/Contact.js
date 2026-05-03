import React from 'react';
import { getContactData } from '../utils/data';

const Contact = () => {
  const contactData = getContactData();

  return (
    <section id="contact" className="contact">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-title">
          <h2>{contactData.title || "Get in Touch"}</h2>
          <p>{contactData.subtitle || "Feel free to reach out through any of these channels"}</p>
        </div>
    
        <div className="contact-wrapper">
          <div className="contact-info-container">
            {contactData.contactMethods?.map((method, index) => (
              <div 
                key={index} 
                className="contact-card" 
                data-aos="fade-right" 
                data-aos-delay={index * 100}
              >
                <div className="icon-box">
                  <i className={method.icon}></i>
                </div>
                <div className="contact-details">
                  <h4>{method.title}</h4>
                  {method.link ? (
                    <a href={method.link}>{method.value}</a>
                  ) : (
                    <p>{method.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
    
          <div className="social-links-container">
            <h3>Connect on Social Media</h3>
            <div className="social-grid">
              {contactData.socialMedia?.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  className="social-card" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <i className={social.icon}></i>
                  <span>{social.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;