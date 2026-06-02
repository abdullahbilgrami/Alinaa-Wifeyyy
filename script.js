/* ═══════════════════════════════════════════════════
   PREMIUM ROMANTIC WEBSITE — SCRIPT.JS
   ═══════════════════════════════════════════════════ */

// ═══════════════ HERO STARS ═══════════════
(function createHeroStars() {
  const container = document.getElementById('heroStars');
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${2 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(star);
  }
})();

// ═══════════════ AMBIENT PARTICLE CANVAS ═══════════════
const pCanvas = document.getElementById('particleCanvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticleCanvas() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

function createParticle() {
  return {
    x: Math.random() * pCanvas.width,
    y: Math.random() * pCanvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '212,175,55' : '181,123,238'
  };
}

for (let i = 0; i < 60; i++) particles.push(createParticle());

function animateParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = pCanvas.width;
    if (p.x > pCanvas.width) p.x = 0;
    if (p.y < 0) p.y = pCanvas.height;
    if (p.y > pCanvas.height) p.y = 0;
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${p.color},${p.alpha})`;
    pCtx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ═══════════════ FLOATING HEARTS ═══════════════
function spawnHeart() {
  const container = document.getElementById('floatingHearts');
  const heart = document.createElement('div');
  heart.className = 'float-heart';
  const hearts = ['❤️', '💕', '💖', '💗', '💓', '🌹', '✨'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.left = Math.random() * 100 + '%';
  const dur = 8 + Math.random() * 10;
  heart.style.animationDuration = dur + 's';
  heart.style.animationDelay = Math.random() * 2 + 's';
  heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  container.appendChild(heart);
  setTimeout(() => heart.remove(), (dur + 2) * 1000);
}

// ═══════════════ ROSE PETALS ═══════════════
function spawnPetal() {
  const container = document.getElementById('rosePetals');
  const petal = document.createElement('div');
  petal.className = 'rose-petal';
  petal.style.left = Math.random() * 100 + '%';
  const dur = 6 + Math.random() * 8;
  petal.style.animationDuration = dur + 's';
  petal.style.animationDelay = Math.random() + 's';
  const hue = 340 + Math.floor(Math.random() * 20);
  petal.style.background = `radial-gradient(ellipse at center, hsl(${hue},70%,65%), hsl(${hue},60%,35%))`;
  container.appendChild(petal);
  setTimeout(() => petal.remove(), (dur + 2) * 1000);
}

setInterval(spawnHeart, 1200);
setInterval(spawnPetal, 800);

// ═══════════════ MUSIC PLAYER ═══════════════
const audio = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const musicPlayer = document.getElementById('musicPlayer');
let isPlaying = false;
let isMuted = false;

audio.volume = 0.6;

function startMusic() {
  audio.play().then(() => {
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    musicPlayer.classList.remove('hidden');
  }).catch(() => {});
}

playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = '♪';
  } else {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
  }
});

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
});

volumeSlider.addEventListener('input', () => {
  audio.volume = parseFloat(volumeSlider.value);
});

// ═══════════════ ENTER BUTTON ═══════════════
const enterBtn = document.getElementById('enterBtn');
const mainContent = document.getElementById('mainContent');
const scrollHint = document.getElementById('scrollHint');

enterBtn.addEventListener('click', () => {
  startMusic();
  mainContent.classList.remove('hidden');
  scrollHint.classList.remove('hidden');
  enterBtn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    mainContent.scrollIntoView({ behavior: 'smooth' });
  }, 300);
  setTimeout(startTyping, 600);
});

// ═══════════════ TYPING ANIMATION ═══════════════
const typingLines = [
  "Every day I thank Allah for bringing you into my life...",
  "Every night I thank Allah for letting me love you...",
  "And every future dream I have begins with you..."
];

let lineIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');
let typingStarted = false;

function startTyping() {
  if (typingStarted) return;
  typingStarted = true;
  typeLoop();
}

function typeLoop() {
  const current = typingLines[lineIdx];
  if (!isDeleting) {
    typingEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      setTimeout(() => { isDeleting = true; typeLoop(); }, 2200);
      return;
    }
    setTimeout(typeLoop, 55);
  } else {
    typingEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      lineIdx = (lineIdx + 1) % typingLines.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 30);
  }
}

// ═══════════════ SCROLL REVEAL ═══════════════
const revealEls = document.querySelectorAll(
  '.story-slide, .love-card, .counter-item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.classList.contains('love-card')
        ? (Array.from(el.parentNode.children).indexOf(el)) * 80
        : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Final lines reveal
const finalLinesEl = document.getElementById('finalLines');
const finalLines = document.querySelectorAll('.final-line');

const finalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      finalLines.forEach(line => {
        const delay = parseInt(line.dataset.delay || 0);
        setTimeout(() => line.classList.add('visible'), delay);
      });
      finalObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (finalLinesEl) finalObserver.observe(finalLinesEl);

// ═══════════════ LOVE COUNTER ═══════════════
// Using a meaningful start date (customize if known)
const startDate = new Date('2024-01-01T00:00:00');

function updateCounter() {
  const now = new Date();
  const diff = now - startDate;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  const dEl = document.getElementById('days');
  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('minutes');
  const sEl = document.getElementById('seconds');
  if (dEl) dEl.textContent = String(d).padStart(3, '0');
  if (hEl) hEl.textContent = String(h).padStart(2, '0');
  if (mEl) mEl.textContent = String(m).padStart(2, '0');
  if (sEl) sEl.textContent = String(s).padStart(2, '0');
}

updateCounter();
setInterval(updateCounter, 1000);

// ═══════════════ FOREVER BUTTON — EXPLOSION ═══════════════
const foreverBtn = document.getElementById('foreverBtn');
const iLoveYouMsg = document.getElementById('iLoveYouMsg');
const exCanvas = document.getElementById('explosionCanvas');
const exCtx = exCanvas.getContext('2d');
let explosionParticles = [];
let explosionRunning = false;

function resizeExCanvas() {
  exCanvas.width = window.innerWidth;
  exCanvas.height = window.innerHeight;
}
resizeExCanvas();
window.addEventListener('resize', resizeExCanvas);

function createExplosionParticle() {
  const angle = Math.random() * Math.PI * 2;
  const speed = 2 + Math.random() * 8;
  const colors = [
    '#d4af37','#f0d060','#ff6b8a','#c0566a','#b57bee',
    '#ffffff','#ff3366','#ffd700','#ff69b4'
  ];
  const types = ['❤️','💕','🌹','✨','💖','⭐','🌸'];
  return {
    x: exCanvas.width / 2,
    y: exCanvas.height / 2,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 1,
    decay: 0.008 + Math.random() * 0.015,
    size: 8 + Math.random() * 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    type: Math.random() > 0.5 ? 'circle' : 'emoji',
    emoji: types[Math.floor(Math.random() * types.length)],
    gravity: 0.08 + Math.random() * 0.1,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.2,
    isRose: Math.random() > 0.6
  };
}

function animateExplosion() {
  exCtx.clearRect(0, 0, exCanvas.width, exCanvas.height);
  explosionParticles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.99;
    p.life -= p.decay;
    p.rotation += p.rotSpeed;
    if (p.life <= 0) { explosionParticles.splice(idx, 1); return; }
    exCtx.save();
    exCtx.globalAlpha = p.life;
    exCtx.translate(p.x, p.y);
    exCtx.rotate(p.rotation);
    if (p.type === 'emoji') {
      exCtx.font = `${p.size}px serif`;
      exCtx.textAlign = 'center';
      exCtx.textBaseline = 'middle';
      exCtx.fillText(p.emoji, 0, 0);
    } else {
      if (p.isRose) {
        // petal shape
        exCtx.beginPath();
        exCtx.ellipse(0, -p.size/3, p.size/3, p.size/2, 0, 0, Math.PI*2);
        exCtx.fillStyle = p.color;
        exCtx.fill();
      } else {
        exCtx.beginPath();
        exCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        exCtx.fillStyle = p.color;
        exCtx.shadowBlur = 10;
        exCtx.shadowColor = p.color;
        exCtx.fill();
      }
    }
    exCtx.restore();
  });

  if (explosionParticles.length > 0) {
    requestAnimationFrame(animateExplosion);
  } else {
    exCanvas.style.display = 'none';
    explosionRunning = false;
  }
}

foreverBtn.addEventListener('click', () => {
  // Show message
  iLoveYouMsg.classList.remove('hidden');
  foreverBtn.style.transform = 'scale(0.95)';
  setTimeout(() => foreverBtn.style.transform = '', 200);

  // Explosion
  if (!explosionRunning) {
    explosionRunning = true;
    exCanvas.style.display = 'block';
    for (let i = 0; i < 300; i++) {
      setTimeout(() => {
        explosionParticles.push(createExplosionParticle());
      }, i * 6);
    }
    animateExplosion();
  }

  // Extra hearts burst
  for (let i = 0; i < 20; i++) {
    setTimeout(spawnHeart, i * 100);
    setTimeout(spawnPetal, i * 80);
  }

  // Screen glow effect
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; inset: 0;
    background: radial-gradient(ellipse at center, rgba(212,175,55,0.3), transparent);
    pointer-events: none; z-index: 9990;
    animation: fadeGlow 1.5s ease forwards;
  `;
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeGlow { 0% {opacity:0} 30% {opacity:1} 100% {opacity:0} }`;
  document.head.appendChild(style);
  document.body.appendChild(glow);
  setTimeout(() => glow.remove(), 2000);
});

// ═══════════════ PARALLAX ON HERO ═══════════════
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.transform = `scale(1.08) translateY(${scrolled * 0.3}px)`;
  }
});
