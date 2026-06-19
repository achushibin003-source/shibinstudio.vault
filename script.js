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

    // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
    //  CINEMATIC ORBIT CAROUSEL GALLERY
    // \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

    const orbitPhotos = [
        'work/IMG-20260512-WA0004.jpg',
        'work/IMG-20260512-WA0006.jpg',
        'work/IMG-20260513-WA0004.jpg',
        'work/IMG-20260513-WA0005.jpg',
        'work/IMG-20260515-WA0003.jpg',
        'work/IMG-20260520-WA0001.jpg',
        'work/IMG-20260520-WA0003.jpg',
        'work/IMG-20260522-WA0019.jpg',
        'work/IMG-20260522-WA0022.jpg',
        'work/IMG-20260529-WA0002.jpg',
        'work/IMG-20260529-WA0003.jpg',
        'work/IMG-20260529-WA0004.jpg',
        'work/IMG-20260529-WA0005.jpg',
        'work/IMG-20260530-WA0007.jpg',
        'work/IMG-20260606-WA0003.jpg',
        'work/IMG-20260608-WA0000.jpg',
        'work/IMG-20260608-WA0001.jpg',
        'work/IMG-20260608-WA0002.jpg',
        'work/IMG-20260608-WA0003.jpg',
        'work/IMG-20260609-WA0005.jpg',
        'work/IMG-20260611-WA0008.jpg',
        'work/IMG-20260617-WA0004 (1).jpg',
        'work/IMG-20260617-WA0005 (1).jpg',
        'work/WhatsApp Image 2026-06-09 at 3.43.52 PM.jpeg',
        'work/WhatsApp Image 2026-06-17 at 5.00.22 PM.jpeg',
    ];

    const orbitStage  = document.getElementById('orbitStage');
    const orbitHero   = document.getElementById('orbitHero');
    const orbitRing   = document.getElementById('orbitRing');
    const orbitCount  = document.getElementById('orbitCount');

    if (!orbitRing) return; // guard

    const N          = orbitPhotos.length;
    const ANGLE_STEP = 360 / N;

    // \u2500\u2500 Responsive orbit radius \u2500\u2500
    function getRadius() {
        const w = window.innerWidth;
        if (w <= 480)  return 240;
        if (w <= 768)  return 320;
        if (w <= 1100) return 400;
        return 500;
    }

    // \u2500\u2500 Animation state \u2500\u2500
    let currentAngle = 0;   // smoothed display angle
    let targetAngle  = 0;   // scroll / drag target
    let rafId        = null;

    // \u2500\u2500 Build orbit cards \u2500\u2500
    function buildCards() {
        orbitRing.innerHTML = '';
        const R = getRadius();

        orbitPhotos.forEach((src, i) => {
            const card = document.createElement('div');
            card.className = 'orbit-card';
            card.dataset.index = i;

            // Static 3D position: each card on the ring at its base angle
            const baseAngle = i * ANGLE_STEP;
            card.style.transform = `rotateY(${baseAngle}deg) translateZ(${R}px)`;

            const img = document.createElement('img');
            img.src     = src;
            img.alt     = `Work ${i + 1}`;
            img.loading = 'lazy';

            const overlay = document.createElement('div');
            overlay.className = 'orbit-card-overlay';

            const glass = document.createElement('div');
            glass.className = 'orbit-card-glass';

            const num = document.createElement('span');
            num.className   = 'orbit-card-num';
            num.textContent = String(i + 1).padStart(2, '0');

            card.appendChild(img);
            card.appendChild(overlay);
            card.appendChild(glass);
            card.appendChild(num);
            orbitRing.appendChild(card);
        });
    }

    buildCards();

    // \u2500\u2500 Per-frame card visual update \u2500\u2500
    // Each card's "world angle" = its base angle + the ring's current rotation.
    // Depth = cos(worldAngle): +1 = directly in front, -1 = directly behind.
    function updateCards() {
        const cards = orbitRing.querySelectorAll('.orbit-card');
        let frontIdx   = 0;
        let maxDepth   = -Infinity;

        cards.forEach((card, i) => {
            const baseAngle  = i * ANGLE_STEP;
            const worldAngle = baseAngle + currentAngle;
            const rad        = worldAngle * Math.PI / 180;
            const depth      = Math.cos(rad);              // -1 to +1
            const t          = (depth + 1) / 2;            //  0 to 1

            // Brightness: 0.22 (back) → 1.0 (front)
            const brightness = 0.22 + 0.78 * t;
            // Blur: 7px (back) → 0px (front)
            const blur = (1 - t) * 7;
            // Z-index for correct 2D paint order
            card.style.zIndex = Math.round(t * 100);
            card.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;

            if (depth > maxDepth) { maxDepth = depth; frontIdx = i; }
        });

        // Highlight front card
        cards.forEach((card, i) => card.classList.toggle('is-front', i === frontIdx));

        // Update counter
        if (orbitCount) {
            orbitCount.textContent =
                `${String(frontIdx + 1).padStart(2, '0')} / ${N}`;
        }
    }

    // Initial visual state (orbit hidden \u2192 just call update silently)
    updateCards();

    // \u2500\u2500 Smooth animation loop \u2500\u2500
    function animate() {
        const diff = targetAngle - currentAngle;

        // Stop when close enough
        if (Math.abs(diff) < 0.01) {
            currentAngle = targetAngle;
            orbitRing.style.transform = `rotateY(${currentAngle}deg)`;
            updateCards();
            rafId = null;
            return;
        }

        // Exponential ease (lerp factor 0.07 = smooth, cinematic)
        currentAngle += diff * 0.07;
        orbitRing.style.transform = `rotateY(${currentAngle}deg)`;
        updateCards();
        rafId = requestAnimationFrame(animate);
    }

    function startAnimate() {
        if (rafId) return;
        rafId = requestAnimationFrame(animate);
    }

    // \u2500\u2500 Hover \u2192 activate / deactivate orbit \u2500\u2500
    if (orbitStage) {
        orbitStage.addEventListener('mouseenter', () => {
            orbitStage.classList.add('is-active');
        });
        orbitStage.addEventListener('mouseleave', () => {
            orbitStage.classList.remove('is-active');
        });
    }

    // \u2500\u2500 Hero tilt on mouse move (inactive state only) \u2500\u2500
    if (orbitHero && orbitStage) {
        orbitStage.addEventListener('mousemove', (e) => {
            if (orbitStage.classList.contains('is-active')) return;
            const rect = orbitStage.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
            const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
            orbitHero.style.transform =
                `scale(1.04) rotateX(${dy * -9}deg) rotateY(${dx * 11}deg)`;
        });
        orbitStage.addEventListener('mouseleave', () => {
            orbitHero.style.transform = '';
        });
    }

    // \u2500\u2500 Scroll to rotate \u2500\u2500
    if (orbitStage) {
        orbitStage.addEventListener('wheel', (e) => {
            e.preventDefault();
            orbitStage.classList.add('is-active');
            // Positive scroll (down) \u2192 ring turns to reveal next card
            targetAngle -= e.deltaY * 0.28;
            startAnimate();
        }, { passive: false });
    }

    // \u2500\u2500 Mouse drag to rotate \u2500\u2500
    let isDragging  = false;
    let dragLastX   = 0;

    if (orbitStage) {
        orbitStage.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragLastX  = e.clientX;
            e.preventDefault();
        });
    }

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta  = e.clientX - dragLastX;
        dragLastX    = e.clientX;
        targetAngle += delta * 0.55;
        startAnimate();
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    // \u2500\u2500 Touch drag \u2500\u2500
    let touchLastX = 0;
    if (orbitStage) {
        orbitStage.addEventListener('touchstart', (e) => {
            touchLastX = e.touches[0].clientX;
            orbitStage.classList.add('is-active');
        }, { passive: true });

        orbitStage.addEventListener('touchmove', (e) => {
            const delta  = e.touches[0].clientX - touchLastX;
            touchLastX   = e.touches[0].clientX;
            targetAngle += delta * 0.55;
            startAnimate();
        }, { passive: true });
    }

    // \u2500\u2500 Custom cursor \u2500\u2500
    const cursor     = document.getElementById('galleryCursor');
    const cursorRing = document.getElementById('galleryCursorRing');
    let   cRingX = 0, cRingY = 0, cRafId;

    if (cursor && cursorRing) {
        const galSection = document.getElementById('gallery');
        if (galSection) {
            galSection.addEventListener('mouseenter', () => {
                cursor.style.opacity     = '1';
                cursorRing.style.opacity = '1';
            });
            galSection.addEventListener('mouseleave', () => {
                cursor.style.opacity     = '0';
                cursorRing.style.opacity = '0';
                cancelAnimationFrame(cRafId);
            });
            galSection.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top  = e.clientY + 'px';
                cancelAnimationFrame(cRafId);
                const lagRing = () => {
                    cRingX += (e.clientX - cRingX) * 0.12;
                    cRingY += (e.clientY - cRingY) * 0.12;
                    cursorRing.style.left = cRingX + 'px';
                    cursorRing.style.top  = cRingY + 'px';
                    cRafId = requestAnimationFrame(lagRing);
                };
                cRafId = requestAnimationFrame(lagRing);
            });
        }
    }

    // \u2500\u2500 Rebuild on resize (recalculate radius) \u2500\u2500
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            buildCards();
            orbitRing.style.transform = `rotateY(${currentAngle}deg)`;
            updateCards();
        }, 180);
    });

});

