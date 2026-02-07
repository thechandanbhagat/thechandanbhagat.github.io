import { useState } from 'react'
import './Header.css'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <button 
        type="button" 
        className={`mobile-nav-toggle ${mobileMenuOpen ? 'bi-x' : 'bi-list'}`}
        onClick={toggleMobileMenu}
      />
      
      <header id="header" className={`d-flex flex-column justify-content-center ${mobileMenuOpen ? 'mobile-nav-active' : ''}`}>
        <nav id="navbar" className="navbar nav-menu">
          <ul>
            <li>
              <a href="#hero" className="nav-link scrollto">
                <i className="bx bx-home"></i> <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#about" className="nav-link scrollto">
                <i className="bx bx-user"></i> <span>About</span>
              </a>
            </li>
            <li>
              <a href="#resume" className="nav-link scrollto">
                <i className="bx bx-file-blank"></i> <span>Resume</span>
              </a>
            </li>
            <li>
              <a href="#services" className="nav-link scrollto">
                <i className="bx bx-server"></i> <span>Technologies</span>
              </a>
            </li>
            <li>
              <a href="#portfolio" className="nav-link scrollto">
                <i className="bx bx-briefcase-alt-2"></i> <span>Portfolio</span>
              </a>
            </li>
            <li>
              <a href="#contact" className="nav-link scrollto">
                <i className="bx bx-envelope"></i> <span>Contact</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}

export default Header