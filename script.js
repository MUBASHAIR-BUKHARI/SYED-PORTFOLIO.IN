
/**
 * SYED MUBASHAIR HUSSAIN PORTFOLIO - CORE ENGINE
 * Version: 1.0.0
 * Features: Theme Toggling, Project Filtering, Typing Effect, Intersection Observers, Form Validation.
 */

"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // === HELPER FUNCTIONS ===
    const getEl = (selector) => document.querySelector(selector);
    const getAll = (selector) => document.querySelectorAll(selector);

    // === 1. LOADING SCREEN ===
    const initPreloader = () => {
        const loader = getEl('.preloader');
        if (loader) {
            window.addEventListener('load', () => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            });
        }
    };

    // === 2. THEME ENGINE (DARK/LIGHT) ===
    const initTheme = () => {
        const themeToggle = getEl('#theme-toggle');
        const body = document.body;
        const currentTheme = localStorage.getItem('theme');

        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        const setTheme = (theme) => {
            body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if(themeToggle) themeToggle.checked = (theme === 'dark');
        };

        if (currentTheme) {
            setTheme(currentTheme);
        } else {
            setTheme(prefersDark.matches ? 'dark' : 'light');
        }

        themeToggle?.addEventListener('change', () => {
            setTheme(themeToggle.checked ? 'dark' : 'light');
        });
    };

    // === 3. SMART NAVIGATION (STICKY & HIDE ON SCROLL) ===
    const initNavigation = () => {
        const nav = getEl('nav');
        const mobileMenu = getEl('#navLinks');
        const hamburger = getEl('.mobile-toggle');
        const navLinks = getAll('.nav-links a');
        let lastScrollTop = 0;

        // Sticky & Show/Hide Logic
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Background & Shadow
            if (scrollTop > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }

            // Directional Hide
            if (scrollTop > lastScrollTop && scrollTop > 500) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop;
        }, { passive: true });

        // Mobile Toggle
        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            body.style.overflow = isOpen ? 'hidden' : 'auto';
        };

        hamburger?.addEventListener('click', toggleMenu);

        // Close on click outside or link click
        document.addEventListener('click', (e) => {
            if (mobileMenu?.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                toggleMenu();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu?.classList.contains('active')) toggleMenu();
            });
        });

        // Keyboard Access
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
                toggleMenu();
            }
        });
    };

    // === 4. ACTIVE LINK HIGHLIGHTER ===
    const initActiveLinks = () => {
        const sections = getAll('section[id]');
        const navLinks = getAll('.nav-links a');

        const observerOptions = {
            threshold: 0.6,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', 
                            link.getAttribute('href').substring(1) === entry.target.id
                        );
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    };

    // === 5. TYPING ANIMATION (VANILLA JS) ===
    const initTypingEffect = () => {
        const textEl = getEl('#typed-text');
        if (!textEl) return;

        const phrases = [
            "Electrical Engineering Student",
            "Web Creator",
            "Future Engineer",
            "Lifelong Learner"
        ];
        
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const currentPhrase = phrases[phraseIdx];
            
            if (isDeleting) {
                charIdx--;
                typeSpeed = 50;
            } else {
                charIdx++;
                typeSpeed = 100;
            }

            textEl.textContent = currentPhrase.substring(0, charIdx);

            if (!isDeleting && charIdx === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        type();
    };

    // === 6. INTERSECTION OBSERVER ANIMATIONS (SKILLS, COUNTERS, FADES) ===
    const initScrollAnimations = () => {
        // Skill Bars
        const skillsSection = getEl('#skills');
        const skillBars = getAll('.progress-fill');
        
        const skillObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                skillBars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
            }
        }, { threshold: 0.5 });

        if (skillsSection) skillObserver.observe(skillsSection);

        // General Fade Up
        const fadeElements = getAll('.reveal');
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        fadeElements.forEach(el => fadeObserver.observe(el));

        // Counters
        const counters = getAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute('data-target');
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCount = () => {
                        current += step;
                        if (current < target) {
                            entry.target.textContent = Math.ceil(current);
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.textContent = target;
                        }
                    };
                    updateCount();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        counters.forEach(c => counterObserver.observe(c));
    };

    // === 7. PROJECT FILTERING ===
    const initProjectFilter = () => {
        const filterBtns = getAll('.filter-btn');
        const projects = getAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-filter');
                
                // Toggle Button State
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                projects.forEach(project => {
                    const projectCat = project.getAttribute('data-category');
                    if (category === 'all' || category === projectCat) {
                        project.style.display = 'block';
                        setTimeout(() => project.style.opacity = '1', 10);
                    } else {
                        project.style.opacity = '0';
                        setTimeout(() => project.style.display = 'none', 300);
                    }
                });
            });
        });
    };

    // === 8. CUSTOM CURSOR (DESKTOP ONLY) ===
    const initCustomCursor = () => {
        const cursor = getEl('#custom-cursor');
        // Only run on non-touch devices
        if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            });
        });

        // Hover effects
        const interactiveElements = getAll('a, button, .filter-btn, .project-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-grow'));
        });
    };

    // === 9. CONTACT FORM VALIDATION ===
    const initContactForm = () => {
        const form = getEl('#contact-form');
        if (!form) return;

        const validateEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');

            inputs.forEach(input => {
                const value = input.value.trim();
                if (!value) {
                    isValid = false;
                    input.classList.add('error');
                } else if (input.type === 'email' && !validateEmail(value)) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = "Sending...";

                // Simulate API call
                setTimeout(() => {
                    alert('Message sent successfully!');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 1500);
            }
        });
    };

    // === 10. SCROLL PROGRESS & BACK TO TOP ===
    const initScrollHelpers = () => {
        const progressBar = getEl('#scroll-progress');
        const backToTop = getEl('#back-to-top');

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            if (progressBar) progressBar.style.width = scrolled + "%";
            
            if (backToTop) {
                backToTop.classList.toggle('visible', winScroll > 300);
            }
        }, { passive: true });

        backToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // === 11. PARALLAX EFFECT ===
    const initParallax = () => {
        const hero = getEl('#home');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scroll = window.pageYOffset;
            hero.style.backgroundPositionY = `${scroll * 0.5}px`;
        }, { passive: true });
    };

    // === INITIALIZE ALL MODULES ===
    initPreloader();
    initTheme();
    initNavigation();
    initActiveLinks();
    initTypingEffect();
    initScrollAnimations();
    initProjectFilter();
    initCustomCursor();
    initContactForm();
    initScrollHelpers();
    initParallax();
});
