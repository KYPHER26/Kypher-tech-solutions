// ---------- animated particle network background ----------
(function () {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles;
  const COLOR_DOT = 'rgba(47, 92, 255, 0.85)';   // --cyan
  const COLOR_DOT_2 = 'rgba(0, 217, 192, 0.8)';   // --cyan-2
  const LINE_COLOR = '47, 92, 255';               // rgb for line gradient
  const LINK_DISTANCE = 150;
  const DENSITY = 7000; // lower = more particles

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const count = Math.min(70, Math.floor((width * height) / DENSITY));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2.2 + 1.6,
      alt: Math.random() > 0.7,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // move + draw dots
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.alt ? COLOR_DOT_2 : COLOR_DOT;
      ctx.fill();
    });

    // draw connecting lines between nearby dots
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DISTANCE) {
          const opacity = (1 - dist / LINK_DISTANCE) * 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${LINE_COLOR}, ${opacity})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  makeParticles();
  step(); // draw at least one static frame even if motion is reduced

  window.addEventListener('resize', () => {
    resize();
    makeParticles();
  });
})();
