import React from 'react';
import { Link } from 'react-router-dom';
import { getNavigation } from '../utils/data';

const Header = () => {
  const navigation = getNavigation();


  const isPageRoute = (href) => {
    return href === '/portfolio' || href === '/groupcode';
  };

  return (
    <>
      <button type="button" className="mobile-nav-toggle d-xl-none bi bi-list"></button>
      <header id="header" className="d-flex flex-column justify-content-center">
        <nav id="navbar" className="navbar nav-menu">
          <ul>
            {navigation.map((navItem, index) => (
              <li key={index}>
                {isPageRoute(navItem.href) ? (
                  <Link to={navItem.href} className="nav-link">
                    {navItem.isImage ? (
                      <>
                        <img 
                          src={navItem.icon} 
                          width="24" 
                          height="24" 
                          alt={navItem.label} 
                          style={{marginRight: '8px'}}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <i className="bx bx-code-block" style={{display: 'none', marginRight: '8px'}}></i>
                      </>
                    ) : (
                      <i className={navItem.icon}></i>
                    )}
                    <span>{navItem.label}</span>
                  </Link>
                ) : (
                  <a href={navItem.href} className="nav-link scrollto">
                    {navItem.isImage ? (
                      <>
                        <img 
                          src={navItem.icon} 
                          width="24" 
                          height="24" 
                          alt={navItem.label} 
                          style={{marginRight: '8px'}}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <i className="bx bx-code-block" style={{display: 'none', marginRight: '8px'}}></i>
                      </>
                    ) : (
                      <i className={navItem.icon}></i>
                    )}
                    <span>{navItem.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;