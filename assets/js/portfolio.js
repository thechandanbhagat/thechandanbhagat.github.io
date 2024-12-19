document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();

    // Handle dark mode for portfolio-specific elements
    const handlePortfolioDarkMode = () => {
        const isDarkMode = document.body.classList.contains('dark-theme');
        const portfolioModals = document.querySelectorAll('.modal-content');
        const resourceSections = document.querySelectorAll('.resources-section');
        
        portfolioModals.forEach(modal => {
            modal.style.background = isDarkMode ? '#2d2d2d' : '#ffffff';
            modal.style.color = isDarkMode ? '#e0e0e0' : '#45505b';
        });

        resourceSections.forEach(section => {
            section.style.background = isDarkMode ? '#3d3d3d' : '#f8f9fa';
        });
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                handlePortfolioDarkMode();
            }
        });
    });

    observer.observe(document.body, {
        attributes: true
    });

    // Initial check for dark mode
    handlePortfolioDarkMode();
});

async function loadPortfolio() {
    try {
        const response = await fetch('data/portfolio.json');
        const data = await response.json();
        const container = document.getElementById('portfolio-grid');
        
        // Sort items by date (newest first)
        const sortedItems = data.portfolioItems.sort((a, b) => 
            new Date(b.date || '1900-01-01') - new Date(a.date || '1900-01-01')
        );
        
        // Render portfolio items with modal
        container.innerHTML = sortedItems.map((item, index) => `
            <div class="col-lg-4 col-md-6 portfolio-item filter-${item.category.toLowerCase()}">
                <div class="portfolio-wrap">
                    <img src="${item.images[0]}" class="img-fluid" alt="${item.title}">
                    <div class="portfolio-info">
                        <h4>${item.program}</h4>
                        <h5>${item.title}</h5>
                        <p>${item.date}</p>
                        <div class="portfolio-links">
                            <a href="#" onclick="openPortfolioModal(${index})" class="portfolio-details-link">
                                <i class="bx bx-link"></i>
                            </a>
                           
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Add modal HTML to the page
        document.body.insertAdjacentHTML('beforeend', `
            <div id="portfolioModal" class="modal">
                <div class="modal-content">
                   
                    <div id="modalContent"></div>
                </div>
            </div>
        `);

        initializePortfolioHandlers(sortedItems);
        
        // Initialize Isotope after content is loaded
        initializeIsotope();

    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
}

function openPortfolioModal(index) {
    const modal = document.getElementById('portfolioModal');
    const modalContent = document.getElementById('modalContent');
    const item = window.portfolioItems[index];
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${item.program}</h2>
            <span class="close">&times;</span>
        </div>
        <div class="modal-body row">
            <div class="modal-image-column col-md-6">
                <div class="swiper portfolioSwiper">
                    <div class="swiper-wrapper">
                        ${item.images.map(img => `
                            <div class="swiper-slide">
                                <img src="${img}" alt="${item.title}">
                            </div>
                        `).join('')}
                    </div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
            <div class="modal-info-column col-md-6">
                <h3>${item.title}</h3>
                <p class="date">${item.date}</p>
                ${item.description ? `
                    <div class="description-section">
                        <h4>Description</h4>
                        <p>${item.description}</p>
                    </div>
                ` : ''}
                ${item.resources ? `
                    <div class="resources-section">
                        <h4>Resources</h4>
                        ${item.resources.map(resource => `
                            <a href="${resource.url}" class="resource-link" target="_blank">
                                <i class="bx ${getResourceIcon(resource.type)}"></i>
                                ${resource.title}
                            </a>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    modal.style.display = "block";
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
    
    // Setup handlers after modal content is created
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    };

    // Close modal with close button
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }
    
    // Close modal when clicking outside
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    // Add ESC key handler if not already added
    if (!window.modalEscHandler) {
        window.modalEscHandler = true;
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    initializeSwiperAndHandlers();
}

function getResourceIcon(type) {
    const icons = {
        'presentation': 'bx-slideshow',
        'github': 'bxl-github',
        'document': 'bx-file',
        'video': 'bx-video',
        'link': 'bx-link-external'
    };
    return icons[type] || 'bx-link';
}

function initializePortfolioHandlers(items) {
    window.portfolioItems = items;
    
    // Don't set up event handlers here, moved to after modal content is created
}

function renderItems(items) {
    return items.map(item => `
        <h3 class="resume-title">${item.category}</h3>
        <div class="resume-item pb-0">
            <h4>${item.date}</h4>
            <section class="portfolio-details">
                <div class="container-fluid">
                    <div class="row gy-4">
                        <div class="col-lg-12">
                            <div class="portfolio-details-slider swiper">
                                <div class="swiper-wrapper align-items-center">
                                    ${item.images.map(img => `
                                        <div class="swiper-slide">
                                            <img src="${img}" alt="">
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="swiper-pagination"></div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="portfolio-info">
                                <h3>${item.title}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `).join('');
}

function initializeSwipers() {
    const swipers = document.querySelectorAll('.portfolio-details-slider');
    swipers.forEach(element => {
        new Swiper(element, {
            speed: 400,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            }
        });
    });
}

function initializeIsotope() {
    // Wait for all images to load to prevent layout issues
    imagesLoaded(document.querySelector('#portfolio-grid'), function() {
        const grid = document.getElementById('portfolio-grid');
        const iso = new Isotope(grid, {
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows',
            percentPosition: true
        });

        // Filter items on button click
        document.querySelectorAll('#portfolio-filters li').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const filterValue = this.getAttribute('data-filter');
                
                // Remove active class from all buttons
                document.querySelectorAll('#portfolio-filters li').forEach(btn => {
                    btn.classList.remove('filter-active');
                });
                
                // Add active class to clicked button
                this.classList.add('filter-active');
                
                // Apply filter
                if (filterValue === '*') {
                    iso.arrange({ filter: '*' });
                } else {
                    iso.arrange({ filter: filterValue });
                }

                // Trigger layout after filter
                iso.layout();
            });
        });

        // Initial layout
        iso.layout();
    });
}

function initializeSwiperAndHandlers() {
    // Initialize Swiper
    const swiper = new Swiper('.portfolioSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoHeight: true
    });

    // Setup close button handler
    const closeBtn = document.querySelector('.close');
    const modal = document.getElementById('portfolioModal');
    
    closeBtn.onclick = function() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    // Setup outside click handler
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        }
    }
}