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
        "work/ADDM.jpg",
        "work/ADDM2.jpg",
        "work/SKILLS5.jpg",
        "work/SKILLS_POSTER.jpg",
        "work/9.jpg",
        "work/10.jpg",
        "work/all_course.jpg",
        "work/DM_ABOSOLUTE_.jpg",
        "work/cyber_security_copy.jpg",
        "work/GD_AND_VE.jpg",
        "work/scene6.jpg",
        "work/DM1_car.jpg",
        "work/SKILLS__GTA.jpg",
        "work/IMG-20260512-WA0004.jpg",
        "work/IMG-20260512-WA0006.jpg",
        "work/IMG-20260513-WA0004.jpg",
        "work/IMG-20260515-WA0003.jpg",
        "work/IMG-20260520-WA0001.jpg",
        "work/IMG-20260520-WA0003.jpg",
        "work/IMG-20260522-WA0019.jpg",
        "work/IMG-20260522-WA0022.jpg",
        "work/IMG-20260529-WA0002.jpg",
        "work/IMG-20260529-WA0003.jpg",
        "work/IMG-20260529-WA0005.jpg",
        "work/IMG-20260530-WA0007.jpg",
        "work/IMG-20260606-WA0003.jpg",
        "work/IMG-20260608-WA0000.jpg",
        "work/IMG-20260608-WA0001.jpg",
        "work/IMG-20260608-WA0002.jpg",
        "work/IMG-20260608-WA0003.jpg",
        "work/IMG-20260611-WA0008.jpg",
        "work/IMG-20260617-WA0004 (1).jpg",
        "work/IMG-20260617-WA0005 (1).jpg",
        "work/WhatsApp Image 2026-06-09 at 3.43.52 PM.jpeg",
        "work/WhatsApp Image 2026-06-17 at 5.00.22 PM.jpeg"
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
    const svg = document.getElementById('penSvg');
    if (!svg) return;
    const path = document.getElementById('penPath');
    const dot = document.getElementById('penDot');
    // base points: A, B, C and the bezier handles
    const P = { A: [70, 400], h1: [120, 120], h2: [320, 60], B: [330, 250], h3: [340, 440], h4: [420, 420], C: [440, 110] };
    const els = {};
    ['A', 'B', 'C'].forEach(k => els[k] = document.getElementById('pt' + k));
    ['h1', 'h2', 'h3', 'h4'].forEach(k => els[k] = document.getElementById('hd' + k));
    const lines = { l1: document.getElementById('ln1'), l2: document.getElementById('ln2'), l3: document.getElementById('ln3') };
    let mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', e => {
        const r = svg.getBoundingClientRect();
        tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width)));
        ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height)));
    });
    let visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(svg);
    function draw(t) {
        requestAnimationFrame(draw);
        if (!visible || document.hidden) return;
        t /= 1000;
        mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
        const q = {};
        const wob = [[0, 0], [0.9, 0.7], [1.7, 1.1], [2.3, 0.4], [3.1, 1.4], [3.9, 0.9], [4.6, 0.6]];
        Object.keys(P).forEach((k, i) => {
            const amp = /^h/.test(k) ? 14 : 5;
            q[k] = [P[k][0] + Math.sin(t * 0.8 + wob[i][0]) * amp + mx * (k === 'B' || k === 'h2' || k === 'h3' ? 26 : 12),
                    P[k][1] + Math.cos(t * 0.7 + wob[i][1]) * amp + my * (k === 'B' || k === 'h2' || k === 'h3' ? 26 : 12)];
        });
        path.setAttribute('d', 'M' + q.A + ' C' + q.h1 + ' ' + q.h2 + ' ' + q.B + ' S' + q.h4 + ' ' + q.C);
        // S reflects h2 about B; keep handle h3 on the mirrored point so the UI matches the curve
        const rx = 2 * q.B[0] - q.h2[0], ry = 2 * q.B[1] - q.h2[1];
        q.h3 = [rx, ry];
        ['A', 'B', 'C'].forEach(k => { els[k].setAttribute('transform', 'translate(' + q[k][0] + ' ' + q[k][1] + ')'); });
        ['h1', 'h2', 'h3', 'h4'].forEach(k => { els[k].setAttribute('cx', q[k][0]); els[k].setAttribute('cy', q[k][1]); });
        const L = (el, a, b) => { el.setAttribute('x1', a[0]); el.setAttribute('y1', a[1]); el.setAttribute('x2', b[0]); el.setAttribute('y2', b[1]); };
        L(lines.l1, q.A, q.h1); L(lines.l2, q.h2, q.h3); L(lines.l3, q.C, q.h4);
        const len = path.getTotalLength();
        const p = path.getPointAtLength(((t * 0.08) % 1) * len);
        dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
    }
    requestAnimationFrame(draw);
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
        "vehicles/MOTO_HEADS.jpg",
        "vehicles/MOTO_ZONE_HONDA_.jpg",
        "vehicles/MOTO_ZONE_HONDA.jpg",
        "vehicles/MOTOZONE_HONDA.jpg",
        "vehicles/as_yamaha.jpg",
        "vehicles/as_yamaha2.jpg",
        "vehicles/FORTUNE_YAMAHA_2_copy.jpg",
        "vehicles/1.jpg",
        "vehicles/2.jpg",
        "vehicles/3.jpg",
        "vehicles/AS_4.jpg",
        "vehicles/AS_5.jpg",
        "vehicles/3_1.jpg",
        "vehicles/karath_tvs.jpg",
        "vehicles/childerns_day.jpg",
        "vehicles/YAMAHA.jpg"
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
