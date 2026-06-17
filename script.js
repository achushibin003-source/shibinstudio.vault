document.addEventListener('DOMContentLoaded', () => {
    // ── INTRO ──
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            setTimeout(() => introOverlay.remove(), 1200);
        }, 3000);
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

    // ═══════════════════════════════════════════════
    //  3D WORK GALLERY CAROUSEL
    // ═══════════════════════════════════════════════

    // All 28 work photos (excluding the 3 used in the stage)
    const carouselPhotos = [
        { src: 'work/IMG-20260512-WA0004.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260512-WA0006.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260513-WA0004.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260513-WA0005.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260515-WA0003.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260520-WA0001.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260520-WA0003.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260522-WA0019.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260522-WA0022.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260529-WA0002.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260529-WA0003.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260529-WA0004.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260529-WA0005.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260530-WA0007.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260606-WA0003.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260608-WA0000.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260608-WA0001.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260608-WA0002.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260608-WA0003.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260609-WA0005.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260611-WA0008.jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260617-WA0004 (1).jpg', label: 'Work · 2026' },
        { src: 'work/IMG-20260617-WA0005 (1).jpg', label: 'Work · 2026' },
        { src: 'work/WhatsApp Image 2026-06-09 at 3.43.52 PM.jpeg', label: 'Work · 2026' },
        { src: 'work/WhatsApp Image 2026-06-17 at 5.00.22 PM.jpeg', label: 'Work · 2026' },
    ];

    const scene        = document.getElementById('carouselScene');
    const counterEl    = document.getElementById('carouselCounter');
    const prevBtn      = document.getElementById('prevBtn');
    const nextBtn      = document.getElementById('nextBtn');

    if (!scene) return; // guard if section not present

    const total        = carouselPhotos.length;
    const angleStep    = 360 / total;
    // Push cards far enough apart so they don't overlap
    const radius       = Math.round((220 / 2) / Math.tan(Math.PI / total)) + 80;

    let currentAngle   = 0;   // degrees, rotation around Y
    let targetAngle    = 0;
    let currentIndex   = 0;
    let isAnimating    = false;

    // Build cards
    carouselPhotos.forEach((photo, i) => {
        const card = document.createElement('div');
        card.classList.add('carousel-card');
        if (i === 0) card.classList.add('is-active');

        const img = document.createElement('img');
        img.src   = photo.src;
        img.alt   = photo.label;
        img.loading = 'lazy';

        const label = document.createElement('div');
        label.classList.add('carousel-card-label');
        label.textContent = photo.label;

        card.appendChild(img);
        card.appendChild(label);
        scene.appendChild(card);

        // Click any card → rotate to it
        card.addEventListener('click', () => {
            goToIndex(i);
        });

        // Place in 3D ring
        const cardAngle = i * angleStep;
        card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
    });

    function getCards() {
        return scene.querySelectorAll('.carousel-card');
    }

    function updateActiveCard() {
        const cards = getCards();
        cards.forEach((c, i) => c.classList.toggle('is-active', i === currentIndex));
    }

    function applyRotation(smooth = true) {
        scene.style.transition = smooth
            ? 'transform 0.9s cubic-bezier(0.23,1,0.32,1)'
            : 'none';
        scene.style.transform = `rotateY(${-currentAngle}deg)`;
        updateActiveCard();
        if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${total}`;
    }

    function goToIndex(idx) {
        currentIndex = ((idx % total) + total) % total;
        currentAngle = currentIndex * angleStep;
        applyRotation(true);
    }

    // Prev / Next buttons
    prevBtn && prevBtn.addEventListener('click', () => goToIndex(currentIndex - 1));
    nextBtn && nextBtn.addEventListener('click', () => goToIndex(currentIndex + 1));

    // Keyboard arrows when carousel is in view
    document.addEventListener('keydown', (e) => {
        const wrapper = document.getElementById('carouselWrapper');
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;
        if (e.key === 'ArrowRight') goToIndex(currentIndex + 1);
        if (e.key === 'ArrowLeft')  goToIndex(currentIndex - 1);
    });

    // ── Scroll inside the wrapper to spin ──
    const wrapper = document.getElementById('carouselWrapper');
    if (wrapper) {
        wrapper.addEventListener('wheel', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
            if (!inView) return;
            e.preventDefault();
            const direction = e.deltaY > 0 ? 1 : -1;
            goToIndex(currentIndex + direction);
        }, { passive: false });
    }

    // ── Drag to spin ──
    let dragStartX    = 0;
    let dragStartAngle = 0;
    let isDragging    = false;

    scene.addEventListener('mousedown', (e) => {
        isDragging     = true;
        dragStartX     = e.clientX;
        dragStartAngle = currentAngle;
        scene.style.transition = 'none';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta = (e.clientX - dragStartX) * 0.4;
        currentAngle = dragStartAngle - delta;
        scene.style.transform = `rotateY(${-currentAngle}deg)`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        // Snap to nearest card
        currentIndex = Math.round(currentAngle / angleStep);
        currentAngle = currentIndex * angleStep;
        currentIndex = ((currentIndex % total) + total) % total;
        applyRotation(true);
    });

    // Touch drag support
    let touchStartX = 0;
    scene.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        dragStartAngle = currentAngle;
        scene.style.transition = 'none';
    }, { passive: true });

    scene.addEventListener('touchmove', (e) => {
        const delta = (e.touches[0].clientX - touchStartX) * 0.4;
        currentAngle = dragStartAngle - delta;
        scene.style.transform = `rotateY(${-currentAngle}deg)`;
    }, { passive: true });

    scene.addEventListener('touchend', () => {
        currentIndex = Math.round(currentAngle / angleStep);
        currentAngle = currentIndex * angleStep;
        currentIndex = ((currentIndex % total) + total) % total;
        applyRotation(true);
    });

    // Initial render
    applyRotation(false);

    // ── Gallery Stage 3D mouse parallax ──
    const stage = document.getElementById('galleryStage');
    const centerPhoto = document.getElementById('centerPhoto');
    if (stage && centerPhoto) {
        stage.addEventListener('mousemove', (e) => {
            const rect   = stage.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const dx     = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
            const dy     = (e.clientY - cy) / (rect.height / 2); // -1 to 1
            const tiltX  =  dy * -8;  // tilt up/down
            const tiltY  =  dx *  10; // tilt left/right
            centerPhoto.style.transform = `scale(1.04) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        stage.addEventListener('mouseleave', () => {
            centerPhoto.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
        });
    }

    // ── Auto-rotate carousel when idle ──
    let autoRotateTimer = null;
    let userInteracted  = false;

    function startAutoRotate() {
        if (autoRotateTimer) return;
        autoRotateTimer = setInterval(() => {
            if (!userInteracted) goToIndex(currentIndex + 1);
        }, 3500);
    }

    function resetAutoRotate() {
        userInteracted = true;
        clearInterval(autoRotateTimer);
        autoRotateTimer = null;
        setTimeout(() => {
            userInteracted = false;
            startAutoRotate();
        }, 6000);
    }

    if (prevBtn) prevBtn.addEventListener('click', resetAutoRotate);
    if (nextBtn) nextBtn.addEventListener('click', resetAutoRotate);
    scene.addEventListener('mousedown', resetAutoRotate);
    scene.addEventListener('touchstart', resetAutoRotate, { passive: true });

    // Start auto-rotate only when carousel is visible
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoRotate();
            } else {
                clearInterval(autoRotateTimer);
                autoRotateTimer = null;
            }
        });
    }, { threshold: 0.3 });

    if (wrapper) carouselObserver.observe(wrapper);
});

