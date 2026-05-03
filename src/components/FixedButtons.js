import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FixedButtons = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="fixed-buttons-container">
      {isHomePage && (
        <Link to="/portfolio" className="portfolio-btn d-flex align-items-center justify-content-center">
          <i className="bx bx-briefcase-alt-2"></i>
        </Link>
      )}
      {!isHomePage && (
        <Link to="/" className="home-btn d-flex align-items-center justify-content-center">
          <i className="bx bx-home"></i>
        </Link>
      )}
      <button className="theme-toggle-btn d-flex align-items-center justify-content-center">
        <i className="bx bx-moon"></i>
      </button>
      <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="back-to-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </button>
    </div>
  );
};

export default FixedButtons;