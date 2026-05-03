import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Facts from './components/Facts';
import Skills from './components/Skills';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FixedButtons from './components/FixedButtons';
import Preloader from './components/Preloader';
import Portfolio from './pages/Portfolio';
import GroupCode from './pages/GroupCode';
import TerminalPortfolio from './pages/TerminalPortfolio';

// @group LegacyHome : Original multi-section home (kept for /classic route)
const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <main id="main">
        <About />
        <Facts />
        <Skills />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <FixedButtons />
    </>
  );
};

function App() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    // Initialize other scripts
    const initializeScripts = () => {
      // Mobile nav toggle
      const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
      if (mobileNavToggleBtn) {
        mobileNavToggleBtn.addEventListener('click', () => {
          document.querySelector('body').classList.toggle('mobile-nav-active');
        });
      }

      // Navbar links active state on scroll
      const navbarlinks = document.querySelectorAll('#navbar .nav-link');
      const navbarlinksActive = () => {
        let position = window.scrollY + 200;
        navbarlinks.forEach(navbarlink => {
          if (!navbarlink.hash) return;
          let section = document.querySelector(navbarlink.hash);
          if (!section) return;
          if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
            navbarlink.classList.add('active');
          } else {
            navbarlink.classList.remove('active');
          }
        });
      };
      window.addEventListener('load', navbarlinksActive);
      document.addEventListener('scroll', navbarlinksActive);

      // Scrollto links
      const scrollto = (el) => {
        const element = document.querySelector(el);
        if (!element) return;
        let elementPos = element.offsetTop;
        window.scrollTo({
          top: elementPos,
          behavior: 'smooth'
        });
      };

      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          if (link.hash) {
            e.preventDefault();
            scrollto(link.hash);
          }
        });
      });

      // Back to top button
      const backtotop = document.querySelector('.back-to-top');
      if (backtotop) {
        const toggleBacktotop = () => {
          if (window.scrollY > 100) {
            backtotop.classList.add('active');
          } else {
            backtotop.classList.remove('active');
          }
        };
        window.addEventListener('load', toggleBacktotop);
        document.addEventListener('scroll', toggleBacktotop);
      }

      // Theme toggle
      const themeToggle = document.querySelector('.theme-toggle-btn');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          document.body.classList.toggle('dark-theme');
          const icon = themeToggle.querySelector('i');
          if (document.body.classList.contains('dark-theme')) {
            icon.className = 'bx bx-sun';
          } else {
            icon.className = 'bx bx-moon';
          }
        });
      }

      // Preloader
      const preloader = document.querySelector('#preloader');
      if (preloader) {
        window.addEventListener('load', () => {
          preloader.remove();
        });
      }
    };

    initializeScripts();

    // Cleanup function
    return () => {
      // Remove event listeners if needed
    };
  }, []);

  return (
    <div className="App">
      <Preloader />
      <Router>
        <Routes>
          <Route path="/" element={<TerminalPortfolio />} />
          <Route path="/classic" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/groupcode" element={<GroupCode />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;