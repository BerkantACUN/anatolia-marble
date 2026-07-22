/* Anatolia Marble — main.js
   Header, mobile nav, language menu, hero slider, scroll reveals,
   product filter, product focus mode, contact form. */
(function () {
  'use strict';

  var CONTACT_EMAIL = 'info@anatoliamarble.com';
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function t(key) {
    return (window.AMI18N && window.AMI18N.t(key)) || '';
  }

  /* ---------- Header: shadow on scroll ---------- */

  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile navigation ---------- */

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    var links = document.querySelectorAll('.main-nav a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /* ---------- Language menu ---------- */

  function initLangMenu() {
    var wrap = document.querySelector('.lang-switch');
    if (!wrap) return;

    var btn = wrap.querySelector('.lang-switch-btn');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', function () {
      wrap.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });

    var options = wrap.querySelectorAll('.lang-menu button');
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', function () {
        window.AMI18N.apply(this.getAttribute('data-lang'));
        wrap.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /* ---------- Hero slider (autoplay only — no manual controls) ---------- */

  function initHeroSlider() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var slides = hero.querySelectorAll('.hero-slide');
    if (slides.length < 2 || REDUCED_MOTION) return;

    var current = 0;
    var INTERVAL = 6500;

    setInterval(function () {
      current = (current + 1) % slides.length;
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('is-active', i === current);
      }
    }, INTERVAL);
  }

  /* ---------- Reveal on scroll ---------- */

  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-visible');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  /* ---------- Product filter (products page) ---------- */

  function initProductFilter() {
    var bar = document.querySelector('.filter-bar');
    if (!bar) return;

    var buttons = bar.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.product-card');

    function applyFilter(cat) {
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('is-active', buttons[i].getAttribute('data-filter') === cat);
      }
      for (var j = 0; j < cards.length; j++) {
        var match = cat === 'all' || cards[j].getAttribute('data-cat') === cat;
        if (match) {
          cards[j].classList.remove('is-hidden');
          cards[j].classList.add('is-entering');
          /* force reflow so the entering transition replays */
          void cards[j].offsetWidth;
          cards[j].classList.remove('is-entering');
        } else {
          cards[j].classList.add('is-hidden');
        }
      }
    }

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        applyFilter(this.getAttribute('data-filter'));
      });
    }

    /* Pre-select category from ?cat= query (links from home page cards) */
    var params = new URLSearchParams(window.location.search);
    var preset = params.get('cat');
    var valid = { marble: 1, travertine: 1, limestone: 1 };
    applyFilter(preset && valid[preset] ? preset : 'all');
  }

  /* ---------- Product focus mode (products page) ---------- */

  function initProductFocus() {
    var overlay = document.querySelector('.focus-overlay');
    if (!overlay) return;

    var card = overlay.querySelector('.focus-card');
    var imgEl = overlay.querySelector('.focus-media img');
    var chipEl = overlay.querySelector('.focus-chip');
    var nameEl = overlay.querySelector('.focus-name');
    var descEl = overlay.querySelector('.focus-desc');
    var closeBtn = overlay.querySelector('.focus-close');
    var canHover = window.matchMedia('(hover: hover)').matches;
    var suppressUntil = 0;

    function openFrom(productCard) {
      if (Date.now() < suppressUntil) return;
      var img = productCard.querySelector('.product-media img');
      imgEl.src = img.getAttribute('src');
      imgEl.alt = img.alt;
      chipEl.textContent = productCard.querySelector('.product-chip').textContent;
      nameEl.textContent = productCard.querySelector('.product-info h3').textContent;
      var key = productCard.getAttribute('data-desc');
      descEl.textContent = (key && t(key)) || productCard.querySelector('.product-info p').textContent;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
    }

    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      /* the pointer may land back on a card — don't instantly reopen */
      suppressUntil = Date.now() + 450;
    }

    var cards = document.querySelectorAll('.product-card');
    for (var i = 0; i < cards.length; i++) {
      (function (pc) {
        pc.addEventListener('click', function () { openFrom(pc); });
        if (canHover) {
          pc.addEventListener('mouseenter', function () { openFrom(pc); });
        }
      })(cards[i]);
    }

    if (canHover) {
      card.addEventListener('mouseleave', close);
    }
    overlay.addEventListener('click', function (e) {
      if (!card.contains(e.target)) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------- Contact form → e-mail ---------- */

  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    var error = form.querySelector('.form-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = (form.elements.name.value || '').trim();
      var email = (form.elements.email.value || '').trim();
      var phone = (form.elements.phone.value || '').trim();
      var message = (form.elements.message.value || '').trim();

      if (!name || !message) {
        if (error) error.classList.add('is-visible');
        return;
      }
      if (error) error.classList.remove('is-visible');

      var lines = [message, ''];
      lines.push('— ' + name);
      if (email) lines.push(email);
      if (phone) lines.push(phone);

      var subject = 'Website contact — ' + name;
      window.location.href = 'mailto:' + CONTACT_EMAIL
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }

  /* ---------- Footer year ---------- */

  function initYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Boot ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileNav();
    initLangMenu();
    initHeroSlider();
    initReveals();
    initProductFilter();
    initProductFocus();
    initContactForm();
    initYear();
  });
})();
