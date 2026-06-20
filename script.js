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
    //  GAME-LIKE CUSTOM CURSOR & TARGET GAME ENGINE
    // ===============================================

    // 1. Inject UI Elements into the DOM
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

    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'game-toggle-container';
    
    const gameMuteBtn = document.createElement('button');
    gameMuteBtn.className = 'game-mute-btn';
    gameMuteBtn.id = 'gameMuteBtn';
    gameMuteBtn.innerText = '🔊';
    gameMuteBtn.title = 'Mute/Unmute Sounds';
    gameMuteBtn.style.display = 'none';
    
    const gameToggleBtn = document.createElement('button');
    gameToggleBtn.className = 'game-toggle-btn';
    gameToggleBtn.id = 'gameToggleBtn';
    gameToggleBtn.innerText = '🎮 Cursor Game';
    
    toggleContainer.appendChild(gameMuteBtn);
    toggleContainer.appendChild(gameToggleBtn);
    document.body.appendChild(toggleContainer);
    
    const gameScoreboard = document.createElement('div');
    gameScoreboard.className = 'game-scoreboard';
    gameScoreboard.id = 'gameScoreboard';
    gameScoreboard.innerHTML = `
        <div class="game-score-title">SPACE TARGET PRACTICE</div>
        <div class="game-score-val" id="gameScoreVal">00 <span>pts</span></div>
    `;
    document.body.appendChild(gameScoreboard);
    
    const gameHintToast = document.createElement('div');
    gameHintToast.className = 'game-hint-toast';
    gameHintToast.id = 'gameHintToast';
    gameHintToast.innerText = 'Click anywhere to shoot lasers! ☄️';
    document.body.appendChild(gameHintToast);

    // 2. Cursor State & Tracking Logic
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    
    let isGameMode = false;
    let isMuted = false;
    let score = 0;
    let aliens = [];
    const alienEmojis = ['👾', '🛸', '🛸', '👾'];
    let audioCtx = null;
    let gameLoopRaf = null;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Custom cursor hover interaction using event delegation
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

    // Track mouse entering/leaving viewport to hide custom cursor elements
    document.addEventListener('mouseleave', () => {
        customCursor.style.opacity = '0';
        customCursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        customCursor.style.opacity = '1';
        customCursorRing.style.opacity = '1';
    });

    // Cursor easing loop
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

    // 3. Programmatic Web Audio Synthesizer
    function playLaserSound() {
        if (isMuted) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime); // start high
            osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.15); // ramp down rapidly
            
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.16);
        } catch (err) {
            console.warn('Web Audio synthesis not allowed or supported:', err);
        }
    }

    function playExplosionSound() {
        if (isMuted) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            // Synthesize white noise buffer
            const bufferSize = audioCtx.sampleRate * 0.25;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noiseNode = audioCtx.createBufferSource();
            noiseNode.buffer = buffer;

            const filterNode = audioCtx.createBiquadFilter();
            filterNode.type = 'bandpass';
            filterNode.frequency.setValueAtTime(1000, audioCtx.currentTime);
            filterNode.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.25);

            const gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

            noiseNode.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            noiseNode.start();
            noiseNode.stop(audioCtx.currentTime + 0.26);
        } catch (err) {
            console.warn('Web Audio synthesis not allowed or supported:', err);
        }
    }

    // 4. Target Alien Entity Class
    class Alien {
        constructor() {
            this.element = document.createElement('div');
            this.element.className = 'game-target';
            this.element.innerText = alienEmojis[Math.floor(Math.random() * alienEmojis.length)];
            
            this.size = 48; // estimated bounding box size
            
            // Random start position within screen bounds
            this.x = Math.random() * (window.innerWidth - 120) + 60;
            this.y = Math.random() * (window.innerHeight - 250) + 100;
            
            // Random velocity direction
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1.8;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
            document.body.appendChild(this.element);
            
            // Handle clicking the alien
            this.element.addEventListener('mousedown', (e) => {
                if (isGameMode) {
                    this.hit();
                    e.stopPropagation(); // prevent screen laser shot
                }
            });
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Collision detection with viewport boundaries (elastic bouncing)
            if (this.x <= 10 || this.x >= window.innerWidth - this.size - 10) {
                this.vx = -this.vx;
                this.x = Math.max(10, Math.min(this.x, window.innerWidth - this.size - 10));
            }
            if (this.y <= 10 || this.y >= window.innerHeight - this.size - 10) {
                this.vy = -this.vy;
                this.y = Math.max(10, Math.min(this.y, window.innerHeight - this.size - 10));
            }
            
            this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
        }
        
        hit() {
            if (this.element.classList.contains('hit')) return;
            
            this.element.classList.add('hit');
            score += 10;
            updateScoreboard();
            playExplosionSound();
            createExplosionParticles(this.x + this.size / 2, this.y + this.size / 2);
            triggerScreenShake();
            
            // Respawn after 3 seconds if game mode is still active
            setTimeout(() => {
                if (isGameMode) {
                    this.reset();
                } else {
                    this.destroy();
                }
            }, 3000);
        }
        
        reset() {
            this.element.classList.remove('hit');
            this.element.innerText = alienEmojis[Math.floor(Math.random() * alienEmojis.length)];
            this.x = Math.random() * (window.innerWidth - 120) + 60;
            this.y = Math.random() * (window.innerHeight - 250) + 100;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1.8;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
        }
        
        destroy() {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    // 5. Game Mechanics: Laser Beam and Explosion Particles
    function createLaserBeam(x, y) {
        const beam = document.createElement('div');
        beam.className = 'laser-beam';
        
        // Shoot from bottom center of screen
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight;
        
        const dx = x - startX;
        const dy = y - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dx, -dy) * (180 / Math.PI);
        
        beam.style.height = `${distance}px`;
        beam.style.left = `${startX}px`;
        beam.style.top = `${startY - distance}px`;
        beam.style.transform = `rotate(${angle}deg)`;
        beam.style.transformOrigin = 'bottom center';
        
        document.body.appendChild(beam);
        setTimeout(() => beam.remove(), 180);
    }

    function createLaserSparks(x, y) {
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'game-particle';
            p.style.backgroundColor = '#ff3333';
            p.style.width = '4px';
            p.style.height = '4px';
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            
            document.body.appendChild(p);
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            let vx = Math.cos(angle) * speed;
            let vy = Math.sin(angle) * speed;
            
            let curX = x;
            let curY = y;
            let opacity = 1;
            
            function animSpark() {
                curX += vx;
                curY += vy;
                opacity -= 0.05;
                
                p.style.transform = `translate3d(${curX - x}px, ${curY - y}px, 0)`;
                p.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animSpark);
                } else {
                    p.remove();
                }
            }
            requestAnimationFrame(animSpark);
        }
    }

    function createExplosionParticles(x, y) {
        const colors = ['#ff3333', '#ff007f', '#00f2fe', '#e056fd', '#ffff33'];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'game-particle';
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            
            document.body.appendChild(p);
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 3;
            let vx = Math.cos(angle) * speed;
            let vy = Math.sin(angle) * speed;
            
            let curX = x;
            let curY = y;
            let opacity = 1;
            
            function animParticle() {
                vy += 0.15; // apply gravity force
                curX += vx;
                curY += vy;
                opacity -= 0.03;
                
                p.style.transform = `translate3d(${curX - x}px, ${curY - y}px, 0)`;
                p.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animParticle);
                } else {
                    p.remove();
                }
            }
            requestAnimationFrame(animParticle);
        }
    }

    function triggerScreenShake() {
        document.body.classList.remove('screen-shake');
        void document.body.offsetWidth; // force redraw/reflow
        document.body.classList.add('screen-shake');
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, 150);
    }

    function updateScoreboard() {
        const valEl = document.getElementById('gameScoreVal');
        if (valEl) {
            valEl.innerHTML = `${score < 10 ? '0' + score : score} <span>pts</span>`;
        }
    }

    // 6. Game State Controls
    function spawnAliens() {
        cleanupAliens();
        for (let i = 0; i < 4; i++) {
            aliens.push(new Alien());
        }
    }

    function cleanupAliens() {
        aliens.forEach(alien => alien.destroy());
        aliens = [];
    }

    function startGameLoop() {
        function loop() {
            if (!isGameMode) return;
            aliens.forEach(alien => alien.update());
            gameLoopRaf = requestAnimationFrame(loop);
        }
        cancelAnimationFrame(gameLoopRaf);
        gameLoopRaf = requestAnimationFrame(loop);
    }

    function toggleGameMode() {
        isGameMode = !isGameMode;
        
        if (isGameMode) {
            // Enable Game Cursor & UI
            customCursor.classList.add('game-active');
            customCursorRing.classList.add('game-active');
            gameToggleBtn.classList.add('active');
            gameToggleBtn.innerText = '🛸 Exit Game';
            gameScoreboard.classList.add('active');
            gameMuteBtn.style.display = 'flex';
            
            // Reset scoreboard & game entities
            score = 0;
            updateScoreboard();
            spawnAliens();
            
            // Show toast instructions
            gameHintToast.classList.add('active');
            setTimeout(() => {
                gameHintToast.classList.remove('active');
            }, 4000);
            
            startGameLoop();
        } else {
            // Disable Game Cursor & UI
            customCursor.classList.remove('game-active');
            customCursorRing.classList.remove('game-active');
            gameToggleBtn.classList.remove('active');
            gameToggleBtn.innerText = '🎮 Cursor Game';
            gameScoreboard.classList.remove('active');
            gameMuteBtn.style.display = 'none';
            gameHintToast.classList.remove('active');
            
            cleanupAliens();
            cancelAnimationFrame(gameLoopRaf);
        }
    }

    // 7. Event Listeners for Game Controls
    gameToggleBtn.addEventListener('click', (e) => {
        toggleGameMode();
        e.stopPropagation();
    });

    gameMuteBtn.addEventListener('click', (e) => {
        isMuted = !isMuted;
        gameMuteBtn.innerText = isMuted ? '🔇' : '🔊';
        e.stopPropagation();
    });

    // Global click listener to fire lasers in Game Mode
    document.addEventListener('mousedown', (e) => {
        if (!isGameMode) return;
        
        // Ignore clicks on mute or toggle controls
        if (e.target.closest('#gameToggleBtn') || e.target.closest('#gameMuteBtn')) {
            return;
        }
        
        // Trigger gun recoil animation on the crosshair
        customCursorRing.classList.remove('shooting');
        void customCursorRing.offsetWidth;
        customCursorRing.classList.add('shooting');
        
        playLaserSound();
        createLaserBeam(e.clientX, e.clientY);
        createLaserSparks(e.clientX, e.clientY);
    });

});
