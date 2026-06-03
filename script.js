/* ═══════════════════════════════════════════════════
   PREMIUM ROMANTIC WEBSITE — SCRIPT.JS  (Performance Edition)
   ═══════════════════════════════════════════════════ */

// ─── Utility: run only when tab is visible ───────────────
let pageVisible = !document.hidden;
document.addEventListener('visibilitychange', () => {
  pageVisible = !document.hidden;
});

// ═══════════════ HERO STARS (CSS-only, no JS loop) ═══════════════
(function createHeroStars() {
  const container = document.getElementById('heroStars');
  if (!container) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 60; i++) {           // reduced from 80
    const star = document.createElement('div');
    star.className = 'star-dot';
    const size = Math.random() * 2.5 + 0.8;
    star.style.cssText =
      `width:${size}px;height:${size}px;` +
      `left:${Math.random()*100}%;top:${Math.random()*100}%;` +
      `animation-duration:${2+Math.random()*4}s;` +
      `animation-delay:${Math.random()*5}s`;
    frag.appendChild(star);
  }
  container.appendChild(frag);
})();

// ═══════════════ AMBIENT PARTICLE CANVAS ═══════════════
// Throttled to 20fps, paused when tab hidden or scrolled away
const pCanvas = document.getElementById('particleCanvas');
const pCtx    = pCanvas.getContext('2d', { alpha: true });
let   particles = [];
let   pLastTime = 0;
const P_FPS = 20;                           // 20fps is plenty for slow drift
const P_INTERVAL = 1000 / P_FPS;

function resizeParticleCanvas() {
  pCanvas.width  = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeParticleCanvas, 200);  // debounce
});

// Pre-build style strings to avoid string concatenation each frame
const P_COLORS = ['212,175,55', '181,123,238'];
function createParticle() {
  return {
    x:     Math.random() * pCanvas.width,
    y:     Math.random() * pCanvas.height,
    vx:    (Math.random() - 0.5) * 0.25,
    vy:    (Math.random() - 0.5) * 0.25,
    size:  Math.random() * 1.8 + 0.4,
    alpha: Math.random() * 0.45 + 0.08,
    color: P_COLORS[Math.random() > 0.5 ? 0 : 1]
  };
}
for (let i = 0; i < 45; i++) particles.push(createParticle()); // reduced from 60

function animateParticles(ts) {
  requestAnimationFrame(animateParticles);
  if (!pageVisible) return;
  if (ts - pLastTime < P_INTERVAL) return;  // throttle to 20fps
  pLastTime = ts;

  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  const len = particles.length;
  for (let i = 0; i < len; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = pCanvas.width;
    else if (p.x > pCanvas.width)  p.x = 0;
    if (p.y < 0) p.y = pCanvas.height;
    else if (p.y > pCanvas.height) p.y = 0;
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${p.color},${p.alpha})`;
    pCtx.fill();
  }
}
requestAnimationFrame(animateParticles);

// ═══════════════ FLOATING HEARTS & PETALS ═══════════════
// Cap DOM nodes, use a pool concept with a max live count
const MAX_HEARTS = 8;
const MAX_PETALS = 10;
let heartCount = 0;
let petalCount = 0;

const HEART_EMOJIS = ['❤️','💕','💖','💗','💓','🌹','✨'];

function spawnHeart() {
  if (heartCount >= MAX_HEARTS) return;
  const container = document.getElementById('floatingHearts');
  const heart = document.createElement('div');
  heart.className = 'float-heart';
  heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  heart.style.left = Math.random() * 100 + '%';
  const dur = 9 + Math.random() * 8;
  heart.style.animationDuration = dur + 's';
  heart.style.fontSize = (0.9 + Math.random() * 1) + 'rem';
  container.appendChild(heart);
  heartCount++;
  setTimeout(() => { heart.remove(); heartCount--; }, dur * 1000);
}

function spawnPetal() {
  if (petalCount >= MAX_PETALS) return;
  const container = document.getElementById('rosePetals');
  const petal = document.createElement('div');
  petal.className = 'rose-petal';
  petal.style.left = Math.random() * 100 + '%';
  const dur = 7 + Math.random() * 7;
  petal.style.animationDuration = dur + 's';
  const hue = 340 + Math.floor(Math.random() * 20);
  // Use solid color instead of radial-gradient to avoid repaint cost
  petal.style.background = `hsl(${hue},65%,52%)`;
  container.appendChild(petal);
  petalCount++;
  setTimeout(() => { petal.remove(); petalCount--; }, dur * 1000);
}

// Slower spawn rate + only when visible
setInterval(() => { if (pageVisible) spawnHeart(); }, 1800);  // was 1200
setInterval(() => { if (pageVisible) spawnPetal(); }, 1400);  // was 800

// ═══════════════ MUSIC PLAYER ═══════════════
const audio       = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn     = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const musicPlayer = document.getElementById('musicPlayer');
let isPlaying = false;
let isMuted   = false;
audio.volume  = 0.6;

function startMusic() {
  audio.play().then(() => {
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    musicPlayer.classList.remove('hidden');
  }).catch(() => {});
}

playPauseBtn.addEventListener('click', () => {
  if (isPlaying) { audio.pause(); isPlaying = false; playPauseBtn.textContent = '♪'; }
  else           { audio.play();  isPlaying = true;  playPauseBtn.textContent = '⏸'; }
});
muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
});
volumeSlider.addEventListener('input', () => { audio.volume = +volumeSlider.value; });

// ═══════════════ ENTER BUTTON ═══════════════
const enterBtn   = document.getElementById('enterBtn');
const mainContent = document.getElementById('mainContent');
const scrollHint = document.getElementById('scrollHint');

enterBtn.addEventListener('click', () => {
  startMusic();
  mainContent.classList.remove('hidden');
  scrollHint.classList.remove('hidden');
  enterBtn.style.transform = 'scale(0.95)';
  setTimeout(() => { mainContent.scrollIntoView({ behavior: 'smooth' }); }, 300);
  setTimeout(startTyping, 600);
});

// ═══════════════ TYPING ANIMATION ═══════════════
const typingLines = [
  "Every day I thank Allah for bringing you into my life...",
  "Every night I thank Allah for letting me love you...",
  "And every future dream I have begins with you..."
];
let lineIdx = 0, charIdx = 0, isDeleting = false;
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
    typingEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      setTimeout(() => { isDeleting = true; typeLoop(); }, 2200);
      return;
    }
    setTimeout(typeLoop, 55);
  } else {
    typingEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      lineIdx = (lineIdx + 1) % typingLines.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 28);
  }
}

// ═══════════════ SCROLL REVEAL ═══════════════
const revealEls = document.querySelectorAll('.story-slide, .love-card, .counter-item');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = el.classList.contains('love-card')
      ? Array.from(el.parentNode.children).indexOf(el) * 75 : 0;
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// Final lines reveal
const finalLinesEl = document.getElementById('finalLines');
const finalLineEls = document.querySelectorAll('.final-line');
if (finalLinesEl) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      finalLineEls.forEach(line => {
        setTimeout(() => line.classList.add('visible'), parseInt(line.dataset.delay || 0));
      });
    });
  }, { threshold: 0.3 }).observe(finalLinesEl);
}

// ═══════════════ LOVE COUNTER ═══════════════
const startDate = new Date('2022-05-27T00:00:00');
const dEl = document.getElementById('days');
const hEl = document.getElementById('hours');
const mEl = document.getElementById('minutes');
const sEl = document.getElementById('seconds');

function updateCounter() {
  const diff = Date.now() - startDate.getTime();
  if (dEl) dEl.textContent = String(Math.floor(diff / 86400000)).padStart(3, '0');
  if (hEl) hEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  if (mEl) mEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  if (sEl) sEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
updateCounter();
setInterval(updateCounter, 1000);

// ═══════════════ FOREVER BUTTON — EXPLOSION ═══════════════
// Fix: use index-based removal instead of splice-while-iterating
// Fix: no shadowBlur (most expensive canvas op)
// Fix: fewer particles (150 instead of 300), spawned instantly not via 300 timeouts
const foreverBtn   = document.getElementById('foreverBtn');
const iLoveYouMsg  = document.getElementById('iLoveYouMsg');
const exCanvas     = document.getElementById('explosionCanvas');
const exCtx        = exCanvas.getContext('2d');
let   exParticles  = [];
let   exRunning    = false;
let   exRAF        = null;

function resizeExCanvas() {
  exCanvas.width  = window.innerWidth;
  exCanvas.height = window.innerHeight;
}
resizeExCanvas();
window.addEventListener('resize', () => { if (exRunning) resizeExCanvas(); });

const EX_COLORS  = ['#d4af37','#f0d060','#ff6b8a','#c0566a','#b57bee','#fff','#ff3366','#ffd700','#ff69b4'];
const EX_EMOJIS  = ['❤️','💕','🌹','✨','💖'];

function createExplosionParticle() {
  const angle = Math.random() * Math.PI * 2;
  const speed = 2 + Math.random() * 7;
  return {
    x:       exCanvas.width  * 0.5,
    y:       exCanvas.height * 0.5,
    vx:      Math.cos(angle) * speed,
    vy:      Math.sin(angle) * speed,
    life:    1,
    decay:   0.010 + Math.random() * 0.014,
    size:    7 + Math.random() * 16,
    color:   EX_COLORS[Math.floor(Math.random() * EX_COLORS.length)],
    isEmoji: Math.random() > 0.55,
    emoji:   EX_EMOJIS[Math.floor(Math.random() * EX_EMOJIS.length)],
    gravity: 0.07 + Math.random() * 0.09,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed:(Math.random() - 0.5) * 0.18
  };
}

function animateExplosion() {
  exCtx.clearRect(0, 0, exCanvas.width, exCanvas.height);
  const alive = [];
  for (let i = 0; i < exParticles.length; i++) {
    const p = exParticles[i];
    p.x  += p.vx;   p.y  += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.985;
    p.life -= p.decay;
    p.rotation += p.rotSpeed;
    if (p.life <= 0) continue;   // drop dead particles (no splice)
    alive.push(p);

    exCtx.save();
    exCtx.globalAlpha = p.life;
    exCtx.translate(p.x, p.y);
    exCtx.rotate(p.rotation);
    if (p.isEmoji) {
      exCtx.font = `${p.size}px serif`;
      exCtx.textAlign = 'center';
      exCtx.textBaseline = 'middle';
      exCtx.fillText(p.emoji, 0, 0);
    } else {
      exCtx.beginPath();
      exCtx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
      exCtx.fillStyle = p.color;
      // NO shadowBlur — that was the #1 frame-rate killer
      exCtx.fill();
    }
    exCtx.restore();
  }
  exParticles = alive;

  if (exParticles.length > 0) {
    exRAF = requestAnimationFrame(animateExplosion);
  } else {
    exCanvas.style.display = 'none';
    exRunning = false;
    exRAF = null;
  }
}

foreverBtn.addEventListener('click', () => {
  iLoveYouMsg.classList.remove('hidden');
  foreverBtn.style.transform = 'scale(0.95)';
  setTimeout(() => { foreverBtn.style.transform = ''; }, 200);

  if (!exRunning) {
    exRunning = true;
    exCanvas.style.display = 'block';
    // Spawn 150 particles instantly — no 300 staggered timeouts
    for (let i = 0; i < 150; i++) exParticles.push(createExplosionParticle());
    if (exRAF) cancelAnimationFrame(exRAF);
    exRAF = requestAnimationFrame(animateExplosion);
  }

  // Burst 10 hearts/petals (not 20)
  for (let i = 0; i < 10; i++) {
    setTimeout(spawnHeart, i * 120);
    setTimeout(spawnPetal, i * 100);
  }

  // Glow overlay — CSS animation, no JS loop
  const glow = document.createElement('div');
  glow.style.cssText =
    'position:fixed;inset:0;' +
    'background:radial-gradient(ellipse at center,rgba(212,175,55,.25),transparent);' +
    'pointer-events:none;z-index:9990;' +
    'animation:fadeGlow 1.5s ease forwards';
  document.body.appendChild(glow);
  setTimeout(() => glow.remove(), 1600);
});

// ═══════════════ PARALLAX (passive + throttled) ═══════════════
// Cache the element, use transform3d for GPU layer, throttle with rAF
const heroBg = document.querySelector('.hero-bg');
let ticking  = false;
let lastScroll = 0;

window.addEventListener('scroll', () => {
  lastScroll = window.pageYOffset;
  if (!ticking) {
    requestAnimationFrame(() => {
      if (heroBg) {
        heroBg.style.transform = `scale(1.08) translate3d(0,${lastScroll * 0.28}px,0)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });   // passive:true lets browser scroll without waiting for JS
