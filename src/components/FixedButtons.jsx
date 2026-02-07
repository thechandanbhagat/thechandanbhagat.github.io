import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function FixedButtons() {
  const { isDark, toggleTheme } = useTheme()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [shiftLeft, setShiftLeft] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100
      setShowBackToTop(scrolled)
      setShiftLeft(scrolled)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isHomePage = location.pathname === '/'

  return (
    <div className={`fixed-buttons-container${shiftLeft ? ' shift-left' : ''}`}>
      {isHomePage ? (
        <Link to="/portfolio" className="portfolio-btn d-flex align-items-center justify-content-center">
          <i className="bx bx-briefcase-alt-2"></i>
        </Link>
      ) : (
        <Link to="/" className="portfolio-btn d-flex align-items-center justify-content-center">
          <i className="bx bx-user"></i>
        </Link>
      )}

      <button
        className="theme-toggle-btn d-flex align-items-center justify-content-center"
        onClick={toggleTheme}
      >
        <i className={`bx ${isDark ? 'bx-sun' : 'bx-moon'}`}></i>
      </button>

      <a
        href="#"
        className={`back-to-top d-flex align-items-center justify-content-center${showBackToTop ? ' active' : ''}`}
        onClick={scrollToTop}
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </div>
  )
}
