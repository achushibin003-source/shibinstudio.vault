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

    // Click effect animation removed in favor of high-fidelity cursor shockwave ripple.

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
        'work/IMG-20260515-WA0003.jpg',
        'work/IMG-20260520-WA0001.jpg',
        'work/IMG-20260520-WA0003.jpg',
        'work/IMG-20260522-WA0019.jpg',
        'work/IMG-20260522-WA0022.jpg',
        'work/IMG-20260529-WA0002.jpg',
        'work/IMG-20260529-WA0003.jpg',
        'work/IMG-20260529-WA0005.jpg',
        'work/IMG-20260530-WA0007.jpg',
        'work/IMG-20260606-WA0003.jpg',
        'work/IMG-20260608-WA0000.jpg',
        'work/IMG-20260608-WA0001.jpg',
        'work/IMG-20260608-WA0002.jpg',
        'work/IMG-20260608-WA0003.jpg',
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

    // ===============================================
    //  ULTRA-PREMIUM GLOWING CUSTOM CURSOR SYSTEM
    // ===============================================

    // 1. Dynamic DOM Injection: Custom Cursor Dot, Ring (with internal badge layout), and Canvas Trail
    const cursorCanvas = document.createElement('canvas');
    cursorCanvas.id = 'cursor-canvas';
    document.body.appendChild(cursorCanvas);
    const ctx = cursorCanvas.getContext('2d');

    const customCursorDot = document.createElement('div');
    customCursorDot.className = 'custom-cursor-dot';
    customCursorDot.id = 'customCursorDot';
    
    const customCursorRing = document.createElement('div');
    customCursorRing.className = 'custom-cursor-ring';
    customCursorRing.id = 'customCursorRing';

    // Inject Badge Container inside Cursor Ring
    const cursorBadge = document.createElement('div');
    cursorBadge.className = 'cursor-badge';
    const cursorBadgeIcon = document.createElement('div');
    cursorBadgeIcon.className = 'cursor-badge-icon';
    const cursorBadgeText = document.createElement('span');
    cursorBadgeText.className = 'cursor-badge-text';
    
    cursorBadge.appendChild(cursorBadgeIcon);
    cursorBadge.appendChild(cursorBadgeText);
    customCursorRing.appendChild(cursorBadge);
    
    document.body.appendChild(customCursorDot);
    document.body.appendChild(customCursorRing);
    
    // Enable custom cursor by default
    document.body.classList.add('has-custom-cursor');

    // 2. Canvas Resizing Setup
    function resizeCanvas() {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 3. Stardust Particle System
    const particles = [];
    
    class StardustParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.3 + 0.4;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 0.25; // Slight drift upward
            this.size = Math.random() * 3.5 + 1; // Size between 1px and 4.5px
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.016; // Fades out in about 50 frames
            this.color = color;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw(c) {
            c.save();
            c.globalAlpha = this.alpha;
            c.beginPath();
            c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            c.fillStyle = this.color;
            c.shadowBlur = 6;
            c.shadowColor = this.color;
            c.fill();
            c.restore();
        }
    }

    // 4. Cursor State & Tracking Coordinates
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = window.innerWidth / 2;
    let dotY = window.innerHeight / 2;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    
    let lastSpawnX = window.innerWidth / 2;
    let lastSpawnY = window.innerHeight / 2;
    
    let activeMagneticElement = null;
    let currentBadgeType = null;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 5. Context-Aware Custom Badge Managers
    function showCursorBadge(type) {
        if (currentBadgeType === type) return;
        currentBadgeType = type;
        
        customCursorRing.classList.add('has-badge');
        customCursorDot.classList.add('has-badge');
        
        // Remove standard hover triggers if present
        customCursorRing.classList.remove('is-hovering');
        customCursorDot.classList.remove('is-hovering');
        
        if (type === 'play') {
            cursorBadgeText.textContent = 'PLAY';
            cursorBadgeIcon.innerHTML = `
                <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: #ffffff;">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        } else if (type === 'drag') {
            cursorBadgeText.textContent = 'DRAG';
            cursorBadgeIcon.innerHTML = `
                <svg viewBox="0 0 24 24" style="width: 15px; height: 15px; fill: #ffffff;">
                    <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 1h-4v3H7l5 5 5-5h-3v-3z"/>
                </svg>
            `;
        }
    }

    function hideCursorBadge() {
        if (!currentBadgeType) return;
        currentBadgeType = null;
        
        customCursorRing.classList.remove('has-badge');
        customCursorDot.classList.remove('has-badge');
        cursorBadgeText.textContent = '';
        cursorBadgeIcon.innerHTML = '';
    }

    // 6. Global Event Delegation for Interactive States
    document.addEventListener('mouseover', (e) => {
        // Project Card -> Show PLAY badge
        const projectCard = e.target.closest('.project-card');
        if (projectCard) {
            showCursorBadge('play');
            return;
        }

        // Gravity Stage / Gallery Card -> Show DRAG badge
        const gravityCard = e.target.closest('.gravity-card, .gravity-wrap');
        if (gravityCard) {
            showCursorBadge('drag');
            return;
        }

        // Magnetic element snaps the ring -> Hide badge
        const magnetic = e.target.closest('.nav a, .hero-socials-inline a, .email-link');
        if (magnetic) {
            hideCursorBadge();
            return;
        }

        // Standard hover elements -> Expand dot and ring
        const hoverTarget = e.target.closest('.skill-tag, .service-item, button, a, .contact-details a');
        if (hoverTarget) {
            hideCursorBadge();
            customCursorDot.classList.add('is-hovering');
            customCursorRing.classList.add('is-hovering');
            return;
        }

        // Default: reset all hover states
        hideCursorBadge();
        customCursorDot.classList.remove('is-hovering');
        customCursorRing.classList.remove('is-hovering');
    });

    // Track mouse entering/leaving viewport to hide custom cursor elements
    document.addEventListener('mouseleave', () => {
        customCursorDot.style.opacity = '0';
        customCursorRing.style.opacity = '0';
        cursorCanvas.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        customCursorDot.style.opacity = '1';
        customCursorRing.style.opacity = '1';
        cursorCanvas.style.opacity = '1';
    });

    // 7. Cursor Easing & Canvas Particle Animation Loop
    function updateCursorPosition() {
        // 7a. Draw Canvas Particles (Stardust Trail)
        ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        
        // Spawn stardust particles with interpolation for high-speed paths
        const dist = Math.hypot(mouseX - lastSpawnX, mouseY - lastSpawnY);
        if (dist > 3) {
            const steps = Math.min(Math.floor(dist / 3), 6);
            for (let i = 0; i < steps; i++) {
                const ratio = i / steps;
                const px = lastSpawnX + (mouseX - lastSpawnX) * ratio;
                const py = lastSpawnY + (mouseY - lastSpawnY) * ratio;
                
                // Adaptive colors
                let pColor = 'rgba(59, 130, 246, 0.7)'; // Accent blue
                if (customCursorRing.classList.contains('is-hovering')) {
                    pColor = 'rgba(244, 63, 94, 0.75)'; // Rose pink
                } else if (customCursorRing.classList.contains('has-badge')) {
                    pColor = 'rgba(255, 255, 255, 0.45)'; // White stardust
                }
                
                particles.push(new StardustParticle(px, py, pColor));
            }
            lastSpawnX = mouseX;
            lastSpawnY = mouseY;
        }

        // Update & Render existing particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            } else {
                p.draw(ctx);
            }
        }

        // 7b. Dot Position Update (High stiffness)
        const dDotX = mouseX - dotX;
        const dDotY = mouseY - dotY;
        dotX += dDotX * 0.35;
        dotY += dDotY * 0.35;
        customCursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

        // 7c. Ring Position Update (Lagging with Squash-and-Stretch physics or Magnetic Snapping)
        if (activeMagneticElement) {
            // Snapped to a magnetic link/button
            const rect = activeMagneticElement.getBoundingClientRect();
            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;
            
            const dRingX = elCenterX - ringX;
            const dRingY = elCenterY - ringY;
            ringX += dRingX * 0.22;
            ringY += dRingY * 0.22;
            
            customCursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            
            const padding = 12;
            customCursorRing.style.width = `${rect.width + padding}px`;
            customCursorRing.style.height = `${rect.height + padding}px`;
            
            const styles = window.getComputedStyle(activeMagneticElement);
            customCursorRing.style.borderRadius = styles.borderRadius || '4px';
        } else {
            // Standard tracking with inertia
            const dRingX = mouseX - ringX;
            const dRingY = mouseY - ringY;
            
            const lastRingX = ringX;
            const lastRingY = ringY;
            
            ringX += dRingX * 0.16;
            ringY += dRingY * 0.16;
            
            const vx = ringX - lastRingX;
            const vy = ringY - lastRingY;
            const speed = Math.hypot(vx, vy);
            const stretch = Math.min(speed * 0.08, 0.4); // Max 40% stretch deformation
            const angle = Math.atan2(vy, vx);
            
            let transformStr = `translate3d(${ringX}px, ${ringY}px, 0)`;
            
            if (customCursorRing.classList.contains('has-badge')) {
                // Keep badge perfectly circular
                customCursorRing.style.transform = transformStr;
                customCursorRing.style.width = '';
                customCursorRing.style.height = '';
                customCursorRing.style.borderRadius = '';
            } else {
                // Apply Squash & Stretch along the velocity vector
                transformStr += ` rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.5}) rotate(${-angle}rad)`;
                customCursorRing.style.transform = transformStr;
                
                // Clear inline style sizes so CSS properties apply
                customCursorRing.style.width = '';
                customCursorRing.style.height = '';
                customCursorRing.style.borderRadius = '';
            }
        }

        requestAnimationFrame(updateCursorPosition);
    }
    requestAnimationFrame(updateCursorPosition);

    // 8. Magnetic Snapping Observer Init
    function initMagneticEffects() {
        const magneticElements = document.querySelectorAll('.nav a, .hero-socials-inline a, .email-link');
        
        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                activeMagneticElement = el;
                customCursorRing.classList.add('is-snapped');
                customCursorDot.classList.add('is-snapped');
            });
            
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                
                // Magnetic shift multiplier
                const shiftX = Math.max(-8, Math.min(8, dx * 0.15));
                const shiftY = Math.max(-8, Math.min(8, dy * 0.15));
                
                el.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
            });
            
            el.addEventListener('mouseleave', () => {
                activeMagneticElement = null;
                customCursorRing.classList.remove('is-snapped');
                customCursorDot.classList.remove('is-snapped');
                el.style.transform = '';
                
                customCursorRing.style.width = '';
                customCursorRing.style.height = '';
                customCursorRing.style.borderRadius = '';
            });
        });
    }
    initMagneticEffects();

    // 9. High-Fidelity Click Ripple Effect
    document.addEventListener('mousedown', (e) => {
        if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });


});

