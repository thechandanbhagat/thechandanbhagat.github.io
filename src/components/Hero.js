import React, { useEffect } from 'react';
import Typed from 'typed.js';
import { getPersonalInfo, getHeroData, getSocialLinks } from '../utils/data';

const Hero = () => {
  const personalInfo = getPersonalInfo();
  const heroData = getHeroData();
  const socialLinks = getSocialLinks();

  useEffect(() => {
    // Initialize Typed.js for intro text
    const introTyped = new Typed('#introtyped', {
      strings: heroData.typedStrings || ["Welcome to my portfolio"],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      loop: true
    });

    // Initialize Typed.js for Sanskrit text (if available)
    let spanTyped = null;
    if (heroData.sanskritQuotes && heroData.sanskritQuotes.length > 0) {
      spanTyped = new Typed('#spantyped', {
        strings: heroData.sanskritQuotes,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
      });
    }

    return () => {
      introTyped.destroy();
      if (spanTyped) spanTyped.destroy();
    };
  }, [heroData]);

  return (
    <section id="hero" className="d-flex flex-column justify-content-center">
      <div className="container-fluid" data-aos="zoom-in" data-aos-delay="100">
        <h1>{personalInfo.name || "Your Name"}</h1>
        <p>
          <span id="introtyped" className="typed"></span>
        </p>
        <div className="social-links">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className={link.className}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={`${link.icon} bx-tada-hover`}></i>
            </a>
          ))}
        </div>
        {heroData.sanskritQuotes && heroData.sanskritQuotes.length > 0 && (
          <p>
            <span id="spantyped" className="typed"></span>
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;