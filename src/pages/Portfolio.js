import React, { useState, useEffect } from 'react';
import { getPortfolioData, getPortfolioItems, getPortfolioCategories, getImportantLinksData, getImportantLinksCategories } from '../utils/data';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FixedButtons from '../components/FixedButtons';
import './Portfolio.css';

const Portfolio = () => {
  const portfolioData = getPortfolioData();
  const allItems = getPortfolioItems();
  const categories = getPortfolioCategories();
  const importantLinksData = getImportantLinksData();
  const linkCategories = getImportantLinksCategories();
  
  const [filteredItems, setFilteredItems] = useState(allItems);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // Initialize AOS if available
    if (window.AOS) {
      window.AOS.init();
    }
  }, []);

  const handleFilterClick = (categoryId) => {
    setActiveFilter(categoryId);
    
    if (categoryId === 'all') {
      setFilteredItems(allItems);
    } else {
      const filtered = allItems.filter(item => 
        item.category.includes(categoryId)
      );
      setFilteredItems(filtered);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="portfolio-page">
      <Header />
      
      <main id="main" style={{ paddingTop: '80px' }}>
        {/* Portfolio Section */}
        <section id="portfolio" className="portfolio section-bg">
          <div className="container-fluid" data-aos="fade-up">
            
            <div className="section-title">
              <h2>{portfolioData.title || "Portfolio"}</h2>
              <p>{portfolioData.subtitle || "My Recent Work & Presentations"}</p>
            </div>

            {/* Portfolio Filters */}
            <div className="row" data-aos="fade-up" data-aos-delay="100">
              <div className="col-lg-12 d-flex justify-content-center">
                <ul id="portfolio-flters">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className={activeFilter === category.id ? 'filter-active' : ''}
                      onClick={() => handleFilterClick(category.id)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Portfolio Items */}
            <div className="row portfolio-container" data-aos="fade-up" data-aos-delay="200">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`col-lg-4 col-md-6 portfolio-item ${item.category.replace(' ', ' ')}`}
                >
                  <div className="portfolio-wrap">
                    <img src={item.image} className="img-fluid" alt={item.title} />
                    <div className="portfolio-info">
                      <h4>{item.title}</h4>
                      <p>{item.location}</p>
                      <div className="portfolio-links">
                        <button 
                          className="portfolio-lightbox"
                          onClick={() => openModal(item)}
                          title="More Details"
                        >
                          <i className="bx bx-plus"></i>
                        </button>
                        {item.resources && item.resources.length > 0 && (
                          <a 
                            href={item.resources[0].url} 
                            title="External Link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="bx bx-link"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Important Links Section */}
        <section id="links" className="portfolio-details">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>{importantLinksData.title || "Important Links"}</h2>
              <p>{importantLinksData.subtitle || "Explore my content, packages, and resources"}</p>
            </div>
            
            <div className="links-container">
              {linkCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="links-category" data-aos="fade-up" data-aos-delay={categoryIndex * 100}>
                  <h3 className="category-title">{category.category}</h3>
                  
                  <div className="links-grid">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="link-card">
                        <div className="link-header">
                          <div className="link-icon">
                            <i className={`bx ${item.icon}`}></i>
                          </div>
                          <div className="link-meta">
                            <span className="platform">{item.platform}</span>
                            {item.date && <span className="date">{item.date}</span>}
                          </div>
                        </div>
                        
                        <div className="link-content">
                          <h4 className="link-title">
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              {item.title}
                            </a>
                          </h4>
                          <p className="link-description">{item.description}</p>
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="link-tags">
                              {item.tags.map((tag, tagIndex) => (
                                <span key={tagIndex} className="tag">{tag}</span>
                              ))}
                            </div>
                          )}
                          
                          <div className="link-stats">
                            {item.duration && <span><i className="bx bx-time"></i> {item.duration}</span>}
                            {item.views && <span><i className="bx bx-show"></i> {item.views} views</span>}
                            {item.stars && <span><i className="bx bx-star"></i> {item.stars} stars</span>}
                            {item.downloads && <span><i className="bx bx-download"></i> {item.downloads} downloads</span>}
                            {item.readTime && <span><i className="bx bx-time"></i> {item.readTime} read</span>}
                            {item.version && <span><i className="bx bx-package"></i> v{item.version}</span>}
                          </div>
                        </div>
                        
                        <div className="link-footer">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-button">
                            <i className="bx bx-link-external"></i>
                            View {item.platform}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Portfolio Modal */}
      {selectedItem && (
        <div className="portfolio-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            
            <div className="modal-header">
              <h2>{selectedItem.title}</h2>
              <p className="modal-meta">
                <i className="bx bx-calendar"></i> {selectedItem.date} | 
                <i className="bx bx-map"></i> {selectedItem.location}
              </p>
            </div>

            <div className="modal-body">
              {/* Main Image */}
              <div className="modal-image">
                <img src={selectedItem.image} alt={selectedItem.title} className="img-fluid" />
              </div>

              {/* Description */}
              <div className="modal-description">
                <h3>About this Project</h3>
                <p>{selectedItem.description}</p>
              </div>

              {/* Technologies */}
              {selectedItem.technologies && selectedItem.technologies.length > 0 && (
                <div className="modal-technologies">
                  <h3>Technologies Used</h3>
                  <div className="tech-tags">
                    {selectedItem.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Images */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <div className="modal-gallery">
                  <h3>Gallery</h3>
                  <div className="gallery-grid">
                    {selectedItem.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image} 
                        alt={`${selectedItem.title} ${index + 1}`} 
                        className="gallery-image"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {selectedItem.resources && selectedItem.resources.length > 0 && (
                <div className="modal-resources">
                  <h3>Resources</h3>
                  <div className="resource-links">
                    {selectedItem.resources.map((resource, index) => (
                      <a 
                        key={index}
                        href={resource.url} 
                        className="resource-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className={resource.icon}></i>
                        {resource.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <FixedButtons />
    </div>
  );
};

export default Portfolio;