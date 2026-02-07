import { useState, useEffect } from 'react'
import PortfolioModal from './PortfolioModal'

export default function PortfolioGrid() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [activeFilter, setActiveFilter] = useState('*')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then(res => res.json())
      .then(data => {
        const sorted = data.portfolioItems.sort((a, b) =>
          new Date(b.date || '1900-01-01') - new Date(a.date || '1900-01-01')
        )
        setItems(sorted)

        const cats = new Set()
        sorted.forEach(item => cats.add(item.category.toLowerCase()))
        setCategories([...cats])
      })
      .catch(err => console.error('Error loading portfolio:', err))
  }, [])

  const filteredItems = activeFilter === '*'
    ? items
    : items.filter(item => item.category.toLowerCase() === activeFilter)

  return (
    <section id="portfolio" className="portfolio section-bg">
      <div className="container">
        <div className="section-title">
          <h2>Portfolio</h2>
          <p>Explore my recent projects and achievements</p>
        </div>

        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center">
            <div className="portfolio-filters-container">
              <ul id="portfolio-filters">
                <li
                  className={activeFilter === '*' ? 'filter-active' : ''}
                  onClick={() => setActiveFilter('*')}
                >
                  All
                </li>
                {categories.map(cat => (
                  <li
                    key={cat}
                    className={activeFilter === cat ? 'filter-active' : ''}
                    onClick={() => setActiveFilter(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row" id="portfolio-grid">
            {filteredItems.map((item, index) => (
              <div
                className={`col-lg-4 col-md-6 portfolio-item filter-${item.category.toLowerCase()}`}
                key={index}
              >
                <div className="portfolio-wrap">
                  <img src={`/${item.images[0]}`} className="img-fluid" alt={item.title} />
                  <div className="portfolio-info">
                    <h4>{item.program}</h4>
                    <h5>{item.title}</h5>
                    <p>{item.date}</p>
                    <div className="portfolio-links">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedItem(item)
                        }}
                        className="portfolio-details-link"
                      >
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <PortfolioModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  )
}
