import { useEffect, useRef } from 'react'
import './Hero.css'

const Hero = () => {
  const typedRef = useRef(null);
  
  useEffect(() => {
    // Simple typing effect
    const roles = [
      "I'm a Software Engineer",
      "I'm a Cloud Consultant", 
      "I'm a Freelancer",
      "I'm a Trainer",
      "I'm a Lecturer",
      "and most of all, I'm a Learner"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentRole = roles[roleIndex];
      
      if (!isDeleting && charIndex <= currentRole.length) {
        if (typedRef.current) {
          typedRef.current.textContent = currentRole.substring(0, charIndex);
          charIndex++;
        }
        setTimeout(type, 100);
      } else if (isDeleting && charIndex >= 0) {
        if (typedRef.current) {
          typedRef.current.textContent = currentRole.substring(0, charIndex);
          charIndex--;
        }
        setTimeout(type, 50);
      } else if (!isDeleting && charIndex > currentRole.length) {
        setTimeout(() => {
          isDeleting = true;
          type();
        }, 2000);
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 500);
      }
    };
    
    type();
  }, []);

  return (
    <section id="hero" className="d-flex flex-column justify-content-center">
      <div className="container-fluid" data-aos="zoom-in" data-aos-delay="100">
        <h1>Chandan Gupta Bhagat</h1>
        <p>
          <span ref={typedRef} className="typed"></span>
        </p>
        <div className="social-links">
          <a href="https://twitter.com/chandangbhagat" className="twitter" target="_blank" rel="noreferrer">
            <i className="bx bxl-twitter"></i>
          </a>
          <a href="https://facebook.com/thechandanbhagat" className="facebook" target="_blank" rel="noreferrer">
            <i className="bx bxl-facebook"></i>
          </a>
          <a href="https://instagram.com/thechandanbhagat" className="instagram" target="_blank" rel="noreferrer">
            <i className="bx bxl-instagram"></i>
          </a>
          <a href="skype:chandan.bhagat.msp" className="google-plus" target="_blank" rel="noreferrer">
            <i className="bx bxl-skype"></i>
          </a>
          <a href="https://linkedin.com/in/guptac" className="linkedin" target="_blank" rel="noreferrer">
            <i className="bx bxl-linkedin"></i>
          </a>
          <a href="https://github.com/thechandanbhagat" className="linkedin" target="_blank" rel="noreferrer">
            <i className="bx bxl-github"></i>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero