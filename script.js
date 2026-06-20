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

    // ===============================================
    //  ANTI-GRAVITY HORIZONTAL GALLERY ENGINE
    // ===============================================

    const gravityPhotos = [
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
        'work/WhatsApp Image 2026-06-17 at 5.00.22 PM.jpeg'
    ];

    const gravityStage  = document.getElementById('gravityStage');
    const gravityTrack  = document.getElementById('gravityTrack');

    if (!gravityTrack) return; // guard

    const N = gravityPhotos.length;
    const BUFFER_SIZE = 3;

    // -- Sizing Configuration (sync with CSS variables) --
    function getLayoutMetrics() {
        const w = window.innerWidth;
        if (w <= 768) {
            return { cardWidth: 200, cardSpacing: 230, cardMargin: 15 };
        }
        return { cardWidth: 280, cardSpacing: 320, cardMargin: 20 };
    }

    // -- Animation & Scroll State --
    let currentX = 0;   // smoothed scroll index
    let targetX  = 0;   // target scroll index
    let rafId    = null;

    // -- Interaction States --
    let isHovered  = false;
    let isDragging = false;
    let isTouched  = false;

    // -- Generate portfolio cards (with cloning for infinite endless loop) --
    function buildGravityCards() {
        gravityTrack.innerHTML = '';
        const totalItems = [];

        // 1. Prepend clones of last BUFFER_SIZE items
        for (let j = N - BUFFER_SIZE; j < N; j++) {
            totalItems.push({ src: gravityPhotos[j], index: j });
        }
        // 2. Real items
        for (let j = 0; j < N; j++) {
            totalItems.push({ src: gravityPhotos[j], index: j });
        }
        // 3. Append clones of first BUFFER_SIZE items
        for (let j = 0; j < BUFFER_SIZE; j++) {
            totalItems.push({ src: gravityPhotos[j], index: j });
        }

        totalItems.forEach((item, i) => {
            const card = document.createElement('div');
            card.className = 'gravity-card';
            card.dataset.index = item.index;

            const inner = document.createElement('div');
            inner.className = 'gravity-card-inner';

            const media = document.createElement('div');
            media.className = 'gravity-card-media';

            const img = document.createElement('img');
            img.src = item.src;
            img.alt = `Portfolio Work ${item.index + 1}`;
            img.loading = 'lazy';

            const overlay = document.createElement('div');
            overlay.className = 'gravity-card-overlay';

            const glass = document.createElement('div');
            glass.className = 'gravity-card-glass';

            media.appendChild(img);
            inner.appendChild(media);
            inner.appendChild(overlay);
            inner.appendChild(glass);
            card.appendChild(inner);

            // Click-to-center functionality
            card.addEventListener('click', () => {
                if (card.classList.contains('is-left') || card.classList.contains('is-right')) {
                    targetX = i - BUFFER_SIZE;
                    startAnimate();
                }
            });

            gravityTrack.appendChild(card);
        });
    }

    buildGravityCards();

    // -- Update track translation and card states --
    function updateGalleryTrack() {
        const { cardWidth, cardSpacing, cardMargin } = getLayoutMetrics();
        const stageWidth = gravityStage.clientWidth || window.innerWidth;

        // Perform infinite wrap-around checks
        while (currentX >= N) {
            currentX -= N;
            targetX -= N;
        }
        while (currentX < 0) {
            currentX += N;
            targetX += N;
        }

        // Translate the track using relative DOM indices: domX = currentX + BUFFER_SIZE
        const domX = currentX + BUFFER_SIZE;
        const tx = (stageWidth / 2) - (domX * cardSpacing) - cardMargin - (cardWidth / 2);
        gravityTrack.style.transform = `translateX(${tx}px)`;

        // Identify center and flanking cards (by DOM index)
        const centerDomIdx = Math.round(domX);
        const cards = gravityTrack.querySelectorAll('.gravity-card');

        cards.forEach((card, idx) => {
            card.classList.remove('is-center', 'is-left', 'is-right');
            if (idx === centerDomIdx) {
                card.classList.add('is-center');
            } else if (idx === centerDomIdx - 1) {
                card.classList.add('is-left');
            } else if (idx === centerDomIdx + 1) {
                card.classList.add('is-right');
            }
        });
    }

    // Set initial layout
    updateGalleryTrack();

    // -- Animation Loop --
    const autoplaySpeed = 0.0035; // continuous drift speed when idle

    function animate() {
        if (!isHovered && !isDragging && !isTouched) {
            targetX += autoplaySpeed;
        }

        const diff = targetX - currentX;
        
        // Stop loop only when differences are zero AND autoplay is paused
        if (Math.abs(diff) < 0.001 && (isHovered || isDragging || isTouched)) {
            currentX = targetX;
            updateGalleryTrack();
            rafId = null;
            return;
        }

        currentX += diff * 0.08; // smooth easing factor
        updateGalleryTrack();
        rafId = requestAnimationFrame(animate);
    }

    function startAnimate() {
        if (!rafId) {
            rafId = requestAnimationFrame(animate);
        }
    }

    // Start autoplay loop automatically
    startAnimate();

    // -- Mouse interactions for hover & 3D tilt parallax --
    if (gravityStage) {
        gravityStage.addEventListener('mouseenter', () => {
            isHovered = true;
            gravityStage.classList.add('is-hovered');
        });

        gravityStage.addEventListener('mouseleave', () => {
            isHovered = false;
            gravityStage.classList.remove('is-hovered');
            // Reset 3D tilt on all cards
            const inners = gravityTrack.querySelectorAll('.gravity-card-inner');
            inners.forEach(inner => {
                inner.style.transform = '';
            });
        });

        gravityStage.addEventListener('mousemove', (e) => {
            // Apply independent 3D tilt to visible cards (center, left, right)
            const activeCards = gravityTrack.querySelectorAll('.is-center, .is-left, .is-right');
            activeCards.forEach(card => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;

                const dx = e.clientX - cardCenterX;
                const dy = e.clientY - cardCenterY;

                // Relative mouse offset percent (-1 to 1)
                const percentX = dx / (cardRect.width / 2);
                const percentY = dy / (cardRect.height / 2);

                // Elegant maximum tilt bounds
                const tiltX = percentY * -8;
                const tiltY = percentX * 10;

                const inner = card.querySelector('.gravity-card-inner');
                if (inner) {
                    inner.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(10px)`;
                }
            });
        });

        // Wheel horizontal scroll interaction
        gravityStage.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // Adjust scroll coordinate based on wheel delta
            targetX += e.deltaY * 0.0035;
            startAnimate();
        }, { passive: false });
    }

    // -- Mouse Drag Interaction --
    isDragging = false;
    let dragStartX = 0;
    let dragStartTargetX = 0;

    if (gravityStage) {
        gravityStage.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartTargetX = targetX;
            gravityStage.classList.add('is-dragging');
            e.preventDefault();
        });
    }

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        const { cardSpacing } = getLayoutMetrics();

        // Convert drag offset into target index shift
        targetX = dragStartTargetX - (dx / cardSpacing);
        startAnimate();
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            gravityStage.classList.remove('is-dragging');
            // Settle / snap to nearest card index
            targetX = Math.round(targetX);
            startAnimate();
        }
    });

    // -- Mobile Touch Interaction --
    let touchStartX = 0;
    let touchStartTargetX = 0;

    if (gravityStage) {
        gravityStage.addEventListener('touchstart', (e) => {
            isTouched = true;
            touchStartX = e.touches[0].clientX;
            touchStartTargetX = targetX;
            gravityStage.classList.add('is-hovered');
        }, { passive: true });

        gravityStage.addEventListener('touchmove', (e) => {
            const dx = e.touches[0].clientX - touchStartX;
            const { cardSpacing } = getLayoutMetrics();

            targetX = touchStartTargetX - (dx / cardSpacing);
            startAnimate();
        }, { passive: true });

        gravityStage.addEventListener('touchend', () => {
            isTouched = false;
            targetX = Math.round(targetX);
            startAnimate();
        }, { passive: true });
    }

    // -- Resize event re-aligning active metrics --
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateGalleryTrack();
        }, 150);
    });

});
