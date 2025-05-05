// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the mobile menu
    initMobileMenu();
    
    // Initialize the FAQ accordions
    initFAQAccordions();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Add header scroll effect
    initHeaderScroll();
    
    // Add animated shape elements to hero section
    createHeroShapes();
    
    // Add scroll reveal for sections
    initScrollReveal();
    
    // Add step connection lines
    addStepLines();
    
    // Add icon animations for features
    initFeatureAnimations();
    
    // Initialize language badge modal functionality
    initLanguageModal();
});

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', 
                mobileMenuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active') && !e.target.closest('nav') && !e.target.closest('.mobile-menu-toggle')) {
            nav.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// FAQ accordion functionality
function initFAQAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    const scrollThreshold = 50;
    
    function checkScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    // Initial check
    checkScroll();
}

// Add animated shapes to hero section
function createHeroShapes() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const heroShapes = document.createElement('div');
    heroShapes.className = 'hero-shapes';
    
    // Create different shapes
    const shapes = [
        { class: 'shape shape-1' },
        { class: 'shape shape-2' },
        { class: 'shape shape-3' }
    ];
    
    shapes.forEach(shape => {
        const element = document.createElement('div');
        element.className = shape.class;
        heroShapes.appendChild(element);
    });
    
    heroSection.appendChild(heroShapes);
}

// Add connection lines between steps
function addStepLines() {
    const steps = document.querySelectorAll('.step:not(:last-child)');
    
    steps.forEach(step => {
        const line = document.createElement('div');
        line.className = 'step-line';
        step.appendChild(line);
    });
}

// Feature card animations
function initFeatureAnimations() {
    const features = document.querySelectorAll('.feature-card');
    
    features.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            const icon = feature.querySelector('.feature-icon');
            if (icon) {
                icon.style.animation = 'pulse 0.5s ease-in-out';
            }
        });
        
        feature.addEventListener('mouseleave', () => {
            const icon = feature.querySelector('.feature-icon');
            if (icon) {
                icon.style.animation = 'none';
                // Trigger reflow
                void icon.offsetWidth;
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Scroll reveal for sections
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Language modal functionality
function initLanguageModal() {
    const languageBadges = document.querySelectorAll('.language-badge');
    const modal = document.getElementById('language-modal');
    const modalTitle = document.getElementById('modal-language-title');
    const modalCode = document.getElementById('modal-code-example');
    const closeBtn = document.querySelector('.modal-close');
    let languageExamples = {};
    
    // Fetch the language examples from the JSON file
    fetch('languages.json')
        .then(response => response.json())
        .then(data => {
            // Store the language examples for later use
            languageExamples = data.languages.reduce((acc, lang) => {
                acc[lang.name] = lang.highlighted;
                return acc;
            }, {});
        })
        .catch(error => {
            console.error('Error loading language examples:', error);
        });
    
    // Add click event to each language badge
    languageBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            const language = badge.textContent.trim();
            
            // Update modal title
            modalTitle.textContent = `${language} Example`;
            
            // Set code example based on language
            if (languageExamples[language]) {
                modalCode.innerHTML = languageExamples[language];
            } else {
                // Default example for languages not found in the JSON
                modalCode.innerHTML = getDefaultExample(language);
            }
            
            // Show modal
            modal.classList.add('active');
            
            // Prevent scrolling on body
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal on close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function getDefaultExample(language) {
        return `<span class="code-comment">// * Group: ${language} example</span>
<span class="code-keyword">function</span> exampleCode() {
    <span class="code-comment">// Group Code detects special comment patterns</span>
    <span class="code-comment">// * Authentication: User login</span>
    <span class="code-comment">// * Security: Data validation</span>
    <span class="code-comment">// * Database: User record</span>
    
    <span class="code-comment">// This helps you organize code across multiple files</span>
}`;
    }
}