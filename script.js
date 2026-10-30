/**
 * Rachmad Hanif Portfolio - Interactive Logic
 * Reference: Brittany Chiang v5 Portfolio Features
 */

// ===== 1. Preloader Logic =====
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  function dismissPreloader() {
    preloader.classList.add('loaded');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 450);
  }

  if (document.readyState === 'complete') {
    setTimeout(dismissPreloader, 250);
  } else {
    window.addEventListener('load', () => setTimeout(dismissPreloader, 250));
  }

  // Safety fallback
  setTimeout(dismissPreloader, 1500);
})();

// ===== 2. Mouse Spotlight Tracker (Brittany Chiang Signature Effect) =====
(function initSpotlight() {
  let mouseX = -600;
  let mouseY = -600;
  let ticking = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
          document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
})();

// ===== 3. Theme Toggle (Dark Navy / Clean Slate Light) =====
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const themeToggleIcon = document.getElementById('themeToggleIcon');
const themeToggleLabel = document.getElementById('themeToggleLabel');
const themeColorMeta = document.getElementById('themeColorMeta');

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    localStorage.setItem('rh-portfolio-theme', 'light');

    if (themeToggleIcon) themeToggleIcon.className = 'fa-regular fa-moon';
    if (themeToggleLabel) themeToggleLabel.textContent = 'Dark Mode';
    if (themeColorMeta) themeColorMeta.setAttribute('content', '#f8fafc');
  } else {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
    localStorage.setItem('rh-portfolio-theme', 'dark');

    if (themeToggleIcon) themeToggleIcon.className = 'fa-regular fa-sun';
    if (themeToggleLabel) themeToggleLabel.textContent = 'Light Mode';
    if (themeColorMeta) themeColorMeta.setAttribute('content', '#0a192f');
  }
}

// Read saved preference or system preference (Default to Brittany Chiang Dark)
const savedTheme = localStorage.getItem('rh-portfolio-theme') || 'dark';
applyTheme(savedTheme);

function toggleTheme() {
  const isLight = document.body.classList.contains('theme-light');
  const nextTheme = isLight ? 'dark' : 'light';
  applyTheme(nextTheme);
  showToast(nextTheme === 'dark' ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan');
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

// ===== 4. ScrollSpy & Dynamic Nav Indicator (Brittany Chiang Lines) =====
(function initScrollSpy() {
  const sections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('.nav-item');

  if (!sections.length || !navItems.length) return;

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 200;

    let currentSectionId = '';
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // If at top of page, default to first section
    if (window.scrollY < 200 && sections[0]) {
      currentSectionId = sections[0].getAttribute('id');
    }

    // If near bottom of the page, activate contact
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      currentSectionId = 'contact';
    }

    if (currentSectionId) {
      navItems.forEach((link) => {
        if (link.getAttribute('data-section') === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
})();

// ===== 5. Toast Feedback =====
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ===== 6. Copy to Clipboard Utility =====
function salinKontak(text, label) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast(`${label} berhasil disalin ke clipboard!`))
      .catch(() => fallbackCopy(text, label));
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast(`${label} berhasil disalin ke clipboard!`);
  } catch (err) {
    showToast('Gagal menyalin teks.');
  }
  document.body.removeChild(ta);
}

// ===== 7. WhatsApp Quick Composer Form =====
const waForm = document.getElementById('waForm');
if (waForm) {
  waForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('waName').value.trim();
    const topic = document.getElementById('waTopic').value;
    const message = document.getElementById('waMessage').value.trim();

    if (!name || !message) return;

    const formattedMessage =
      `Halo Rachmad Hanif,\n\n` +
      `Nama / Instansi: ${name}\n` +
      `Tujuan: ${topic}\n\n` +
      `Pesan:\n${message}`;

    const waUrl = `https://wa.me/6282252288526?text=${encodeURIComponent(formattedMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
}

// ===== 8. Interactive Project Lightbox Gallery Modal =====
(function initProjectLightbox() {
  const modal = document.getElementById('projectLightbox');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');
  const imgElement = document.getElementById('lightboxImg');
  const titleElement = document.getElementById('lightboxTitle');
  const counterElement = document.getElementById('lightboxCounter');
  const captionElement = document.getElementById('lightboxCaption');
  const thumbnailsContainer = document.getElementById('lightboxThumbnails');

  if (!modal || !imgElement) return;

  let currentImages = [];
  let currentCaptions = [];
  let currentIndex = 0;
  let currentTitle = '';
  let lastFocusedElement = null;

  function openGallery(wrapper) {
    try {
      const rawImages = wrapper.getAttribute('data-gallery-images');
      const rawCaptions = wrapper.getAttribute('data-gallery-captions');
      currentTitle = wrapper.getAttribute('data-gallery-title') || 'Proyek';

      currentImages = rawImages ? JSON.parse(rawImages) : [];
      currentCaptions = rawCaptions ? JSON.parse(rawCaptions) : [];
    } catch (err) {
      console.error('Gagal mem-parsing data galeri:', err);
      const singleImg = wrapper.querySelector('img');
      currentImages = singleImg ? [singleImg.src] : [];
      currentCaptions = [singleImg ? singleImg.alt : ''];
    }

    if (!currentImages.length) return;

    lastFocusedElement = wrapper;
    currentIndex = 0;
    renderGallery();

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for keyboard accessibility
    if (closeBtn) closeBtn.focus();
  }

  function closeGallery() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function renderGallery() {
    if (!currentImages.length) return;

    const total = currentImages.length;
    if (currentIndex >= total) currentIndex = 0;
    if (currentIndex < 0) currentIndex = total - 1;

    const currentSrc = currentImages[currentIndex];
    const currentCap = currentCaptions[currentIndex] || '';

    // Main image & info
    imgElement.style.opacity = '0.3';
    setTimeout(() => {
      imgElement.src = currentSrc;
      imgElement.alt = `${currentTitle} - Tangkapan Layar ${currentIndex + 1}`;
      imgElement.style.opacity = '1';
    }, 120);

    if (titleElement) titleElement.textContent = currentTitle;
    if (counterElement) counterElement.textContent = `${currentIndex + 1} / ${total}`;
    if (captionElement) captionElement.textContent = currentCap;

    // Toggle navigation buttons visibility if only 1 image
    if (total <= 1) {
      if (prevBtn) prevBtn.classList.add('hidden');
      if (nextBtn) nextBtn.classList.add('hidden');
      if (thumbnailsContainer) thumbnailsContainer.style.display = 'none';
    } else {
      if (prevBtn) prevBtn.classList.remove('hidden');
      if (nextBtn) nextBtn.classList.remove('hidden');
      if (thumbnailsContainer) {
        thumbnailsContainer.style.display = 'flex';
        renderThumbnails();
      }
    }
  }

  function renderThumbnails() {
    if (!thumbnailsContainer) return;
    thumbnailsContainer.innerHTML = '';

    currentImages.forEach((src, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `lightbox-thumb-item ${idx === currentIndex ? 'active' : ''}`;
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', `Pilih tangkapan layar ${idx + 1}`);

      const thumbImg = document.createElement('img');
      thumbImg.src = src;
      thumbImg.alt = `Miniatur ${idx + 1}`;
      thumbImg.loading = 'lazy';

      thumb.appendChild(thumbImg);

      thumb.addEventListener('click', () => {
        currentIndex = idx;
        renderGallery();
      });

      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          currentIndex = idx;
          renderGallery();
        }
      });

      thumbnailsContainer.appendChild(thumb);
    });

    // Auto-scroll active thumbnail into view
    const activeThumb = thumbnailsContainer.querySelector('.lightbox-thumb-item.active');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function nextImage() {
    if (currentImages.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    renderGallery();
  }

  function prevImage() {
    if (currentImages.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    renderGallery();
  }

  // Bind triggers on all project thumbnail wrappers
  const wrappers = document.querySelectorAll('.project-thumbnail-wrapper');
  wrappers.forEach((wrap) => {
    wrap.addEventListener('click', (e) => {
      e.stopPropagation();
      openGallery(wrap);
    });

    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGallery(wrap);
      }
    });
  });

  // Controls listeners
  if (closeBtn) closeBtn.addEventListener('click', closeGallery);
  if (backdrop) backdrop.addEventListener('click', closeGallery);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

  // Keyboard navigation (Escape, Left, Right)
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeGallery();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  });
})();

