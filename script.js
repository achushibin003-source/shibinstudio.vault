document.addEventListener('DOMContentLoaded', () => {
    // ── INTRO ──
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            setTimeout(() => introOverlay.remove(), 1200);
        }, 3000);
    }

    // ── SCROLL-DRIVEN CANVAS HERO ──
    const canvas  = document.getElementById('hero-canvas');
    const wrapper = document.getElementById('hero-scroll-wrapper');

    if (canvas && wrapper) {
        const ctx = canvas.getContext('2d');
        const TOTAL_FRAMES = 300;
        const IMG_DIR      = 'anime/image/';

        // Resize canvas to viewport
        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            if (currentImg) drawFrame(currentImg);
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Pre-load all frames
        const frames = [];
        let loadedCount = 0;
        let currentImg  = null;

        function pad(n) { return String(n).padStart(4, '0'); }

        function drawFrame(img) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Cover-fill the canvas
            const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
            const w = img.naturalWidth  * scale;
            const h = img.naturalHeight * scale;
            const x = (canvas.width  - w) / 2;
            const y = (canvas.height - h) / 2;
            ctx.drawImage(img, x, y, w, h);
        }

        function onAllLoaded() {
            currentImg = frames[0];
            drawFrame(currentImg);
            // Show UI elements
            document.querySelector('.hero-socials-fixed')?.classList.add('visible');
            document.querySelector('.hero-scroll-hint')?.classList.add('visible');
            updateScroll();
        }

        // Load frames 1-300 (male0001 … male0300)
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = IMG_DIR + 'male' + pad(i) + '.png';
            img.onload = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) onAllLoaded();
            };
            img.onerror = () => { loadedCount++; if (loadedCount === TOTAL_FRAMES) onAllLoaded(); };
            frames[i - 1] = img;
        }

        // Text overlay panels: [startProgress, endProgress]
        const textPanels = [
            { el: document.getElementById('htxt-1'), from: 0,    to: 0.35 },
            { el: document.getElementById('htxt-2'), from: 0.35, to: 0.68 },
            { el: document.getElementById('htxt-3'), from: 0.68, to: 1.0  },
        ];

        function updateScroll() {
            const wrapRect   = wrapper.getBoundingClientRect();
            const wrapHeight = wrapper.offsetHeight - window.innerHeight;
            const scrolled   = Math.max(0, -wrapRect.top);
            const progress   = Math.min(1, scrolled / wrapHeight);

            // Draw correct frame
            const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));
            if (frames[frameIndex]?.complete && frames[frameIndex].naturalWidth) {
                currentImg = frames[frameIndex];
                drawFrame(currentImg);
            }

            // Show/hide text overlays
            textPanels.forEach(({ el, from, to }) => {
                if (!el) return;
                if (progress >= from && progress < to) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });

            // Hide scroll hint and socials after user starts scrolling
            const scrollHint  = document.querySelector('.hero-scroll-hint');
            const socialsFixed = document.querySelector('.hero-socials-fixed');
            if (progress > 0.05) {
                scrollHint?.classList.remove('visible');
            } else {
                scrollHint?.classList.add('visible');
            }
        }

        window.addEventListener('scroll', updateScroll, { passive: true });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize AOS animation library
    AOS.init({
        duration: 1000,
        once: false,
        mirror: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });

    // Click effect animation
    document.addEventListener('click', function(e) {
        const circle = document.createElement('div');
        circle.classList.add('click-effect');
        
        // Position the circle at the click coordinates
        circle.style.left = `${e.clientX}px`;
        circle.style.top = `${e.clientY}px`;
        
        document.body.appendChild(circle);
        
        // Remove the element after the animation finishes
        setTimeout(() => {
            circle.remove();
        }, 600);
    });

    // Video playback on hover
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const video = card.querySelector('.project-video');
        if (video) {
            card.addEventListener('mouseenter', () => {
                video.play();
            });
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0; // Reset video to start
            });
        }
    });

    // Snowfall effect
    function createSnowflakes() {
        const snowContainer = document.getElementById('snow-container');
        if (!snowContainer) return;
        
        const flakeCount = 50; // Adjust number of snowflakes here
        
        for (let i = 0; i < flakeCount; i++) {
            const flake = document.createElement('div');
            flake.classList.add('snowflake');
            
            // Randomize snowflake properties for realistic effect
            const size = Math.random() * 4 + 2; // Size between 2px and 6px
            const left = Math.random() * 100; // Position anywhere from 0% to 100% width
            const duration = Math.random() * 3 + 4; // Fall duration between 4s and 7s
            const delay = Math.random() * 5; // Start delay between 0s and 5s
            const opacity = Math.random() * 0.5 + 0.3; // Opacity between 0.3 and 0.8
            
            flake.style.width = `${size}px`;
            flake.style.height = `${size}px`;
            flake.style.left = `${left}%`;
            flake.style.animationDuration = `${duration}s`;
            flake.style.animationDelay = `${delay}s`;
            flake.style.opacity = opacity;
            
            snowContainer.appendChild(flake);
        }
    }
    
    // Initialize snow effect
    createSnowflakes();

    // Hero section fade out on scroll
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            // Calculate opacity: 1 at the top, 0 after scrolling down 600px
            const scrollPos = window.scrollY;
            const fadePoint = 600; 
            let newOpacity = 1 - (scrollPos / fadePoint);
            
            // Clamp value between 0 and 1
            if (newOpacity < 0) newOpacity = 0;
            if (newOpacity > 1) newOpacity = 1;
            
            heroSection.style.opacity = newOpacity;
        });
    }
});
