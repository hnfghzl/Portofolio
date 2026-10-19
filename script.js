// ===== Preloader Logic =====
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Lock scroll while preloader is active
  document.body.style.overflow = 'hidden';

  function hidePreloader() {
    preloader.classList.add('loaded');
    document.body.style.overflow = '';
    preloader.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }

  // Smooth dismiss when page finishes loading
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 350);
  } else {
    window.addEventListener('load', () => {
      setTimeout(hidePreloader, 350);
    });
  }

  // Fallback safety timeout
  setTimeout(hidePreloader, 2000);
})();

// ===== Theme Mode Logic (Light by Default, Soft Slate Dark) =====
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const themeColorMeta = document.getElementById('themeColorMeta');

function updateThemeIcons(isDark) {
  [themeToggle, mobileThemeToggle].forEach((btn) => {
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (icon) {
      if (isDark) {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-regular fa-moon';
      }
    }
  });
}

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('portfolio-theme', 'dark');
    if (themeColorMeta) themeColorMeta.setAttribute('content', '#0f172a');
    updateThemeIcons(true);
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('portfolio-theme', 'light');
    if (themeColorMeta) themeColorMeta.setAttribute('content', '#f8fafc');
    updateThemeIcons(false);
  }
}

// Initial theme check
const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
setTheme(savedTheme);

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  setTheme(newTheme);
  showToast(newTheme === 'dark' ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan');
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

// ===== Mobile Menu Logic =====
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function openMobileMenu() {
  if (menuToggle) {
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  if (mobileMenu) mobileMenu.classList.add('open');
  if (mobileMenuOverlay) mobileMenuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  if (menuToggle) {
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

mobileNavLinks.forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
});

// ===== Scroll Reveal Animations =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// ===== Navigation Active State on Scroll =====
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot-nav a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.id;

        // Update dot nav
        dots.forEach((d) => d.classList.remove('active'));
        const activeDot = document.querySelector(`.dot-nav a[data-section="${currentId}"]`);
        if (activeDot) activeDot.classList.add('active');

        // Update mobile menu active states
        mobileNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  },
  { threshold: 0.25 }
);

sections.forEach((s) => navObserver.observe(s));

// ===== Toast Notification =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastText').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== Copy to Clipboard =====
function salinKontak(text, label) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast(label + ' berhasil disalin'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(label + ' berhasil disalin');
    } catch (e) {
      showToast('Gagal menyalin');
    }
    document.body.removeChild(ta);
  }
}

// ===== WhatsApp Contact Form =====
const waForm = document.getElementById('waForm');
if (waForm) {
  waForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('waName').value.trim();
    const topic = document.getElementById('waTopic').value;
    const message = document.getElementById('waMessage').value.trim();
    const text = `Halo Rachmad Hanif,%0A%0ASaya: ${encodeURIComponent(name)}%0ATopik: ${encodeURIComponent(topic)}%0A%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/6282252288526?text=${text}`, '_blank');
  });
}
