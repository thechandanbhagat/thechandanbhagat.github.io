export default function Contact() {
  const socialLinks = [
    { href: 'https://twitter.com/chandangbhagat', icon: 'bi bi-twitter', label: 'Twitter', delay: 0 },
    { href: 'https://facebook.com/thechandanbhagat', icon: 'bi bi-facebook', label: 'Facebook', delay: 100 },
    { href: 'https://instagram.com/thechandanbhagat', icon: 'bi bi-instagram', label: 'Instagram', delay: 200 },
    { href: 'skype:chandan.bhagat.msp', icon: 'bi bi-skype', label: 'Skype', delay: 300 },
    { href: 'https://linkedin.com/in/guptac', icon: 'bi bi-linkedin', label: 'LinkedIn', delay: 400 },
    { href: 'https://github.com/thechandanbhagat', icon: 'bi bi-github', label: 'GitHub', delay: 500 },
  ]

  return (
    <section id="contact" className="contact">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-title">
          <h2>Get in Touch</h2>
          <p>Feel free to reach out through any of these channels</p>
        </div>

        <div className="contact-wrapper">
          <div className="contact-info-container">
            <div className="contact-card" data-aos="fade-right">
              <div className="icon-box">
                <i className="bi bi-geo-alt"></i>
              </div>
              <div className="contact-details">
                <h4>Location</h4>
                <p>London, United Kingdom</p>
              </div>
            </div>

            <div className="contact-card" data-aos="fade-right" data-aos-delay="100">
              <div className="icon-box">
                <i className="bi bi-envelope"></i>
              </div>
              <div className="contact-details">
                <h4>Email</h4>
                <a href="mailto:chandan.bhagat@outlook.com">chandan.bhagat@outlook.com</a>
              </div>
            </div>
          </div>

          <div className="social-links-container">
            <h3>Connect on Social Media</h3>
            <div className="social-grid">
              {socialLinks.map((link, i) => (
                <a
                  href={link.href}
                  className="social-card"
                  target="_blank"
                  rel="noreferrer"
                  data-aos="zoom-in"
                  data-aos-delay={link.delay}
                  key={i}
                >
                  <i className={link.icon}></i>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
