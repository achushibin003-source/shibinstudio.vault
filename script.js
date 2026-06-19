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
    //  CINEMATIC ORBITAL GALLERY
    // ═══════════════════════════════════════════════

    const galleryPhotos = [
        { src: 'work/IMG-20260512-WA0004.jpg' },
        { src: 'work/IMG-20260512-WA0006.jpg' },
        { src: 'work/IMG-20260513-WA0004.jpg' },
        { src: 'work/IMG-20260513-WA0005.jpg' },
        { src: 'work/IMG-20260515-WA0003.jpg' },
        { src: 'work/IMG-20260520-WA0001.jpg' },
        { src: 'work/IMG-20260520-WA0003.jpg' },
        { src: 'work/IMG-20260522-WA0019.jpg' },
        { src: 'work/IMG-20260522-WA0022.jpg' },
        { src: 'work/IMG-20260529-WA0002.jpg' },
        { src: 'work/IMG-20260529-WA0003.jpg' },
        { src: 'work/IMG-20260529-WA0004.jpg' },
        { src: 'work/IMG-20260529-WA0005.jpg' },
        { src: 'work/IMG-20260530-WA0007.jpg' },
        { src: 'work/IMG-20260606-WA0003.jpg' },
        { src: 'work/IMG-20260608-WA0000.jpg' },
        { src: 'work/IMG-20260608-WA0001.jpg' },
        { src: 'work/IMG-20260608-WA0002.jpg' },
        { src: 'work/IMG-20260608-WA0003.jpg' },
        { src: 'work/IMG-20260609-WA0005.jpg' },
        { src: 'work/IMG-20260611-WA0008.jpg' },
        { src: 'work/IMG-20260617-WA0004 (1).jpg' },
        { src: 'work/IMG-20260617-WA0005 (1).jpg' },
        { src: 'work/WhatsApp Image 2026-06-09 at 3.43.52 PM.jpeg' },
        { src: 'work/WhatsApp Image 2026-06-17 at 5.00.22 PM.jpeg' },
    ];

    // ── STAGE HOVER REVEAL ──
    const stage       = document.getElementById('galleryStage');
    const centerPhoto = document.getElementById('centerPhoto');
    const scrollIndicator = document.getElementById('galleryScrollIndicator');

    if (stage) {
        stage.addEventListener('mouseenter', () => stage.classList.add('is-hovered'));
        stage.addEventListener('mouseleave', () => stage.classList.remove('is-hovered'));

        // ── Deep 3D Parallax tilt on center photo ──
        if (centerPhoto) {
            stage.addEventListener('mousemove', (e) => {
                const rect = stage.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const dx   = (e.clientX - cx) / (rect.width  / 2);
                const dy   = (e.clientY - cy) / (rect.height / 2);
                const tiltX = dy * -10;
                const tiltY = dx *  12;
                centerPhoto.style.transform =
                    `scale(1.05) perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });
            stage.addEventListener('mouseleave', () => {
                centerPhoto.style.transform = '';
            });
        }
    }

    // ── CUSTOM CURSOR (gallery section area) ──
    const cursor     = document.getElementById('galleryCursor');
    const cursorRing = document.getElementById('galleryCursorRing');
    let   ringX = 0, ringY = 0;

    if (cursor && cursorRing) {
        let rafId;
        const moveCursor = (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top  = e.clientY + 'px';
            // Lagged ring follow
            cancelAnimationFrame(rafId);
            const animateRing = () => {
                ringX += (e.clientX - ringX) * 0.12;
                ringY += (e.clientY - ringY) * 0.12;
                cursorRing.style.left = ringX + 'px';
                cursorRing.style.top  = ringY + 'px';
                rafId = requestAnimationFrame(animateRing);
            };
            rafId = requestAnimationFrame(animateRing);
        };

        const galSection = document.getElementById('gallery');
        if (galSection) {
            galSection.addEventListener('mouseenter', () => {
                cursor.style.opacity = '1';
                cursorRing.style.opacity = '1';
            });
            galSection.addEventListener('mouseleave', () => {
                cursor.style.opacity = '0';
                cursorRing.style.opacity = '0';
                cancelAnimationFrame(rafId);
            });
            galSection.addEventListener('mousemove', moveCursor);
        }
    }

    // ── BUILD ORBITAL GRID ──
    const orbitalTrack = document.getElementById('orbitalTrack');
    if (!orbitalTrack) return;

    // Responsive card width
    function getCardWidth() {
        const w = window.innerWidth;
        if (w <= 500)  return 110;
        if (w <= 768)  return 140;
        if (w <= 1100) return 180;
        return 220;
    }

    // Compute column count based on viewport
    function getColCount() {
        const w = window.innerWidth;
        if (w <= 500)  return 2;
        if (w <= 768)  return 3;
        if (w <= 1100) return 4;
        return 5;
    }

    const orbitalItems = [];

    function buildOrbitalGrid() {
        orbitalTrack.innerHTML = '';
        orbitalItems.length = 0;

        const colCount  = getColCount();
        const cardW     = getCardWidth();
        const gapX      = 28;
        const gapY      = 36;
        const cardH     = cardW * 1.25;
        const trackW    = colCount * cardW + (colCount - 1) * gapX;

        orbitalTrack.style.width    = trackW + 'px';
        orbitalTrack.style.height   = (Math.ceil(galleryPhotos.length / colCount)) * (cardH + gapY) + 'px';

        galleryPhotos.forEach((photo, i) => {
            const col    = i % colCount;
            const row    = Math.floor(i / colCount);
            const left   = col * (cardW + gapX);
            const top    = row * (cardH + gapY);

            // Subtle arc offset — alternating rows sway left/right for organic feel
            const arcOffset = (row % 2 === 0 ? 1 : -1) * (col - (colCount - 1) / 2) * 6;

            const item = document.createElement('div');
            item.className = 'orbital-item';
            item.style.left   = left + 'px';
            item.style.top    = (top + arcOffset) + 'px';
            item.style.width  = cardW + 'px';

            const card = document.createElement('div');
            card.className = 'orbital-card';

            const img = document.createElement('img');
            img.src     = photo.src;
            img.alt     = `Work ${i + 1}`;
            img.loading = 'lazy';

            const overlay = document.createElement('div');
            overlay.className = 'orbital-card-overlay';

            const glass = document.createElement('div');
            glass.className = 'orbital-card-glass';

            const labelWrap = document.createElement('div');
            labelWrap.className = 'orbital-label';

            const labelTxt = document.createElement('span');
            labelTxt.className   = 'orbital-label-text';
            labelTxt.textContent = 'Work · 2026';

            const labelNum = document.createElement('span');
            labelNum.className   = 'orbital-label-num';
            labelNum.textContent = String(i + 1).padStart(2, '0');

            labelWrap.appendChild(labelTxt);
            labelWrap.appendChild(labelNum);

            card.appendChild(img);
            card.appendChild(overlay);
            card.appendChild(glass);
            card.appendChild(labelWrap);
            item.appendChild(card);
            orbitalTrack.appendChild(item);
            orbitalItems.push(item);

            // Micro-parallax on card hover
            card.addEventListener('mousemove', (e) => {
                const r  = card.getBoundingClientRect();
                const mx = (e.clientX - r.left) / r.width  - 0.5;
                const my = (e.clientY - r.top)  / r.height - 0.5;
                card.style.transform =
                    `translateY(-12px) scale(1.04) rotateY(${mx * 8}deg) rotateX(${my * -6}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    buildOrbitalGrid();

    // ── SCROLL-DRIVEN REVEAL (IntersectionObserver) ──
    // Each item starts as translateY(180px) scale(0.6) opacity(0)
    // Observer flips it to visible → CSS transition fires

    let observerActive = false;

    function setupObserver() {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -60px 0px'
        });

        orbitalItems.forEach(item => io.observe(item));
        return io;
    }

    let itemObserver = setupObserver();

    // ── SCROLL PARALLAX — items react to global scroll ──
    // Each card shifts slightly on scroll creating depth layers
    let ticking = false;

    function onGlobalScroll() {
        if (ticking) return;
        requestAnimationFrame(() => {
            const scrolled = window.scrollY;

            // Hide scroll indicator once user scrolls past the stage
            if (scrollIndicator) {
                const stageEl = document.getElementById('galleryStage');
                if (stageEl) {
                    const stageBottom = stageEl.getBoundingClientRect().bottom;
                    scrollIndicator.classList.toggle('hidden', stageBottom < window.innerHeight * 0.4);
                }
            }

            ticking = false;
        });
        ticking = true;
    }

    window.addEventListener('scroll', onGlobalScroll, { passive: true });

    // ── CURSOR PARALLAX inside orbital section ──
    // Cards gently drift in response to mouse position
    let mouseX = 0, mouseY = 0;
    let prafId;

    const orbitalSection = document.getElementById('orbitalSection');
    if (orbitalSection) {
        orbitalSection.addEventListener('mousemove', (e) => {
            const rect = orbitalSection.getBoundingClientRect();
            mouseX = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
            mouseY = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);

            cancelAnimationFrame(prafId);
            const animateParallax = () => {
                orbitalItems.forEach((item, i) => {
                    const depth   = ((i % 3) + 1) * 0.5;  // 0.5, 1.0, 1.5
                    const offsetX = mouseX * depth * 8;
                    const offsetY = mouseY * depth * 4;
                    // Only shift if item is already revealed
                    if (item.classList.contains('visible')) {
                        item.style.setProperty('--px', `${offsetX}px`);
                        item.style.setProperty('--py', `${offsetY}px`);
                        item.style.marginLeft = offsetX + 'px';
                        item.style.marginTop  = offsetY + 'px';
                    }
                });
            };
            prafId = requestAnimationFrame(animateParallax);
        });

        orbitalSection.addEventListener('mouseleave', () => {
            cancelAnimationFrame(prafId);
            orbitalItems.forEach(item => {
                item.style.marginLeft = '';
                item.style.marginTop  = '';
            });
        });
    }

    // Rebuild grid on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            itemObserver.disconnect();
            buildOrbitalGrid();
            itemObserver = setupObserver();
        }, 200);
    });
});

