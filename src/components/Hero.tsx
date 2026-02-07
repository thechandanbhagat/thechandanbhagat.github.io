import { useEffect, useRef } from 'react'
import Typed from 'typed.js'

export default function Hero() {
  const introRef = useRef(null)
  const sanskritRef = useRef(null)

  useEffect(() => {
    const introTyped = new Typed(introRef.current, {
      strings: [
        "I'm a Software Engineer",
        "I'm a Cloud Consultant",
        "I'm a Freelancer",
        "I'm a Trainer",
        "I'm a Lecturer",
        "and most of all",
        "I'm a Learner",
      ],
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    })

    const sanskritTyped = new Typed(sanskritRef.current, {
      strings: [
        'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत:।',
        'अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्।',
        'परित्राणाय साधूनां विनाशाय च दुष्कृताम्।',
        'धर्मसंस्थापनार्थाय सम्भवामि युगे युगे।',
      ],
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 5000,
    })

    return () => {
      introTyped.destroy()
      sanskritTyped.destroy()
    }
  }, [])

  return (
    <section id="hero" className="d-flex flex-column justify-content-center">
      <div className="container-fluid" data-aos="zoom-in" data-aos-delay="100">
        <h1>Chandan Gupta Bhagat</h1>
        <p>
          <span ref={introRef} className="typed"></span>
        </p>
        <div className="social-links">
          <a href="https://twitter.com/chandangbhagat" className="twitter" target="_blank" rel="noreferrer">
            <i className="bx bxl-twitter bx-tada-hover"></i>
          </a>
          <a href="https://facebook.com/thechandanbhagat" className="facebook" target="_blank" rel="noreferrer">
            <i className="bx bxl-facebook bx-tada-hover"></i>
          </a>
          <a href="https://instagram.com/thechandanbhagat" className="instagram" target="_blank" rel="noreferrer">
            <i className="bx bxl-instagram bx-tada-hover"></i>
          </a>
          <a href="skype:chandan.bhagat.msp" className="google-plus" target="_blank" rel="noreferrer">
            <i className="bx bxl-skype bx-tada-hover"></i>
          </a>
          <a href="https://linkedin.com/in/guptac" className="linkedin" target="_blank" rel="noreferrer">
            <i className="bx bxl-linkedin bx-tada-hover"></i>
          </a>
          <a href="https://github.com/thechandanbhagat" className="linkedin" target="_blank" rel="noreferrer">
            <i className="bx bxl-github bx-tada-hover"></i>
          </a>
        </div>
        <p>
          <span ref={sanskritRef} className="typed"></span>
        </p>
      </div>
    </section>
  )
}
