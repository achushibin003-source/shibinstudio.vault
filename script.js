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
    //  CUTE CHASING PET CURSOR SYSTEM
    // ===============================================

    // 1. Dynamic DOM Injection: Summon Controls, Custom Cursor, Pet
    const customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    customCursor.id = 'customCursor';
    
    const customCursorRing = document.createElement('div');
    customCursorRing.className = 'custom-cursor-ring';
    customCursorRing.id = 'customCursorRing';
    
    document.body.appendChild(customCursor);
    document.body.appendChild(customCursorRing);
    
    // Enable custom cursor by default
    document.body.classList.add('has-custom-cursor');

    // Controls panel
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'pet-toggle-container';
    
    const petMuteBtn = document.createElement('button');
    petMuteBtn.className = 'pet-mute-btn';
    petMuteBtn.id = 'petMuteBtn';
    petMuteBtn.innerText = '🔊';
    petMuteBtn.title = 'Mute/Unmute Sounds';
    
    const petToggleBtn = document.createElement('button');
    petToggleBtn.className = 'pet-toggle-btn active';
    petToggleBtn.id = 'petToggleBtn';
    petToggleBtn.innerText = '🐱 Summoned';
    
    toggleContainer.appendChild(petMuteBtn);
    toggleContainer.appendChild(petToggleBtn);
    document.body.appendChild(toggleContainer);
    
    const petHintToast = document.createElement('div');
    petHintToast.className = 'pet-hint-toast';
    petHintToast.id = 'petHintToast';
    petHintToast.innerText = 'Click anywhere to drop fish treats! 🐟';
    document.body.appendChild(petHintToast);

    // Inject Pet Container
    const petContainer = document.createElement('div');
    petContainer.className = 'pet-container';
    petContainer.id = 'chasingPet';
    
    // Inner sprite holds the SVG cat
    const petSprite = document.createElement('div');
    petSprite.className = 'pet-sprite idle';
    petSprite.id = 'chasingPetSprite';
    
    // Cute vector cat SVG
    petSprite.innerHTML = `
        <svg viewBox="0 0 50 40" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <!-- Cat tail -->
            <path d="M 42 26 C 46 26, 48 20, 46 16 C 44 12, 42 16, 42 20 Z" fill="var(--accent-blue)" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Cat body -->
            <rect x="12" y="16" width="30" height="18" rx="6" fill="var(--accent-blue)" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Legs -->
            <rect x="15" y="32" width="5" height="6" rx="2" fill="var(--accent-blue)" stroke="#ffffff" stroke-width="1.5"/>
            <rect x="34" y="32" width="5" height="6" rx="2" fill="var(--accent-blue)" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Cat head -->
            <rect x="8" y="8" width="16" height="16" rx="4" fill="var(--accent-blue)" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Left ear -->
            <polygon points="8,8 4,1 12,5" fill="var(--accent-blue)" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Right ear -->
            <polygon points="20,8 24,1 16,5" fill="var(--accent-blue)" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Open Eyes -->
            <g class="pet-eyes-open" id="petEyesOpen">
                <circle cx="12" cy="14" r="1.5" fill="#ffffff"/>
                <circle cx="12" cy="14" r="0.7" fill="#000000"/>
                <circle cx="18" cy="14" r="1.5" fill="#ffffff"/>
                <circle cx="18" cy="14" r="0.7" fill="#000000"/>
            </g>
            <!-- Closed Eyes -->
            <g class="pet-eyes-closed" id="petEyesClosed" style="display: none;">
                <path d="M 10.5 14 Q 12 15.5 13.5 14" stroke="#ffffff" fill="none" stroke-width="1.2" stroke-linecap="round"/>
                <path d="M 16.5 14 Q 18 15.5 19.5 14" stroke="#ffffff" fill="none" stroke-width="1.2" stroke-linecap="round"/>
            </g>
            <!-- Nose & mouth -->
            <path d="M 15 17 L 15 18 C 14.5 18.5, 14 18.5, 14 18 M 15 18 C 15.5 18.5, 16 18.5, 16 18" stroke="#ffffff" fill="none" stroke-width="1"/>
        </svg>
    `;
    
    petContainer.appendChild(petSprite);
    document.body.appendChild(petContainer);

    // 2. Chasing Pet & Cursor State
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;

    let petX = window.innerWidth / 2 - 100;
    let petY = window.innerHeight / 2 + 100;
    
    let isSummoned = true;
    let isMuted = false;
    let score = 0;
    
    // States: 'IDLE', 'WALKING', 'RUNNING', 'SLEEPING', 'RETRIEVING', 'EATING'
    let petState = 'IDLE'; 
    let lastMouseTime = Date.now();
    let currentTreat = null;
    let audioCtx = null;
    let petUpdateTimer = null;
    let zzzSpawnInterval = null;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMouseTime = Date.now();
        
        // Wake up pet if sleeping
        if (petState === 'SLEEPING') {
            wakeUpPet();
        }
    });

    // Custom cursor hover interaction via event delegation
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, input, textarea, [role="button"], .gravity-card, .skill-tag');
        if (target) {
            customCursor.classList.add('is-hovering');
            customCursorRing.classList.add('is-hovering');
        } else {
            customCursor.classList.remove('is-hovering');
            customCursorRing.classList.remove('is-hovering');
        }
    });

    // Toggle custom cursor visibility when mouse leaves/enters window
    document.addEventListener('mouseleave', () => {
        customCursor.style.opacity = '0';
        customCursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        customCursor.style.opacity = '1';
        customCursorRing.style.opacity = '1';
    });

    // Easing custom cursor tracking loop
    function updateCursorPosition() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.25;
        cursorY += dy * 0.25;
        customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        const rdx = mouseX - ringX;
        const rdy = mouseY - ringY;
        ringX += rdx * 0.12;
        ringY += rdy * 0.12;
        customCursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

        requestAnimationFrame(updateCursorPosition);
    }
    requestAnimationFrame(updateCursorPosition);

    // 3. Cute 8-Bit Web Audio Synthesizer
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playPlopSound() {
        if (isMuted) return;
        try {
            initAudio();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(160, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.08); // rapid upward sweep
            
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.09);
        } catch (e) {
            console.warn('Web Audio synthesis not allowed or supported:', e);
        }
    }

    function playMunchSound() {
        if (isMuted) return;
        try {
            initAudio();
            const time = audioCtx.currentTime;
            
            // Note 1: C5 (523.25Hz)
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(523.25, time);
            
            gain1.gain.setValueAtTime(0.12, time);
            gain1.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
            
            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.start(time);
            osc1.stop(time + 0.09);
            
            // Note 2: E5 (659.25Hz) after slight delay
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(659.25, time + 0.06);
            
            gain2.gain.setValueAtTime(0.12, time + 0.06);
            gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
            
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start(time + 0.06);
            osc2.stop(time + 0.19);
        } catch (e) {
            console.warn('Web Audio synthesis not allowed or supported:', e);
        }
    }

    // 4. Pet State Machine and Physics Loop
    function setEyesState(sleeping) {
        const open = document.getElementById('petEyesOpen');
        const closed = document.getElementById('petEyesClosed');
        if (open && closed) {
            open.style.display = sleeping ? 'none' : 'block';
            closed.style.display = sleeping ? 'block' : 'none';
        }
    }

    function wakeUpPet() {
        if (petState === 'SLEEPING') {
            petState = 'IDLE';
            setEyesState(false);
            petSprite.className = 'pet-sprite idle';
            
            if (zzzSpawnInterval) {
                clearInterval(zzzSpawnInterval);
                zzzSpawnInterval = null;
            }
        }
        lastMouseTime = Date.now();
    }

    function spawnZzz() {
        if (!isSummoned || petState !== 'SLEEPING') return;
        
        const zzz = document.createElement('div');
        zzz.className = 'sleep-zzz';
        zzz.innerText = 'z';
        // Randomize letter a bit
        if (Math.random() > 0.6) zzz.innerText = 'Z';
        
        zzz.style.left = `${petX + 35}px`;
        zzz.style.top = `${petY - 10}px`;
        
        document.body.appendChild(zzz);
        setTimeout(() => zzz.remove(), 2200);
    }

    function spawnEatingHearts(x, y) {
        const count = 4;
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'eat-heart';
            heart.innerText = Math.random() > 0.5 ? '❤️' : '✨';
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.setProperty('--x-shift', `${(Math.random() * 40 - 20)}px`);
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1400);
        }
    }

    function updatePetPhysics() {
        if (!isSummoned) return;

        // Set Target Position
        let targetX = cursorX;
        let targetY = cursorY + 12; // offset slightly below the cursor

        if (currentTreat) {
            targetX = currentTreat.x;
            targetY = currentTreat.y;
            
            if (petState !== 'EATING') {
                petState = 'RETRIEVING';
            }
        }

        // Distance calculations
        const dx = targetX - petX;
        const dy = targetY - petY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // State Transitions & Easing speeds
        if (petState === 'EATING') {
            // Wait for eating timer
        } else if (petState === 'RETRIEVING') {
            // Move fast to retrieve dropped treat
            petSprite.className = 'pet-sprite running';
            const speed = 4.5;
            if (dist > 5) {
                petX += (dx / dist) * speed;
                petY += (dy / dist) * speed;
            } else {
                // Reach the treat! Eat it
                eatTreat();
            }
        } else {
            // Chasing the cursor
            if (dist < 22) {
                // Idle / Sleeping check
                if (Date.now() - lastMouseTime > 7000) {
                    if (petState !== 'SLEEPING') {
                        petState = 'SLEEPING';
                        setEyesState(true);
                        petSprite.className = 'pet-sprite sleeping';
                        
                        if (!zzzSpawnInterval) {
                            zzzSpawnInterval = setInterval(spawnZzz, 1400);
                        }
                    }
                } else {
                    petState = 'IDLE';
                    petSprite.className = 'pet-sprite idle';
                }
            } else {
                // Walking vs Running
                petState = dist > 220 ? 'RUNNING' : 'WALKING';
                petSprite.className = petState === 'RUNNING' ? 'pet-sprite running' : 'pet-sprite walking';
                
                const speed = petState === 'RUNNING' ? 3.8 : 1.9;
                petX += (dx / dist) * speed;
                petY += (dy / dist) * speed;
            }
        }

        // Direction facing (flip sprite horizontally)
        if (petState !== 'SLEEPING' && petState !== 'EATING') {
            if (dx > 2) {
                petSprite.style.transform = 'scaleX(1)'; // face right
            } else if (dx < -2) {
                petSprite.style.transform = 'scaleX(-1)'; // face left
            }
        }

        // Translate the pet container element
        // Offset pet coordinates to center bottom
        petContainer.style.transform = `translate3d(${petX - 25}px, ${petY - 35}px, 0)`;
        
        requestAnimationFrame(updatePetPhysics);
    }

    // 5. Treat Dropping Mechanic
    function dropTreat(x, y) {
        if (!isSummoned) return;

        // Clear existing treat
        clearTreat();

        // Create new treat element
        const treat = document.createElement('div');
        treat.className = 'pet-treat';
        treat.innerText = '🐟';
        treat.style.left = `${x}px`;
        treat.style.top = `${y}px`;
        
        document.body.appendChild(treat);
        
        currentTreat = {
            element: treat,
            x: x,
            y: y
        };

        playPlopSound();
        wakeUpPet();
        petState = 'RETRIEVING';
    }

    function clearTreat() {
        if (currentTreat) {
            currentTreat.element.remove();
            currentTreat = null;
        }
    }

    function eatTreat() {
        if (petState === 'EATING' || !currentTreat) return;
        
        petState = 'EATING';
        petSprite.className = 'pet-sprite eating';
        
        const eatX = currentTreat.x;
        const eatY = currentTreat.y;
        
        // Face the food while eating
        const tDx = eatX - petX;
        if (tDx > 0) {
            petSprite.style.transform = 'scaleX(1)';
        } else {
            petSprite.style.transform = 'scaleX(-1)';
        }

        // Shrink the treat
        currentTreat.element.classList.add('disappear');

        setTimeout(() => {
            if (petState === 'EATING') {
                playMunchSound();
                spawnEatingHearts(eatX, eatY - 10);
                clearTreat();
                
                // Return to chasing cursor
                petState = 'IDLE';
                petSprite.className = 'pet-sprite idle';
            }
        }, 800);
    }

    // 6. UI Handlers and summoning
    function summonPet() {
        isSummoned = true;
        petContainer.style.opacity = '1';
        petToggleBtn.classList.add('active');
        petToggleBtn.innerText = '🐱 Summoned';
        
        // Show hint toast
        petHintToast.classList.add('active');
        setTimeout(() => {
            petHintToast.classList.remove('active');
        }, 4000);
        
        // Reset pet coordinates near center
        petX = window.innerWidth / 2;
        petY = window.innerHeight / 2 + 100;
        wakeUpPet();
    }

    function dismissPet() {
        isSummoned = false;
        petContainer.style.opacity = '0';
        petToggleBtn.classList.remove('active');
        petToggleBtn.innerText = '🐱 Summon';
        
        clearTreat();
        petHintToast.classList.remove('active');
        
        if (zzzSpawnInterval) {
            clearInterval(zzzSpawnInterval);
            zzzSpawnInterval = null;
        }
        petState = 'IDLE';
    }

    // Setup initial physics loop
    requestAnimationFrame(updatePetPhysics);

    // Summon controls listeners
    petToggleBtn.addEventListener('click', (e) => {
        if (isSummoned) {
            dismissPet();
        } else {
            summonPet();
        }
        e.stopPropagation();
    });

    petMuteBtn.addEventListener('click', (e) => {
        isMuted = !isMuted;
        petMuteBtn.innerText = isMuted ? '🔇' : '🔊';
        e.stopPropagation();
    });

    // Global click listener to drop food
    document.addEventListener('mousedown', (e) => {
        if (!isSummoned) return;
        
        // Ignore clicks on mute or toggle controls
        if (e.target.closest('#petToggleBtn') || e.target.closest('#petMuteBtn')) {
            return;
        }
        
        dropTreat(e.clientX, e.clientY);
    });

    // Show initial instruction toast
    setTimeout(() => {
        if (isSummoned) {
            petHintToast.classList.add('active');
            setTimeout(() => {
                petHintToast.classList.remove('active');
            }, 4500);
        }
    }, 2500);

});

