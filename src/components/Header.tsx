import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

export interface NavItem {
  href: string
  icon: ReactNode
  label: string
}

interface HeaderProps {
  navItems: NavItem[]
}

export default function Header({ navItems }: HeaderProps) {
  const location = useLocation()
  const [mobileNavActive, setMobileNavActive] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY + 200
      const sections = document.querySelectorAll('section[id]')
      sections.forEach(section => {
        const el = section as HTMLElement
        if (position >= el.offsetTop && position <= el.offsetTop + el.offsetHeight) {
          setActiveSection('#' + el.id)
        }
      })
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location])

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href) as HTMLElement | null
      if (el) {
        window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
      }
      setMobileNavActive(false)
    } else {
      setMobileNavActive(false)
    }
  }

  useEffect(() => {
    if (mobileNavActive) {
      document.body.classList.add('mobile-nav-active')
    } else {
      document.body.classList.remove('mobile-nav-active')
    }
  }, [mobileNavActive])

  return (
    <>
      <button
        type="button"
        className={`mobile-nav-toggle d-xl-none ${mobileNavActive ? 'bi bi-x' : 'bi bi-list'}`}
        onClick={() => setMobileNavActive(prev => !prev)}
      />

      <header id="header" className="d-flex flex-column justify-content-center">
        <nav id="navbar" className="navbar nav-menu">
          <ul>
            {navItems.map((item, index) => {
              const isActive = item.href.startsWith('#')
                ? activeSection === item.href
                : location.pathname === item.href

              if (item.href.startsWith('#') || item.href.startsWith('/groupcode')) {
                return (
                  <li key={index}>
                    <a
                      href={item.href}
                      className={`nav-link scrollto${isActive ? ' active' : ''}`}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </li>
                )
              }

              return (
                <li key={index}>
                  <Link
                    to={item.href}
                    className={`nav-link scrollto${isActive ? ' active' : ''}`}
                    onClick={() => setMobileNavActive(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>
    </>
  )
}
