import { useEffect } from 'react'
import AOS from 'aos'
import Header from '../components/Header'
import PortfolioGrid from '../components/PortfolioGrid'
import ImportantLinks from '../components/ImportantLinks'
import FixedButtons from '../components/FixedButtons'
import Preloader from '../components/Preloader'

const navItems = [
  { href: '/', icon: <i className="bx bx-user"></i>, label: 'Profile' },
  { href: '#portfolio', icon: <i className="bx bx-user-voice"></i>, label: 'Portfolio and Mentoring' },
  { href: '#links', icon: <i className="bx bx-file-blank"></i>, label: 'Important Links' },
  {
    href: '/groupcode',
    icon: <img src="/groupcode/compass-icon.svg" width="24" height="24" alt="Group Code" style={{ marginRight: '8px' }} />,
    label: 'Group Code',
  },
]

export default function PortfolioPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    })
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Preloader />
      <Header navItems={navItems} />
      <main id="main" style={{ marginLeft: 0 }}>
        <PortfolioGrid />
        <ImportantLinks />
      </main>
      <FixedButtons />
    </>
  )
}
