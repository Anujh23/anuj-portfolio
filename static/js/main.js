/* ============================================
   ANUJ — DATA & AI ENGINEER PORTFOLIO
   Main JavaScript — Glassmorphism Theme
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Loader with guaranteed removal (BUG-4 fix)
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hidden");
      loader.addEventListener("transitionend", () => {
        loader.style.display = "none";
      }, { once: true });
      // Fallback if transition doesn't fire
      setTimeout(() => { loader.style.display = "none"; }, 600);
    }, 300);
  }

  initParticles();
  initNavbar();
  initMobileNav();
  initCounters();
  initScrollReveal();
  initActiveNav();
  initMusicPlayer();
});

/* ============================================
   PARTICLES — Disabled on mobile, paused when hidden
   ============================================ */
function initParticles() {
  if (window.innerWidth < 768) return;

  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId = null;
  const COUNT = 50;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  // Debounced resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      // Store base color channels, not baked string (BUG-1 fix)
      this.baseColor = Math.random() > 0.7
        ? [37, 99, 235, 0.6]
        : [8, 145, 178, 0.3];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= 0.001;
      if (this.opacity <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      const [r, g, b, mult] = this.baseColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity * mult})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Separated update/draw passes for performance
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
    }
    animId = requestAnimationFrame(animate);
  }
  animate();

  // Pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
      animId = null;
    } else if (!animId) {
      animate();
    }
  });
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ============================================
   MOBILE NAV
   ============================================ */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.classList.toggle("open");
    links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  links.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
    });
  });
}

/* ============================================
   STAT COUNTERS (BUG-3 fix: suffix shows from start)
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll(".stat-value[data-target]");
  if (!counters.length) return;
  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute("data-target"));
          const suffix = counter.getAttribute("data-suffix") || "";
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsEl = document.querySelector(".hero-stats");
  if (statsEl) observer.observe(statsEl);
}

/* ============================================
   SCROLL REVEAL — IntersectionObserver
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".about-card, .skill-card, .project-card, .timeline-item, .contact-channel, .connect-center, .projects-subtitle"
  );

  revealElements.forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   ACTIVE NAV LINK
   ============================================ */
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("data-section") === id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: "-70px 0px 0px 0px" });

  sections.forEach(section => observer.observe(section));
}

/* ============================================
   MUSIC PLAYER — Hero button with sound bars
   ============================================ */
function initMusicPlayer() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicToggleHero");
  if (!audio || !btn) return;

  const label = btn.querySelector(".music-label");
  audio.volume = 0.3;
  let playing = false;

  function setPlaying() {
    playing = true;
    btn.classList.add("playing");
    if (label) label.textContent = "PAUSE";
    btn.setAttribute("aria-label", "Pause music");
  }

  function setPaused() {
    playing = false;
    btn.classList.remove("playing");
    if (label) label.textContent = "PLAY";
    btn.setAttribute("aria-label", "Play music");
  }

  btn.addEventListener("click", () => {
    if (playing) {
      audio.pause();
      setPaused();
    } else {
      audio.play().then(() => setPlaying()).catch(() => setPaused());
    }
  });
}
