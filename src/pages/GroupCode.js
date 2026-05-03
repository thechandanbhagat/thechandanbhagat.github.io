import React, { useState, useEffect } from 'react';
import { getGroupCodeData } from '../utils/data';
import './GroupCode.css';

const GroupCode = () => {
  const groupCodeData = getGroupCodeData();
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    // Initialize particles effect if needed
    // This would be similar to the original particles.js implementation
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="groupcode-page">
      {/* Header */}
      <header className="groupcode-header">
        <div className="container header-content">
          <div className="logo">
            <img 
              src={groupCodeData.logo} 
              alt="Group Code Logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline';
              }}
            />
            <i className="bx bx-code-block" style={{display: 'none', fontSize: '40px', marginRight: '12px'}}></i>
            <h1>{groupCodeData.title}</h1>
          </div>
          <nav>
            <ul>
              <li><a href="#features"><i className="fas fa-star"></i> Features</a></li>
              <li><a href="#installation"><i className="fas fa-download"></i> Installation</a></li>
              <li><a href="#usage"><i className="fas fa-code"></i> Usage</a></li>
              <li><a href="#supported-languages"><i className="fas fa-globe"></i> Languages</a></li>
              <li><a href="#faq"><i className="fas fa-question-circle"></i> FAQ</a></li>
            </ul>
          </nav>
          <div className="notification-badge">
            <span>New</span>
            <div className="pulse"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Navigate Code by Functionality, Not Just Files</h1>
            <p>{groupCodeData.description}</p>
            <div className="cta-buttons">
              <a 
                href={groupCodeData.installUrl} 
                className="btn btn-primary" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-download"></i> Install Extension
              </a>
              <a href="#installation" className="btn btn-secondary">
                <i className="fas fa-play"></i> Learn More
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="code-preview">
              <div className="code-header">
                <div className="code-buttons">
                  <span className="code-button red"></span>
                  <span className="code-button yellow"></span>
                  <span className="code-button green"></span>
                </div>
                <span className="code-title">example.js</span>
              </div>
              <div className="code-content">
                <pre><code>{`// @group authentication
function login(user, pass) {
  return authenticate(user, pass);
}

// @group database
function saveUser(userData) {
  return db.save(userData);
}

// @group authentication  
function logout() {
  clearSession();
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            {groupCodeData.features?.map((feature, index) => (
              <div key={index} className="feature-card" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="installation section-bg">
        <div className="container">
          <h2>Installation</h2>
          <div className="installation-steps">
            {groupCodeData.installation?.steps?.map((step, index) => (
              <div key={index} className="step" data-aos="fade-right" data-aos-delay={index * 100}>
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <div className="step-icon">
                    <i className={step.icon}></i>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Section */}
      <section id="usage" className="usage">
        <div className="container">
          <h2>How to Use</h2>
          <div className="usage-examples">
            {groupCodeData.usage?.examples?.map((example, index) => (
              <div key={index} className="usage-example" data-aos="fade-up" data-aos-delay={index * 100}>
                <h3>{example.language} Example</h3>
                <p>{example.description}</p>
                <div className="code-example">
                  <pre><code>{example.code}</code></pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section id="supported-languages" className="supported-languages section-bg">
        <div className="container">
          <h2>Supported Languages</h2>
          <div className="languages-grid">
            {groupCodeData.supportedLanguages?.map((language, index) => (
              <div key={index} className="language-card" data-aos="zoom-in" data-aos-delay={index * 50}>
                <div className="language-icon">
                  <i className={language.icon}></i>
                </div>
                <h3>{language.name}</h3>
                <p className="language-comment">{language.comment}</p>
                <div className="language-extensions">
                  {language.extensions.map((ext, extIndex) => (
                    <span key={extIndex} className="extension">.{ext}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {groupCodeData.faq?.map((item, index) => (
              <div key={index} className="faq-item" data-aos="fade-up" data-aos-delay={index * 100}>
                <button 
                  className={`faq-question ${openFAQ === index ? 'active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  {item.question}
                  <i className={`fas fa-chevron-${openFAQ === index ? 'up' : 'down'}`}></i>
                </button>
                <div className={`faq-answer ${openFAQ === index ? 'open' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Transform your coding experience with Group Code today!</p>
          <div className="cta-buttons">
            <a 
              href={groupCodeData.installUrl} 
              className="btn btn-primary" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-download"></i> Install from Marketplace
            </a>
            <a 
              href={groupCodeData.githubUrl} 
              className="btn btn-secondary" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github"></i> View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="groupcode-footer">
        <div className="container">
          <p>&copy; 2024 Group Code. Created by <a href="/">Chandan Bhagat</a></p>
        </div>
      </footer>

    </div>
  );
};

export default GroupCode;