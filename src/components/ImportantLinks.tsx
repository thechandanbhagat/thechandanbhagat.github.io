import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

interface LinkItem {
  title: string
  url: string
  description?: string
  platform?: string
  icon: string
  date?: string
  tags?: string[]
}

interface LinkCategory {
  category: string
  items: LinkItem[]
}

function LinkCard({ item }: { item: LinkItem }) {
  return (
    <div className="link-card" data-tags={item.tags?.join(',') || ''}>
      <div className="link-icon">
        <i className={`bx ${item.icon}`}></i>
      </div>
      <div className="link-content">
        <h4>{item.title}</h4>
        <p>{item.description || ''}</p>
        <div className="link-meta">
          {item.platform && <span className="platform">{item.platform}</span>}
          {item.date && <span className="date">{new Date(item.date).toLocaleDateString()}</span>}
        </div>
        <div className="tags">
          {item.tags?.map((tag, i) => (
            <span className="tag" key={i}>{tag}</span>
          ))}
        </div>
      </div>
      <a href={item.url} target="_blank" rel="noreferrer" className="link-overlay"></a>
    </div>
  )
}

export default function ImportantLinks() {
  const [links, setLinks] = useState<LinkCategory[]>([])

  useEffect(() => {
    fetch('/data/important-links.json')
      .then(res => res.json())
      .then((data: { links: LinkCategory[] }) => setLinks(data.links))
      .catch(err => console.error('Error loading links:', err))
  }, [])

  return (
    <section id="links" className="portfolio-details">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Important Links</h2>
          <p>Explore my content, packages, and resources</p>
        </div>
        <div className="row">
          {links.map((category, categoryIndex) => {
            const needsSlider = category.items.length > 4

            return (
              <div className="col-lg-12" data-aos="fade-up" key={categoryIndex}>
                <h3 className="category-title">{category.category}</h3>
                {needsSlider ? (
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    slidesPerView="auto"
                    spaceBetween={0}
                    loop={true}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: true, pauseOnMouseEnter: true }}
                    breakpoints={{
                      320: { slidesPerView: 1 },
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                      1200: { slidesPerView: 4 },
                    }}
                  >
                    {category.items.map((item, i) => (
                      <SwiperSlide key={i}>
                        <LinkCard item={item} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="links-grid">
                    {category.items.map((item, i) => (
                      <LinkCard item={item} key={i} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
