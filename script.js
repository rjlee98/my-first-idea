// Interactive Background & Sparks for '내 첫번째 아이디어' Web Page

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let sparks = [];
const maxParticles = 60;
const mouse = { x: null, y: null, radius: 120 };

// Resize Canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track Mouse Moves
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class (Background)
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce on boundaries
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Mouse interaction (push away gently)
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.hypot(dx, dy);
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 1.5;
                this.y += Math.sin(angle) * force * 1.5;
            }
        }
    }

    draw() {
        ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
}

// Spark Class (Button Click Burst)
class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 3 + 2;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        // Color variation between indigo, magenta, and blue
        const colors = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#06b6d4'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // gravity effect
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Generate Spark Burst
function createSparks(x, y) {
    const amount = 30;
    for (let i = 0; i < amount; i++) {
        sparks.push(new Spark(x, y));
    }
}

// Setup Event Listeners
const sparkBtn = document.getElementById('spark-btn');
const mainTitle = document.getElementById('main-title');

sparkBtn.addEventListener('click', (e) => {
    const rect = sparkBtn.getBoundingClientRect();
    // Burst particles from center of button
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createSparks(x, y);

    // Dynamic title scaling on click
    mainTitle.style.transform = 'scale(1.1)';
    setTimeout(() => {
        mainTitle.style.transform = 'none';
    }, 150);
});

// Extra Interaction: Clicking Title also sparks!
mainTitle.addEventListener('click', (e) => {
    createSparks(e.clientX, e.clientY);
});

// Connect Particles with lines
function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.hypot(dx, dy);

            if (distance < 100) {
                const opacity = (100 - distance) / 100 * 0.15;
                ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw background particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawLines();

    // Update & draw interactive sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        if (sparks[i].alpha <= 0) {
            sparks.splice(i, 1);
        } else {
            sparks[i].draw();
        }
    }

    requestAnimationFrame(animate);
}

// Start loop
animate();
