import { useState } from 'react'
import './Portfolio.css'

const Portfolio = ({ portfolioData }) => {
  const [filter, setFilter] = useState('*');

  const categories = ['*', 'cloud', 'web', 'apps', 'mentoring'];

  const filteredData = filter === '*' 
    ? portfolioData 
    : portfolioData.filter(item => item.category === filter);

  return (
    <section id="portfolio" className="portfolio section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Portfolio</h2>
          <p>Check out my presentations, talks, and workshops</p>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="100">
          <div className="col-lg-12 d-flex justify-content-center">
            <ul id="portfolio-filters">
              {categories.map(cat => (
                <li 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={filter === cat ? 'filter-active' : ''}
                >
                  {cat === '*' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="row portfolio-container" data-aos="fade-up" data-aos-delay="200">
          {filteredData.map((item, index) => (
            <div key={index} className={`col-lg-4 col-md-6 portfolio-item filter-${item.category}`}>
              <div className="portfolio-wrap">
                <img src={item.images[0]} className="img-fluid" alt={item.title} />
                <div className="portfolio-info">
                  <h4>{item.title}</h4>
                  <p>{item.program}</p>
                  <p className="portfolio-date">{item.date}</p>
                  <div className="portfolio-links">
                    {item.resources && item.resources.map((resource, idx) => (
                      <a key={idx} href={resource.url} target="_blank" rel="noreferrer" title={resource.title}>
                        <i className={resource.type === 'github' ? 'bx bxl-github' : 'bx bx-file'}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio