import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Resume from './components/Resume/Resume'
import Services from './components/Services/Services'
import Portfolio from './components/Portfolio/Portfolio'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    // Load portfolio data
    fetch('/data/portfolio.json')
      .then(res => res.json())
      .then(data => setPortfolioData(data.portfolioItems))
      .catch(err => console.error('Error loading portfolio:', err));
  }, []);

  return (
    <div className="App">
      <Header />
      <Hero />
      <main id="main">
        <About />
        <Resume />
        <Services />
        <Portfolio portfolioData={portfolioData} />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
