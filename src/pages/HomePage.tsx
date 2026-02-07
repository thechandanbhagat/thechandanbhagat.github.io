import { useEffect } from 'react'
import AOS from 'aos'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Facts from '../components/Facts'
import Skills from '../components/Skills'
import Resume from '../components/Resume'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import FixedButtons from '../components/FixedButtons'
import Preloader from '../components/Preloader'

const navItems = [
  { href: '#hero', icon: <i className="bx bx-home"></i>, label: 'Home' },
  { href: '/portfolio', icon: <i className="bx bx-briefcase-alt-2"></i>, label: 'Portfolio' },
  { href: '#about', icon: <i className="bx bx-user"></i>, label: 'About' },
  { href: '#resume', icon: <i className="bx bx-file-blank"></i>, label: 'Resume' },
  { href: '#services', icon: <i className="bx bx-server"></i>, label: 'Tool and Technologies I use' },
  { href: '#contact', icon: <i className="bx bx-envelope"></i>, label: 'Contact' },
  {
    href: '/groupcode',
    icon: <img src="/groupcode/compass-icon.svg" width="24" height="24" alt="Group Code" style={{ marginRight: '8px' }} />,
    label: 'Group Code',
  },
]

export default function HomePage() {
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
  )
}
