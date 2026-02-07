export default function Facts() {
  const facts = [
    { number: '10+', title: 'Years Experience', icon: 'bx bx-time-five' },
    { number: '50+', title: 'Projects Completed', icon: 'bx bx-check-circle' },
    { number: '100+', title: 'Happy Clients', icon: 'bx bx-happy-beaming' },
    { number: '24/7', title: 'Support', icon: 'bx bx-support' },
  ]

  const services = [
    { icon: 'bx bxs-time-five', title: 'Full Time', desc: 'Dedicated development and support', aos: 'fade-right' },
    { icon: 'bx bxs-timer', title: 'Part Time', desc: 'Flexible engagement model', aos: 'fade-up' },
    { icon: 'bx bxs-user-voice', title: 'Consultant', desc: 'Technical strategy & architecture', aos: 'fade-up' },
    { icon: 'bx bxs-graduation', title: 'Trainer', desc: 'Knowledge transfer & mentoring', aos: 'fade-left' },
  ]

  return (
    <section id="facts" className="facts">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-title">
          <h2>Services &amp; Expertise</h2>
        </div>

        <div className="cards-grid">
          {facts.map((fact, i) => (
            <div className="fact-card" data-aos="zoom-in" key={i}>
              <div className="fact-number">{fact.number}</div>
              <div className="fact-title">{fact.title}</div>
              <div className="fact-icon">
                <i className={fact.icon}></i>
              </div>
            </div>
          ))}
        </div>

        <div className="services-container">
          {services.map((svc, i) => (
            <div className="service-box" data-aos={svc.aos} key={i}>
              <div className="service-icon">
                <i className={svc.icon}></i>
              </div>
              <h3>{svc.title}</h3>
              <p>{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
