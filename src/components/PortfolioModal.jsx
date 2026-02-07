import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const RESOURCE_ICONS = {
  presentation: 'bx-slideshow',
  github: 'bxl-github',
  document: 'bx-file',
  video: 'bx-video',
  link: 'bx-link-external',
}

export default function PortfolioModal({ item, onClose }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)

    // Trigger show animation
    requestAnimationFrame(() => {
      if (modalRef.current) {
        modalRef.current.classList.add('show')
      }
    })

    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  return (
    <div
      className="modal"
      ref={modalRef}
      style={{ display: 'block' }}
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>{item.program}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body row">
          <div className="modal-image-column col-md-6">
            <Swiper
              className="portfolioSwiper"
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              pagination={{ clickable: true }}
              navigation
              autoHeight={true}
            >
              {item.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={`/${img}`} alt={item.title} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="modal-info-column col-md-6">
            <h3>{item.title}</h3>
            <p className="date">{item.date}</p>
            {item.description && (
              <div className="description-section">
                <h4>Description</h4>
                <p>{item.description}</p>
              </div>
            )}
            {item.resources && item.resources.length > 0 && (
              <div className="resources-section">
                <h4>Resources</h4>
                {item.resources.map((resource, i) => (
                  <a
                    href={resource.url}
                    className="resource-link"
                    target="_blank"
                    rel="noreferrer"
                    key={i}
                  >
                    <i className={`bx ${RESOURCE_ICONS[resource.type] || 'bx-link'}`}></i>
                    {resource.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
