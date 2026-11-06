/* ============================================================
   VEXA Barbershop — main.js
   Fases 2 → 7: Navbar · Menu Mobile · Scroll Animations · Booking Modal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. NAVBAR — sombra ao rolar
  ───────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ─────────────────────────────────────────
     2. MENU MOBILE — Hamburguer toggle
  ───────────────────────────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', isOpen);
    menuToggle.classList.toggle('active', !isOpen);
    menuToggle.setAttribute('aria-label',
      isOpen ? 'Open navigation menu' : 'Close navigation menu');
  });

  // Fecha ao clicar num link do menu mobile
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuToggle.classList.remove('active');
    });
  });


  /* ─────────────────────────────────────────
     3. ACTIVE LINK — destaque no scroll
  ───────────────────────────────────────── */
  const sections     = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      desktopLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('text-brand-black', isActive);
        link.classList.toggle('font-semibold',    isActive);
        link.classList.toggle('text-brand-gray',  !isActive);
      });
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ─────────────────────────────────────────
     4. SCROLL ANIMATIONS — fade-in ao entrar na tela
        (.service-card · .gallery-item · .team-card · .review-card)
  ───────────────────────────────────────── */
  const animatedItems = document.querySelectorAll(
    '.service-card, .gallery-item, .team-card, .review-card'
  );

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), i * 85);
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  animatedItems.forEach(el => fadeObserver.observe(el));


  /* ─────────────────────────────────────────
     5. BOOKING MODAL — abrir · fechar · validar · sucesso
  ───────────────────────────────────────── */
  const overlay      = document.getElementById('booking-overlay');
  const modal        = document.getElementById('booking-modal');
  const closeBtn     = document.getElementById('close-modal');
  const bookingForm  = document.getElementById('booking-form');
  const successMsg   = document.getElementById('booking-success');

  // Data mínima = hoje
  const dateInput = document.getElementById('b-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  function openModal() {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Todos os botões "Book Now / Book Appointment"
  document.querySelectorAll('a[href="#booking"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn)  closeBtn.addEventListener('click', closeModal);
  if (overlay)   overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeModal();
  });

  // Submissão do formulário
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();

      const fields = ['b-name', 'b-phone', 'b-service', 'b-date', 'b-time'];
      let valid = true;

      fields.forEach(id => {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
          valid = false;
          el.classList.add('border-red-400', 'focus:border-red-400');
          el.addEventListener('input', () =>
            el.classList.remove('border-red-400', 'focus:border-red-400'),
          { once: true });
        }
      });

      if (!valid) return;

      // Esconde campos e mostra sucesso
      [...bookingForm.children].forEach(el => {
        if (el.id !== 'booking-success') el.style.display = 'none';
      });
      successMsg.style.display = 'block';

      // Fecha e reseta após 4s
      setTimeout(() => {
        closeModal();
        setTimeout(() => {
          successMsg.style.display = 'none';
          [...bookingForm.children].forEach(el => el.style.display = '');
          bookingForm.reset();
        }, 350);
      }, 4000);
    });
  }


  /* ─────────────────────────────────────────
     6. SMOOTH SCROLL — para browsers sem suporte nativo
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]:not([href="#booking"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 64;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────
     7. OPEN/CLOSE STATUS — Calcula horário real
  ───────────────────────────────────────── */
  const statusEl = document.getElementById('open-status');
  if (statusEl) {
    const now  = new Date();
    const day  = now.getDay();   // 0=Sun … 6=Sat
    const hour = now.getHours();

    const schedule = {
      0: { open: 10, close: 16, label: 'Sunday'    },
      1: { open:  9, close: 19, label: 'Monday'    },
      2: { open:  9, close: 19, label: 'Tuesday'   },
      3: { open:  9, close: 19, label: 'Wednesday' },
      4: { open:  9, close: 19, label: 'Thursday'  },
      5: { open:  9, close: 19, label: 'Friday'    },
      6: { open:  8, close: 18, label: 'Saturday'  },
    };

    const today  = schedule[day];
    const isOpen = hour >= today.open && hour < today.close;
    const closeH = today.close > 12 ? `${today.close - 12}:00 PM` : `${today.close}:00 AM`;

    statusEl.innerHTML = isOpen
      ? `<span class="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
         <span class="text-green-600 text-xs font-semibold">Open Now · Closes at ${closeH}</span>`
      : `<span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
         <span class="text-red-500 text-xs font-semibold">Closed Now · Opens ${today.label} at ${today.open}:00 AM</span>`;
  }


  /* ─────────────────────────────────────────
     8. BEFORE & AFTER COMPARISON SLIDERS
  ───────────────────────────────────────── */
  const baContainers = document.querySelectorAll('[data-ba-slider]');
  baContainers.forEach(container => {
    const range = container.querySelector('.ba-range');
    const hint  = container.querySelector('.ba-hint');
    if (!range) return;

    const updateSlider = (val) => {
      container.style.setProperty('--pos', `${val}%`);
      if (hint) {
        hint.style.transition = 'opacity 0.25s ease';
        hint.style.opacity = '0';
      }
    };

    range.addEventListener('input', (e) => updateSlider(e.target.value));
    range.addEventListener('change', (e) => updateSlider(e.target.value));
  });


  /* ─────────────────────────────────────────
     9. ANIMATED STATS COUNTER
  ───────────────────────────────────────── */
  const statSection = document.querySelector('.hero-stats');
  if (statSection) {
    let animated = false;
    const animateCount = () => {
      if (animated) return;
      animated = true;

      // Integer counters
      document.querySelectorAll('[data-counter]').forEach(el => {
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const duration = 1600;
        const start = performance.now();
        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const current = Math.floor(progress * target);
          el.textContent = current.toLocaleString('en-US');
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toLocaleString('en-US');
        };
        requestAnimationFrame(update);
      });

      // Float counters (e.g. 4.9)
      document.querySelectorAll('[data-counter-float]').forEach(el => {
        const target = parseFloat(el.getAttribute('data-counter-float'));
        const duration = 1400;
        const start = performance.now();
        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const current = (progress * target).toFixed(1);
          el.textContent = current;
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toFixed(1);
        };
        requestAnimationFrame(update);
      });
    };

    const statObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCount();
        statObserver.disconnect();
      }
    }, { threshold: 0.3 });
    statObserver.observe(statSection);
  }


  /* ─────────────────────────────────────────
     10. FLOATING "BOOK NOW" BUTTON
  ───────────────────────────────────────── */
  const floatingBtn = document.getElementById('floating-book-btn');
  if (floatingBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        floatingBtn.classList.add('visible');
      } else {
        floatingBtn.classList.remove('visible');
      }
    }, { passive: true });
  }


  /* ─────────────────────────────────────────
     11. FAQ ACCORDION
  ───────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active', !isActive);
    });
  });


  /* ─────────────────────────────────────────
     12. GALLERY LIGHTBOX
  ───────────────────────────────────────── */
  const lightbox = document.getElementById('gallery-lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');
  const lbPrev   = document.getElementById('lightbox-prev');
  const lbNext   = document.getElementById('lightbox-next');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  let currentIdx = 0;

  const showImage = (index) => {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIdx = index;

    const item = galleryItems[currentIdx];
    const img  = item.querySelector('img');
    const cap  = item.querySelector('.gallery-overlay span');

    if (img && lbImg) {
      lbImg.src = img.src;
      lbImg.alt = img.alt || 'Gallery Preview';
    }
    if (lbCap) {
      lbCap.textContent = cap ? cap.textContent : '';
    }
  };

  const openLightbox = (index) => {
    if (!lightbox) return;
    showImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    if (!document.getElementById('booking-overlay')?.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  };

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIdx - 1); });
  if (lbNext)  lbNext.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIdx + 1); });
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIdx - 1);
    if (e.key === 'ArrowRight') showImage(currentIdx + 1);
  });


  /* ─────────────────────────────────────────
     13. SOCIAL PROOF BANNER (Simulação Natural)
  ───────────────────────────────────────── */
  const viewersEl = document.getElementById('social-viewers');
  const minutesEl = document.getElementById('social-minutes');
  if (viewersEl && minutesEl) {
    setInterval(() => {
      const viewers = Math.floor(Math.random() * 4) + 3;
      viewersEl.textContent = viewers;
    }, 18000);

    setInterval(() => {
      const mins = Math.floor(Math.random() * 9) + 7;
      minutesEl.textContent = `${mins}m`;
    }, 32000);
  }

});
