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
    
    links.forEach(category => {
        const categorySection = `
            <div class="col-lg-12" data-aos="fade-up">
                <h3 class="category-title">${category.category}</h3>
                <div class="links-grid">
                    ${category.items.map(item => `
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
                    `).join('')}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', categorySection);
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

    // Initial check for dark mode
    handleLinksDarkMode();
});