async function loadImportantLinks() {
    try {
        const response = await fetch('data/important-links.json');
        const data = await response.json();
        renderLinks(data.links);
    } catch (error) {
        console.error('Error loading links:', error);
    }
}

function renderLinks(links) {
    const container = document.querySelector('#links .row');
    
    links.forEach((category, categoryIndex) => {
        const items = category.items;
        const needsSlider = items.length > 4;
        const categoryId = `category-${categoryIndex}`;
        
        const categorySection = `
            <div class="col-lg-12" data-aos="fade-up">
                <h3 class="category-title">${category.category}</h3>
                ${needsSlider ? `
                    <div class="swiper-container" id="${categoryId}">
                        <div class="swiper-wrapper">
                            ${items.map(item => `
                                <div class="swiper-slide">
                                    ${generateLinkCard(item)}
                                </div>
                            `).join('')}
                        </div>
                        <div class="swiper-pagination"></div>
                    </div>
                ` : `
                    <div class="links-grid">
                        ${items.map(item => generateLinkCard(item)).join('')}
                    </div>
                `}
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', categorySection);
        
        if (needsSlider) {
            initializeCategorySlider(categoryId);
        }
    });
}

function generateSlides(items) {
    const slides = [];
    const itemsPerSlide = 4;
    
    for (let i = 0; i < items.length; i += itemsPerSlide) {
        const slideItems = items.slice(i, i + itemsPerSlide);
        slides.push(`
            <div class="swiper-slide">
                <div class="links-grid">
                    ${slideItems.map(item => generateLinkCard(item)).join('')}
                </div>
            </div>
        `);
    }
    
    return slides.join('');
}

function generateLinkCard(item) {
    return `
        <div class="link-card" data-tags="${item.tags?.join(',') || ''}">
            <div class="link-icon">
                <i class='bx ${item.icon}'></i>
            </div>
            <div class="link-content">
                <h4>${item.title}</h4>
                <p>${item.description || ''}</p>
                <div class="link-meta">
                    ${item.platform ? `<span class="platform">${item.platform}</span>` : ''}
                    ${item.date ? `<span class="date">${new Date(item.date).toLocaleDateString()}</span>` : ''}
                </div>
                <div class="tags">
                    ${item.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
                </div>
            </div>
            <a href="${item.url}" target="_blank" class="link-overlay"></a>
        </div>
    `;
}

function initializeCategorySlider(categoryId) {
    const swiper = new Swiper(`#${categoryId}`, {
        slidesPerView: 'auto',
        spaceBetween: 0,
        loop: true,
        slidesPerGroup: 1,
        loopFillGroupWithBlank: false,
        centeredSlides: false,
        initialSlide: 0,
        pagination: {
            el: `#${categoryId} .swiper-pagination`,
            clickable: true
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: true, // Stop on user interaction
            pauseOnMouseEnter: true     // Pause on hover
        },
        breakpoints: {
            320: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            }
        },
        on: {
            init: function() {
                // Add hover handlers to all slides in this swiper
                const slides = document.querySelectorAll(`#${categoryId} .swiper-slide`);
                slides.forEach(slide => {
                    slide.addEventListener('mouseenter', () => {
                        this.autoplay.stop();
                    });
                    slide.addEventListener('mouseleave', () => {
                        this.autoplay.start();
                    });
                });
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadImportantLinks();
    
    // Handle dark mode for link cards
    const handleLinksDarkMode = () => {
        const isDarkMode = document.body.classList.contains('dark-theme');
        const linkCards = document.querySelectorAll('.link-card');
        
        linkCards.forEach(card => {
            card.style.background = isDarkMode ? '#2d2d2d' : '#ffffff';
        });
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                handleLinksDarkMode();
            }
        });
    });

    observer.observe(document.body, {
        attributes: true
    });

    handleLinksDarkMode();
});