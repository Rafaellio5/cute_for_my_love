// Плавающие частицы на фоне
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particlesArray = [];

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // создаём 40 частиц
  particlesArray = [];
  for (let i = 0; i < 40; i++) {
    particlesArray.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 2 + Math.random() * 3,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    });
  }
}
initCanvas();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;

    // отражение от краёв
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// обновляем размеры при ресайзе
window.addEventListener('resize', () => {
  initCanvas();
});
