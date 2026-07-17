/* Anatolia Marble — i18n engine
   Dictionaries live in lang-*.js files (window.AM_TRANSLATIONS.<code>).
   Default language: English. Choice persists in localStorage. */
(function () {
  'use strict';

  var STORAGE_KEY = 'am-lang';
  var SUPPORTED = ['en', 'tr', 'es', 'fr'];

  function dicts() {
    return window.AM_TRANSLATIONS || {};
  }

  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (err) { /* storage unavailable — fall back to default */ }
    return 'en';
  }

  function translate(key, lang) {
    var d = dicts();
    if (d[lang] && Object.prototype.hasOwnProperty.call(d[lang], key)) return d[lang][key];
    if (d.en && Object.prototype.hasOwnProperty.call(d.en, key)) return d.en[key];
    return '';
  }

  function applyAttr(selector, attr, lang) {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n-' + attr);
      var val = translate(key, lang);
      if (val) nodes[i].setAttribute(attr, val);
    }
  }

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = 'en';

    document.documentElement.setAttribute('lang', lang);

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var val = translate(nodes[i].getAttribute('data-i18n'), lang);
      if (val) nodes[i].innerHTML = val;
    }

    applyAttr('[data-i18n-placeholder]', 'placeholder', lang);
    applyAttr('[data-i18n-content]', 'content', lang);
    applyAttr('[data-i18n-aria-label]', 'aria-label', lang);
    applyAttr('[data-i18n-alt]', 'alt', lang);

    var titleKey = document.body.getAttribute('data-title-key');
    if (titleKey) {
      var title = translate(titleKey, lang);
      if (title) document.title = title;
    }

    var current = document.querySelector('.lang-current');
    if (current) current.textContent = lang.toUpperCase();

    var options = document.querySelectorAll('.lang-menu button');
    for (var j = 0; j < options.length; j++) {
      options[j].classList.toggle('is-active', options[j].getAttribute('data-lang') === lang);
    }

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (err) { /* ignore */ }

    document.dispatchEvent(new CustomEvent('am:lang', { detail: { lang: lang } }));
  }

  window.AMI18N = {
    apply: apply,
    get: getLang,
    t: function (key) { return translate(key, getLang()); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    apply(getLang());
  });
})();
