document.addEventListener('DOMContentLoaded', () => {
    // ── INTERACTIVE CURTAIN-SPLIT INTRO ENGINE ──
    const introOverlay = document.getElementById('intro-overlay');
    const introCanvas = document.getElementById('intro-canvas');
    let introCtx = null;
    let introParticles = [];
    let introAnimationId = null;
    let introMouse = { x: null, y: null };
    let introMouseActive = false;

    // Canvas Resizing Setup
    function resizeIntroCanvas() {
        if (introCanvas) {
            introCanvas.width = window.innerWidth;
            introCanvas.height = window.innerHeight;
        }
    }
    window.addEventListener('resize', resizeIntroCanvas);
    resizeIntroCanvas();

    // Mouse Tracking for 3D Camera Parallax
    let parallaxX = 0;
    let parallaxY = 0;
    if (introOverlay) {
        introOverlay.addEventListener('mousemove', (e) => {
            const dx = e.clientX - window.innerWidth / 2;
            const dy = e.clientY - window.innerHeight / 2;
            introMouse.x = dx * 0.15; // Target parallax shift
            introMouse.y = dy * 0.15;
            introMouseActive = true;
        });
        introOverlay.addEventListener('mouseleave', () => {
            introMouseActive = false;
        });
    }

    // 3D Space Warp Star Class
    const maxDepth = 1000;
    class WarpStar {
        constructor() {
            this.reset();
            // Disperse initial depths
            this.z = Math.random() * maxDepth;
        }

        reset() {
            this.x = (Math.random() - 0.5) * window.innerWidth * 2.5;
            this.y = (Math.random() - 0.5) * window.innerHeight * 2.5;
            this.z = maxDepth;
            
            // White-Blue-Purple color palette
            const colorRand = Math.random();
            if (colorRand < 0.45) {
                this.color = '59, 130, 246'; // Accent blue
            } else if (colorRand < 0.75) {
                this.color = '139, 92, 246'; // Violet
            } else {
                this.color = '255, 255, 255'; // White
            }
        }

        update(speed) {
            this.z -= speed;
            if (this.z <= 0) {
                this.reset();
            }
        }

        draw(c, pX, pY) {
            const centerX = window.innerWidth / 2 - pX;
            const centerY = window.innerHeight / 2 - pY;
            
            const fov = 150;
            const k = fov / this.z;
            const px = this.x * k + centerX;
            const py = this.y * k + centerY;

            // Bounds reset check
            if (px < 0 || px > window.innerWidth || py < 0 || py > window.innerHeight) {
                this.reset();
                return;
            }

            // Draw line to represent warp speed stretching
            const prevZ = this.z + 20; // Warp tail length factor
            const prevK = fov / prevZ;
            const pX2 = this.x * prevK + centerX;
            const pY2 = this.y * prevK + centerY;

            // Fade in as stars emerge from depth
            const alpha = Math.min(1.0, (1.0 - this.z / maxDepth) * 1.5);

            c.beginPath();
            c.moveTo(px, py);
            c.lineTo(pX2, pY2);
            c.strokeStyle = `rgba(${this.color}, ${alpha})`;
            c.lineWidth = Math.max(1, (1.0 - this.z / maxDepth) * 2.5);
            c.stroke();
        }
    }

    // Spawn Warp Stars
    if (introCanvas) {
        introCtx = introCanvas.getContext('2d');
        const pCount = 140; // Dense, immersive field
        for (let i = 0; i < pCount; i++) {
            introParticles.push(new WarpStar());
        }
    }

    // Animation Loop
    function animateIntro() {
        if (!introCanvas || !introCtx) return;
        introCtx.clearRect(0, 0, introCanvas.width, introCanvas.height);
        
        // Eased mouse parallax lerp
        if (introMouseActive) {
            parallaxX += (introMouse.x - parallaxX) * 0.08;
            parallaxY += (introMouse.y - parallaxY) * 0.08;
        } else {
            parallaxX += (0 - parallaxX) * 0.08;
            parallaxY += (0 - parallaxY) * 0.08;
        }

        introParticles.forEach(star => {
            star.update(10); // Star velocity
            star.draw(introCtx, parallaxX, parallaxY);
        });

        introAnimationId = requestAnimationFrame(animateIntro);
    }

    if (introCanvas) {
        animateIntro();
    }

    // Timeline Progress & Skip Button Sync
    const progressFill = document.querySelector('.intro-progress-fill');
    const skipCircleFill = document.querySelector('.skip-circle-fill');
    const skipIntroBtn = document.getElementById('skip-intro');
    
    let introFinished = false;
    const duration = 1200; // 1.2s loading timeline
    const startTime = performance.now();

    function updateTimeline(now) {
        if (introFinished) return;

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Update linear progress bar width
        if (progressFill) {
            progressFill.style.width = `${progress * 100}%`;
        }

        // Update circular SVG loading dashoffset (dasharray length ~100.53)
        if (skipCircleFill) {
            const dashOffset = 100.53 * (1 - progress);
            skipCircleFill.style.strokeDashoffset = dashOffset;
        }

        if (progress < 1) {
            requestAnimationFrame(updateTimeline);
        } else {
            finishIntro();
        }
    }

    requestAnimationFrame(updateTimeline);

    // Finish Intro -> Slide curtain open and clean up memory
    function finishIntro() {
        if (introFinished) return;
        introFinished = true;

        if (introAnimationId) {
            cancelAnimationFrame(introAnimationId);
        }
        window.removeEventListener('resize', resizeIntroCanvas);

        if (introOverlay) {
            introOverlay.classList.add('hidden');
            // Remove overlay from DOM once panel sliding animations finish (800ms)
            setTimeout(() => {
                introOverlay.remove();
            }, 800);
        }
    }

    if (skipIntroBtn) {
        skipIntroBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            finishIntro();
        });
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
    if (window.AOS) AOS.init({
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
        "w_ADDM.jpg",
        "w_ADDM2.jpg",
        "w_SKILLS5.jpg",
        "w_SKILLS_POSTER.jpg",
        "w_9.jpg",
        "w_10.jpg",
        "w_all_course.jpg",
        "w_DM_ABOSOLUTE_.jpg",
        "w_cyber_security_copy.jpg",
        "w_GD_AND_VE.jpg",
        "w_scene6.jpg",
        "w_DM1_car.jpg",
        "w_SKILLS__GTA.jpg",
        "w_old_01.jpg",
        "w_old_02.jpg",
        "w_old_03.jpg",
        "w_old_04.jpg",
        "w_old_05.jpg",
        "w_old_06.jpg",
        "w_old_07.jpg",
        "w_old_08.jpg",
        "w_old_09.jpg",
        "w_old_10.jpg",
        "w_old_11.jpg",
        "w_old_12.jpg",
        "w_old_13.jpg",
        "w_old_14.jpg",
        "w_old_15.jpg",
        "w_old_16.jpg",
        "w_old_17.jpg",
        "w_old_18.jpg",
        "w_old_19.jpg",
        "w_old_20.jpg",
        "w_old_21.jpeg",
        "w_old_22.jpeg"
    ];

    const rowA = document.getElementById('rowA');
    const rowB = document.getElementById('rowB');
    const workDetails = [
        { title: "Bench Talk", category: 'Graphic Design', description: "Bold yellow admission poster. A relaxed man on a wooden bench points straight at the viewer with a cup of tea, under a huge Malayalam headline about guaranteed work. Dark navy type on yellow keeps it loud and clear, with an AI-integrated digital marketing tag." },
        { title: "Career Safe", category: 'Graphic Design', description: "Dark, moody poster with a person working on a laptop that shows a Meta Ads Manager dashboard. A white headline with a neon-green outline and a green highlight on the call to action give it a modern tech feel." },
        { title: "Change Your Fate", category: 'Graphic Design', description: "Maroon poster with an angry 3D cartoon character holding a laptop, with lightning bolts around him. A punchy yellow Malayalam headline leads into the four courses on offer." },
        { title: "Billboard in the Paddy Field", category: 'Graphic Design', description: "Cinematic Kerala paddy-field scene at dusk. A friendly cartoon boy on a green billboard introduces digital marketing and full-stack development. The warm orange shirt stands out against the green board." },
        { title: "Don't Drown Without a Job", category: 'Graphic Design', description: "Split-scene poster: a man in a boat above the water, and a young man climbing a rock wall deep below. Rich ocean blues, large white Digital Marketing type and a neat course info strip." },
        { title: "One Course Is Enough", category: 'Graphic Design', description: "Warm cream poster with an illustrated man in a striped traditional outfit, holding a small guitar. Rich brown Malayalam headline and a clear bulleted list of the courses." },
        { title: "Don't Fall Behind", category: 'Graphic Design', description: "Atmospheric dark-blue poster. A student with a backpack faces a crowd walking into the light. Bold Malayalam headline with a yellow highlight and a boxed Our Courses list." },
        { title: "Digital Marketing in Black & White", category: 'Graphic Design', description: "Monochrome illustrated character with raised hands in front of social media app icons, outlined in bright yellow. Giant yellow DIGITAL MARKETING title and a 3-month course, training and internship box." },
        { title: "Think Like a Hacker", category: 'Graphic Design', description: "Dark blue cyber security poster with a cat in a hoodie and sunglasses typing on a laptop. Glitch-style yellow HACKING headline and clear diploma details." },
        { title: "A Skill That Never Leaves You", category: 'Graphic Design', description: "Bright blue sky and terrace scene with Photoshop and After Effects icons as cute characters hugging. Yellow Malayalam headline and a graphic design and video editing course box." },
        { title: "Scene Maarum", category: 'Graphic Design', description: "Cinematic hall with a young man holding a diploma. Huge distressed 3D yellow title behind him and a Join Now box listing four courses." },
        { title: "Fly Higher", category: 'Graphic Design', description: "Black background with a futuristic flying car on blue jets. Large yellow and white Malayalam and English headline, and a boxed list of all the courses." },
        { title: "Learn Skills, Build Your Future", category: 'Graphic Design', description: "GTA-style poster. Friends with laptops lean on a red classic car in neon rain. Chunky game-style lettering and a boxed course list." },
        { title: "Career Climb", category: 'Graphic Design', description: "Social media poster for a digital marketing diploma. A climber on a sunset cliff is pulled up by a helping hand, a visual metaphor for lifting your career. Warm orange sky, bold Malayalam headline and a clear Join Now button." },
        { title: "Run Toward the Job", category: 'Graphic Design', description: "Admission poster built on motion. A man bursts out of a door holding his diploma, with glowing blue speed trails behind him and a family member watching. Electric blue light gives it a fast, energetic feel." },
        { title: "Career in 6 Months", category: 'Graphic Design', description: "Playful poster with a college mascot relaxing on a sofa with a laptop, framed by a glowing neon ring. A rich purple palette and a bright pink footer make the 6-month course stand out." },
        { title: "The Meta Mentor", category: 'Graphic Design', description: "Storytelling creative where a Meta-style character studies a man's hand with a magnifying glass. Warm candlelight and golden tones give it a calm, cinematic mood." },
        { title: "Learn. Practice. Grow.", category: 'Graphic Design', description: "Warm cream poster with a confident portrait and a big highlighted 6-month diploma badge. A clean layout with strong Malayalam typography keeps the message easy to read." },
        { title: "Your Career Goes Digital", category: 'Graphic Design', description: "Deep blue admission poster with a sharp, suited portrait. Google, Instagram and Facebook icons float around him to show the digital marketing focus." },
        { title: "Open the Door to Your Future", category: 'Graphic Design', description: "A silhouette stands at a glowing doorway overlooking a city at dusk. Golden rim lighting and a dark interior create the feeling of a new opportunity opening." },
        { title: "Digital Marketing Avatar", category: 'Graphic Design', description: "A friendly 3D cartoon avatar in sunglasses on a navy gradient. A bold light-blue title and an orange call-to-action button give it a modern, youth-friendly look." },
        { title: "Marketing in the AI Era", category: 'Graphic Design', description: "A robot working on a laptop with Adobe-style app icons floating around it, on a deep space-blue background. Cyan Malayalam and English typography ties the course to technology." },
        { title: "Skills Give You the Power", category: 'Graphic Design', description: "Dark, dramatic night scene where a lightning bolt strikes toward a lone figure in an open field. Glowing type carries the message with very little clutter." },
        { title: "Lead the Digital Future", category: 'Graphic Design', description: "Robotic hands assemble a glowing puzzle piece in electric blue. A lime-green headline accent adds contrast and highlights the 6-month digital marketing course." },
        { title: "Skills for a Better Career", category: 'Graphic Design', description: "Minimal, conceptual poster on a clean white background. A person sits leaning against a geometric sphere, with Malayalam type and a simple Enroll Now button." },
        { title: "Logistics Job Guarantee", category: 'Graphic Design', description: "Bold red and white poster with an excited young man in a safety vest, hands on his cheeks. Clear course details, social icons and a prominent contact number for quick enquiries." },
        { title: "Into the Light", category: 'Graphic Design', description: "Typographic concept artwork. A silhouette walks through a red tunnel of letters toward a bright light. No promotional text, purely a visual and mood piece." },
        { title: "Questions Ahead", category: 'Graphic Design', description: "A 3D cartoon character sips coffee while reporters' microphones crowd in. A funny, relatable scenario on a bright orange background that leads into the digital marketing course." },
        { title: "Neon Meta Loop", category: 'Graphic Design', description: "A glossy lime-green 3D Meta symbol on a dark green floor, with a tiny worker sitting beside it. A bold yellow headline and a neon palette give it a strong tech feel." },
        { title: "Steps to Success", category: 'Graphic Design', description: "A young man with a backpack climbs steps toward a glowing doorway with a graduation cap floating above. Warm amber light and a clear Join Now box keep the story simple." },
        { title: "Montessori Teacher Training", category: 'Graphic Design', description: "Bright blue education poster with a smiling woman in a saree pointing to the course highlights. Paper-plane icons and neat info boxes make the key points scannable." },
        { title: "Container to Future", category: 'Graphic Design', description: "Moody warehouse scene with a silhouette standing in front of a LOGISTICS container. Bold white headline, dark tones and clear enrolment details for the 6-month course." },
        { title: "A Smarter Mindset", category: 'Graphic Design', description: "Warm-toned office hall with a man opening his arms in front of people at computers. Strong Malayalam headline text sells the digital marketing course." },
        { title: "Logistics Management Diploma", category: 'Graphic Design', description: "Variation of the logistics job poster with a certificate and 100% placement support callouts, plus a footer bar with the institute location and a contact number." },
        { title: "Container to Future (Variant)", category: 'Graphic Design', description: "Alternate version of the container poster. It adds an Enroll Now line with the phone number and location, keeping the same dark, cinematic look." }
    ];

    if (rowA && rowB) {
        const half = Math.ceil(gravityPhotos.length / 2);
        function fillRow(row, offset, count) {
            for (let k = 0; k < 2; k++) {
                for (let n = 0; n < count; n++) {
                    const idx = offset + n;
                    const card = document.createElement('div');
                    card.className = 'row-card';
                    card.tabIndex = 0;
                    const img = document.createElement('img');
                    img.src = gravityPhotos[idx];
                    img.alt = workDetails[idx].title;
                    img.draggable = false;
                    card.appendChild(img);
                    card.addEventListener('click', () => openWork(idx));
                    card.addEventListener('keydown', e => { if (e.key === 'Enter') openWork(idx); });
                    row.appendChild(card);
                }
            }
        }
        fillRow(rowA, 0, half);
        fillRow(rowB, half, gravityPhotos.length - half);

        const wd = document.getElementById('workDetail');
        const wdImg = wd.querySelector('.wd-img');
        const wdBody = wd.querySelector('.wd-info');
        let cur = 0;
        function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
        function showWork(i) {
            const total = gravityPhotos.length;
            cur = (i + total) % total;
            const d = workDetails[cur];
            wdImg.src = gravityPhotos[cur];
            const rows = [['Category', d.category]]
                .filter(r => r[1]).map(r => '<div class="wd-row"><span>' + r[0] + '</span><strong>' + esc(r[1]) + '</strong></div>').join('');
            wdBody.innerHTML = '<div class="wd-count">' + String(cur + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0') + '</div>'
                + '<h3 class="wd-title">' + esc(d.title) + '</h3>'
                + (d.description ? '<p class="wd-desc">' + esc(d.description) + '</p>' : '')
                + '<div class="wd-rows">' + rows + '</div>';
        }
        function openWork(i) { showWork(i); wd.classList.add('open'); document.body.style.overflow = 'hidden'; }
        function closeWork() { wd.classList.remove('open'); document.body.style.overflow = ''; }
        wd.querySelector('.wd-close').addEventListener('click', closeWork);
        wd.querySelector('.wd-prev').addEventListener('click', () => showWork(cur - 1));
        wd.querySelector('.wd-next').addEventListener('click', () => showWork(cur + 1));
        wd.addEventListener('click', e => { if (e.target === wd || e.target.classList.contains('wd-stage')) closeWork(); });
        document.addEventListener('keydown', e => {
            if (!wd.classList.contains('open')) return;
            if (e.key === 'Escape') closeWork();
            if (e.key === 'ArrowLeft') showWork(cur - 1);
            if (e.key === 'ArrowRight') showWork(cur + 1);
        });
    }


    // ===============================================
    //  ULTRA-PREMIUM GLOWING CUSTOM CURSOR SYSTEM
    // ===============================================

    // 1. Dynamic DOM Injection: Custom Cursor Dot and Canvas Trail
    const cursorCanvas = document.createElement('canvas');
    cursorCanvas.id = 'cursor-canvas';
    document.body.appendChild(cursorCanvas);
    const ctx = cursorCanvas.getContext('2d');

    const customCursorDot = document.createElement('div');
    customCursorDot.className = 'custom-cursor-dot';
    customCursorDot.id = 'customCursorDot';
    
    document.body.appendChild(customCursorDot);
    
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
    
    let lastSpawnX = window.innerWidth / 2;
    let lastSpawnY = window.innerHeight / 2;
    
    let activeMagneticElement = null;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 5. Global Event Delegation for Interactive Hover States
    document.addEventListener('mouseover', (e) => {
        // Expand dot when hovering interactive links, buttons, and skill tags
        const hoverTarget = e.target.closest('.skill-tag, .service-item, button, a, .contact-details a');
        if (hoverTarget) {
            customCursorDot.classList.add('is-hovering');
        } else {
            customCursorDot.classList.remove('is-hovering');
        }
    });

    // Track mouse entering/leaving viewport to hide custom cursor elements
    document.addEventListener('mouseleave', () => {
        customCursorDot.style.opacity = '0';
        cursorCanvas.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        customCursorDot.style.opacity = '1';
        cursorCanvas.style.opacity = '1';
    });

    // 6. Cursor Easing & Canvas Particle Animation Loop
    function updateCursorPosition() {
        // 6a. Draw Canvas Particles (Stardust Trail)
        ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        
        // Spawn stardust particles with interpolation for high-speed paths
        const dist = Math.hypot(mouseX - lastSpawnX, mouseY - lastSpawnY);
        if (dist > 3) {
            const steps = Math.min(Math.floor(dist / 3), 6);
            for (let i = 0; i < steps; i++) {
                const ratio = i / steps;
                const px = lastSpawnX + (mouseX - lastSpawnX) * ratio;
                const py = lastSpawnY + (mouseY - lastSpawnY) * ratio;
                
                // Adaptive colors based on hover
                let pColor = 'rgba(59, 130, 246, 0.7)'; // Accent blue
                if (customCursorDot.classList.contains('is-hovering')) {
                    pColor = 'rgba(96, 165, 250, 0.8)'; // Lighter blue when hovering links
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

        // 6b. Dot Position Update (High stiffness tracking)
        const dDotX = mouseX - dotX;
        const dDotY = mouseY - dotY;
        dotX += dDotX * 0.35;
        dotY += dDotY * 0.35;
        customCursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

        requestAnimationFrame(updateCursorPosition);
    }
    requestAnimationFrame(updateCursorPosition);

    // 7. Magnetic Shift Effect Observer (Interactive button shift only)
    function initMagneticEffects() {
        const magneticElements = document.querySelectorAll('.nav a, .hero-socials-inline a, .email-link');
        
        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                activeMagneticElement = el;
                customCursorDot.classList.add('is-hovering');
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
                customCursorDot.classList.remove('is-hovering');
                el.style.transform = '';
            });
        });
    }
    initMagneticEffects();

    // 8. High-Fidelity Click Ripple Effect
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

(function () {
    const el = document.getElementById('hero3d');
    if (!el || !window.THREE) { if (el) el.style.display = 'none'; return; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch (e) { el.style.display = 'none'; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const cv = renderer.domElement;
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    el.appendChild(cv);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);

    // studio reflections
    (function () {
        const pm = new THREE.PMREMGenerator(renderer), env = new THREE.Scene();
        env.add(new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: 0x0b1020, side: THREE.BackSide })));
        const panel = (w, h, p, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(p[0], p[1], p[2]); m.lookAt(0, 0, 0); env.add(m); };
        panel(14, 8, [6, 10, 12], new THREE.Color(5, 5, 5.2));
        panel(8, 14, [-14, 2, 4], new THREE.Color(0.6, 1.4, 4.5));
        panel(8, 14, [14, 0, -4], new THREE.Color(4, 0.8, 2.2));
        panel(20, 6, [0, 14, -8], new THREE.Color(2, 2, 2.4));
        scene.environment = pm.fromScene(env, 0.03).texture; pm.dispose();
    })();
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(4, 6, 7); scene.add(key);
    const lb = new THREE.PointLight(0x3b82f6, 1.6, 24); lb.position.set(-5, 2, 3); scene.add(lb);
    const lp = new THREE.PointLight(0xff4fa3, 1.2, 24); lp.position.set(5, -2, 3); scene.add(lp);

    // one mesh whose vertices morph between convex shapes
    const geo = new THREE.IcosahedronGeometry(1, 24);
    const pa = geo.attributes.position, n = pa.count;
    const dirs = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
        const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i), l = Math.hypot(x, y, z) || 1;
        dirs[i * 3] = x / l; dirs[i * 3 + 1] = y / l; dirs[i * 3 + 2] = z / l;
    }
    const norm = v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; };
    const planar = (normals, h) => (x, y, z) => {
        let r = 1e9;
        for (const q of normals) { const d = q[0] * x + q[1] * y + q[2] * z; if (d > 1e-6) { const v = h / d; if (v < r) r = v; } }
        return r;
    };
    const cubeN = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    const tetN = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(norm);
    const octN = []; [1, -1].forEach(a => [1, -1].forEach(b => [1, -1].forEach(c => octN.push(norm([a, b, c])))));
    const shapes = [
        { f: planar(cubeN, 0.8), c: 0x3b82f6 },
        { f: planar(tetN, 0.45), c: 0xff4fa3 },
        { f: () => 1.1, c: 0x10b981 },
        { f: planar(octN, 0.78), c: 0xf59e0b },
        { f: (x, y, z) => { const rr = Math.hypot(x, z); let r = 1e9; if (rr > 1e-6) r = Math.min(r, 0.95 / rr); if (Math.abs(y) > 1e-6) r = Math.min(r, 0.95 / Math.abs(y)); return r; }, c: 0x7c5cff }
    ];
    const T = shapes.map(s => {
        const a = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
            const x = dirs[i * 3], y = dirs[i * 3 + 1], z = dirs[i * 3 + 2], r = s.f(x, y, z);
            a[i * 3] = x * r; a[i * 3 + 1] = y * r; a[i * 3 + 2] = z * r;
        }
        return a;
    });
    const cols = shapes.map(s => new THREE.Color(s.c));
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, metalness: 0.35, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15, flatShading: true });
    const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false;
    const group = new THREE.Group(); group.add(mesh); scene.add(group);
    const P = pa.array;
    function blend(a, b, e) {
        const A = T[a], B = T[b];
        for (let i = 0; i < P.length; i++) P[i] = A[i] + (B[i] - A[i]) * e;
        pa.needsUpdate = true;
        mat.color.copy(cols[a]).lerp(cols[b], e);
    }
    blend(0, 0, 0);

    function resize() {
        const w = el.clientWidth || 400, h = el.clientHeight || 400;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.set(0, 0, camera.aspect < 0.9 ? 8.5 : 7);
        camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
    }
    resize(); window.addEventListener('resize', resize);

    let tx = 0, ty = 0, mx = 0, my = 0, visible = true, held = 0;
    window.addEventListener('pointermove', e => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; });
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(el);
    const HOLD = 2.4, MORPH = 1.8, CYC = HOLD + MORPH, clock = new THREE.Clock();
    const ease = x => x * x * (3 - 2 * x);
    (function tick() {
        requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime();
        mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
        const k = Math.floor(t / CYC), loc = t % CYC, a = k % shapes.length, b = (k + 1) % shapes.length;
        if (loc >= HOLD) { blend(a, b, ease((loc - HOLD) / MORPH)); held = -1; }
        else if (held !== a) { blend(a, a, 0); held = a; }
        const s = Math.max(0.001, Math.min(1, (t - 2.2) / 0.9));
        group.scale.setScalar(1 + 2.7 * Math.pow(s - 1, 3) + 1.7 * Math.pow(s - 1, 2));
        group.rotation.y = t * 0.45 + mx * 0.6;
        group.rotation.x = 0.35 + Math.sin(t * 0.5) * 0.15 + my * 0.4;
        group.position.y = Math.sin(t * 1.3) * 0.1;
        renderer.render(scene, camera);
    })();
})();

(function () {
    const btn = document.getElementById('menuBtn'), nav = document.getElementById('mainNav');
    if (!btn || !nav) return;
    const set = (open) => { nav.classList.toggle('open', open); btn.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', () => set(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) set(false); });
})();

(function () {
    const t = document.getElementById('logoTrack');
    if (!t) return;
    Array.from(t.children).forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); t.appendChild(k); });
})();

(function () {
    const photos = [
        "v_MOTO_HEADS.jpg",
        "v_MOTO_ZONE_HONDA_.jpg",
        "v_MOTO_ZONE_HONDA.jpg",
        "v_MOTOZONE_HONDA.jpg",
        "v_as_yamaha.jpg",
        "v_as_yamaha2.jpg",
        "v_FORTUNE_YAMAHA_2_copy.jpg",
        "v_1.jpg",
        "v_2.jpg",
        "v_3.jpg",
        "v_AS_4.jpg",
        "v_AS_5.jpg",
        "v_3_1.jpg",
        "v_karath_tvs.jpg",
        "v_childerns_day.jpg",
        "v_YAMAHA.jpg"
    ];
    const details = [{"title": "Jupiter Booking Open", "category": "Vehicle Poster", "client": "Moto Heads Motors", "description": "TVS Jupiter launch poster. Two spectral-colour scooters stand on a pastel sunset terrace under a bold Malayalam headline, with a row of detail shots below and a red contact box in the footer."}, {"title": "Start the Ride in Style", "category": "Vehicle Poster", "client": "Motozone", "description": "Rainy night-city scene with a rider on a yellow and black Honda scooter. Huge yellow down payment and exchange bonus numbers, plus a side panel of free accessories."}, {"title": "ADV160 Launch", "category": "Vehicle Poster", "client": "Motozone", "description": "Four ADV160 colours lined up in front of glass towers. White italic headline, colour labels with leader lines and a clear price-starts-at badge."}, {"title": "ADV160 Bookings Open", "category": "Vehicle Poster", "client": "Motozone", "description": "A black ADV160 on a mountain road at sunrise. Black and red type with a Bookings Open Now tag, and four detail shots along the bottom."}, {"title": "Let the Roads Change", "category": "Vehicle Poster", "client": "AS Motors", "description": "Two Yamaha scooters on a coastal road under a cloudy sky. Blue offer boxes for cashback, zero down payment and mileage, with a finance strip at the bottom."}, {"title": "Offer Beyond Onam", "category": "Vehicle Poster", "client": "AS Motors", "description": "Onam-themed poster with Maveli, banana leaves and marigold garlands around two Yamaha scooters. Zero down payment and mileage badges keep the offer clear."}, {"title": "Kidilan Offer, Kidilan Ride", "category": "Vehicle Poster", "client": "Fortune Yamaha", "description": "Golden-hour road with a woman riding a mint Yamaha scooter. Big red down payment and cashback numbers on yellow boxes, with free delivery and finance points."}, {"title": "A New Style for Your Journeys", "category": "Vehicle Poster", "client": "AS Motors", "description": "Two scooters on a dusk city terrace with a giant golden 0 for zero down payment. Door delivery and quick loan approval tags sit around the vehicles."}, {"title": "More Distance, More Style", "category": "Vehicle Poster", "client": "AS Motors", "description": "Three Yamaha scooters in yellow, blue and grey on a moody dark-blue background. A zero down payment tag on the left and loan and delivery boxes at the bottom."}, {"title": "The Right Partner for Your Rides", "category": "Vehicle Poster", "client": "AS Motors", "description": "Two black Yamaha scooters in front of a city skyline, with a big red 0 for zero down payment against a blue-to-orange dusk sky."}, {"title": "New Ride, New Vibe", "category": "Vehicle Poster", "client": "AS Motors", "description": "Three Yamaha hybrid scooters on a vivid purple and blue neon stage. A hot-pink Zero Down Payment badge and a bold Malayalam and English headline."}, {"title": "Look Mass, Ride Class", "category": "Vehicle Poster", "client": "AS Motors", "description": "A rider on a Yamaha scooter in motion blur, with purple and blue night streaks. Tilted headline and a boxed zero down payment callout."}, {"title": "Make Your Dreams Yours", "category": "Vehicle Poster", "client": "Lekshmi Honda", "description": "A boy sleeping with a dream bubble showing a red Honda scooter. Glowing Malayalam headline, cash discount and down payment cards, and a free accessories strip."}, {"title": "A New Style for Your Journeys", "category": "Vehicle Poster", "client": "Karath TVS", "description": "Two Jupiter scooters at dusk with a giant golden 0. A strip of loan tenure, low interest and low EMI points sits below the vehicles."}, {"title": "Happy Children's Day", "category": "Vehicle Poster", "client": "Karath TVS", "description": "Festive poster with children gathered around a TVS Ronin motorcycle. Crayon-style rainbow lettering and a short, warm caption."}, {"title": "Journeys Will Continue", "category": "Vehicle Poster", "client": "Karath Motors", "description": "Three retro Yamaha motorcycles in red, grey and blue under split red and blue stage lighting. A big 9999 down payment box leads the poster."}];
    const A = document.getElementById('rowC'), B = document.getElementById('rowD'), wd = document.getElementById('vehicleDetail');
    if (!A || !B || !wd) return;
    const half = Math.ceil(photos.length / 2);
    function fill(row, offset, count) {
        for (let k = 0; k < 2; k++) {
            for (let n = 0; n < count; n++) {
                const idx = offset + n;
                const card = document.createElement('div');
                card.className = 'row-card'; card.tabIndex = 0;
                const img = document.createElement('img');
                img.src = photos[idx]; img.alt = details[idx].title; img.draggable = false;
                card.appendChild(img);
                card.addEventListener('click', () => openV(idx));
                card.addEventListener('keydown', e => { if (e.key === 'Enter') openV(idx); });
                row.appendChild(card);
            }
        }
    }
    fill(A, 0, half); fill(B, half, photos.length - half);
    A.style.animationDuration = '55s'; B.style.animationDuration = '62s';
    const img = wd.querySelector('.wd-img'), info = wd.querySelector('.wd-info');
    let cur = 0;
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    function show(i) {
        cur = (i + photos.length) % photos.length;
        const d = details[cur];
        img.src = photos[cur];
        const rows = [['Category', d.category], ['Client', d.client]].filter(r => r[1])
            .map(r => '<div class="wd-row"><span>' + r[0] + '</span><strong>' + esc(r[1]) + '</strong></div>').join('');
        info.innerHTML = '<div class="wd-count">' + String(cur + 1).padStart(2, '0') + ' / ' + String(photos.length).padStart(2, '0') + '</div>'
            + '<h3 class="wd-title">' + esc(d.title) + '</h3><p class="wd-desc">' + esc(d.description) + '</p><div class="wd-rows">' + rows + '</div>';
    }
    function openV(i) { show(i); wd.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeV() { wd.classList.remove('open'); document.body.style.overflow = ''; }
    wd.querySelector('.wd-close').addEventListener('click', closeV);
    wd.querySelector('.wd-prev').addEventListener('click', () => show(cur - 1));
    wd.querySelector('.wd-next').addEventListener('click', () => show(cur + 1));
    wd.addEventListener('click', e => { if (e.target === wd || e.target.classList.contains('wd-stage')) closeV(); });
    document.addEventListener('keydown', e => {
        if (!wd.classList.contains('open')) return;
        if (e.key === 'Escape') closeV();
        if (e.key === 'ArrowLeft') show(cur - 1);
        if (e.key === 'ArrowRight') show(cur + 1);
    });
})();
