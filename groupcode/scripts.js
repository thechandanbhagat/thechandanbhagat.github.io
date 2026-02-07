// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    initParticles();

    // Initialize code preview
    initCodePreview();

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

// Initialize particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 60,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#4F46E5", "#06B6D4", "#818CF8"]
                },
                "shape": {
                    "type": "circle"
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#4F46E5",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1.5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.6
                        }
                    },
                    "push": {
                        "particles_nb": 3
                    }
                }
            },
            "retina_detect": true
        });
    }
}

// Code preview animation
function initCodePreview() {
    const codeContent = document.querySelector('.code-content');
    if (!codeContent) return;

    const codeExamples = [
        {
            filename: 'auth.ts',
            code: [
                '<span class="code-comment">// @group Authentication: User login process</span>',
                'export class AuthService {',
                '    <span class="code-comment">// @group Security: Password validation</span>',
                '    async validatePassword(password: string) {',
                '        return await bcrypt.hash(password, 10);',
                '    }',
                '}'
            ]
        },
        {
            filename: 'api.py',
            code: [
                '<span class="code-comment"># @group API: User data endpoints</span>',
                'class UserController:',
                '    <span class="code-comment"># @group Database: User operations</span>',
                '    def get_user_data(self, user_id):',
                '        return self.db.query(user_id)'
            ]
        },
        {
            filename: 'ui.jsx',
            code: [
                '<span class="code-comment">/* @group UserInterface: Login form */</span>',
                'function LoginForm() {',
                '    <span class="code-comment">// @group Validation: Input handling</span>',
                '    const handleSubmit = (e) => {',
                '        validateInput(e.target.value);',
                '    }',
                '}'
            ]
        },
        {
            filename: 'styles.css',
            code: [
                '<span class="code-comment">/* @group Styles: Button styles */</span>',
                '.btn {',
                '    <span class="code-comment">/* @group Animation: Hover effect */</span>',
                '    transition: background-color 0.3s;',
                '}'
            ]
        },
        
        {
            filename: 'dataprocessor.cs',
            code: [
                '<span class="code-comment">// @group Backend: User data processing</span>',
                'public class DataProcessor {',
                '    <span class="code-comment">// @group Validation: Input sanitization</span>',
                '    public async Task<bool> ValidateUserData(UserData data) {',
                '        return await _validator.ValidateAsync(data);',
                '    }',
                '}'
            ]
        },
        { 
            filename: 'utils.go',
            code: [
                '<span class="code-comment">// @group Utilities: Helper functions</span>',
                'func HashPassword(password string) (string, error) {',
                '    <span class="code-comment">// @group Security: Password hashing</span>',
                '    return bcrypt.GenerateFromPassword([]byte(password), 10)',
                '}'
            ]
        }
    ];

    let currentExampleIndex = 0;

    function showNextExample() {
        const example = codeExamples[currentExampleIndex];
        const filename = document.querySelector('.code-filename');
        
        // Update filename
        if (filename) {
            filename.textContent = example.filename;
        }

        // Clear existing content
        codeContent.innerHTML = '';

        // Add new code lines with animation delay
        example.code.forEach((line, index) => {
            const codeLine = document.createElement('span');
            codeLine.className = 'code-line';
            codeLine.innerHTML = line;
            codeLine.style.animationDelay = `${index * 0.1}s`;
            codeContent.appendChild(codeLine);
        });

        // Increment index
        currentExampleIndex = (currentExampleIndex + 1) % codeExamples.length;
    }

    // Show first example immediately
    showNextExample();

    // Change example every 5 seconds
    setInterval(showNextExample, 5000);
}

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