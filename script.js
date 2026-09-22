tailwind.config = {
    theme: {
        extend: {
            colors: {
                gold: {
                    100: '#fef9c3',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                },
                amberGlow: '#fffbeb'
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                cursive: ['Great Vibes', 'cursive'],
                hand: ['Caveat', 'cursive'],
                sans: ['Poppins', 'sans-serif'],
            }
        }
    }
};

let canvas, ctx, width, height;
const petals = [];
const numPetals = 35;
const sparkles = [];

class Petal {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = Math.random() * 1 - 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.6 + 0.4;
        const colors = ['#facc15', '#fde047', '#eab308', '#fef08a'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX;
        this.angle += this.spin;

        if (this.y > height + 20) {
            this.reset();
        }
    }

    draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(this.size / 2, -this.size, this.size, 0);
        ctx.quadraticCurveTo(this.size / 2, this.size, 0, 0);
        ctx.fill();
        
        ctx.restore();
    }
}

class Sparkle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4;
        this.life = 1;
        this.decay = Math.random() * 0.03 + 0.015;
        this.color = '#fffbeb';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
    }

    draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function animate() {
    if (ctx) {
        ctx.clearRect(0, 0, width, height);

        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });

        for (let i = sparkles.length - 1; i >= 0; i--) {
            sparkles[i].update();
            sparkles[i].draw();
            if (sparkles[i].life <= 0) {
                sparkles.splice(i, 1);
            }
        }
    }

    requestAnimationFrame(animate);
}

window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('petals-canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        for (let i = 0; i < numPetals; i++) {
            petals.push(new Petal());
        }

        animate();
    }

    // Modal click listener
    const letterModal = document.getElementById('letter-modal');
    if (letterModal) {
        letterModal.addEventListener('click', (e) => {
            if (e.target === letterModal) {
                closeLetter();
            }
        });
    }

    // Audio Autoplay
    const audio = document.getElementById('bg-audio');
    if (audio) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.body.addEventListener('click', () => {
                    audio.play();
                }, { once: true });
            });
        }
    }
});

function triggerFlowerSparkle(svgX, svgY) {
    const svg = document.getElementById('flower-garden');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    
    const scaleX = rect.width / 500;
    const scaleY = rect.height / 400;
    
    const screenX = rect.left + (svgX * scaleX);
    const screenY = rect.top + (svgY * scaleY);

    for (let i = 0; i < 25; i++) {
        sparkles.push(new Sparkle(screenX, screenY));
    }
}

function triggerSurprise() {
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < 80; i++) {
        sparkles.push(new Sparkle(
            centerX + (Math.random() - 0.5) * 200,
            centerY + (Math.random() - 0.5) * 200
        ));
    }

    for (let i = 0; i < 20; i++) {
        const p = new Petal();
        p.y = Math.random() * height;
        p.speedY = Math.random() * 3 + 2;
        petals.push(p);
    }

    const frogGift = document.getElementById('frog-gift-overlay');
    if (frogGift) {
        frogGift.classList.add('show');

        const flowerHead = frogGift.querySelector('.gift-head');
        if (flowerHead) {
            flowerHead.style.animation = 'none';
            void flowerHead.offsetWidth;
            flowerHead.style.animation = '';
        }
    }
}

function closeFrogGift(event) {
    const frogGift = document.getElementById('frog-gift-overlay');
    if (!event || event.target === frogGift) {
        if (frogGift) frogGift.classList.remove('show');
    }
}

function openLetter() {
    const letterModal = document.getElementById('letter-modal');
    const modalCard = document.getElementById('modal-card');
    if (letterModal && modalCard) {
        letterModal.classList.remove('opacity-0', 'pointer-events-none');
        modalCard.classList.remove('scale-90');
        modalCard.classList.add('scale-100');
    }
}

function closeLetter() {
    const letterModal = document.getElementById('letter-modal');
    const modalCard = document.getElementById('modal-card');
    if (letterModal && modalCard) {
        letterModal.classList.add('opacity-0', 'pointer-events-none');
        modalCard.classList.remove('scale-100');
        modalCard.classList.add('scale-90');
    }
}

function toggleMute() {
    const audio = document.getElementById('bg-audio');
    const btnText = document.getElementById('music-text');
    const icon = document.getElementById('music-icon');

    if (audio) {
        if (audio.muted) {
            audio.muted = false;
            if (btnText) btnText.textContent = "Silenciar";
            if (icon) icon.className = "fas fa-volume-up text-amber-600";
        } else {
            audio.muted = true;
            if (btnText) btnText.textContent = "Activar Sonido";
            if (icon) icon.className = "fas fa-volume-mute text-amber-600";
        }
    }
}