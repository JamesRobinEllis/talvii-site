// Light/dark switch for every page. Until someone uses the button, the site follows the device's
// setting; after that it remembers their choice (in this browser only). Loaded in <head> so the
// right colours apply before the page appears.
(function () {
  var KEY = 'talvii-theme';
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  function current() {
    return root.getAttribute('data-theme') || (system.matches ? 'dark' : 'light');
  }
  // The browser's address bar colour follows the page.
  function themeColor() {
    var bg = current() === 'dark' ? '#0E1013' : '#EAE8F0';
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) { metas[i].setAttribute('content', bg); metas[i].removeAttribute('media'); }
  }
  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
  var button;
  function label() {
    if (!button) return;
    var dark = current() === 'dark';
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('title', dark ? 'Light mode' : 'Dark mode');
    button.innerHTML = dark ? SUN : MOON;
  }
  function changed() {
    themeColor();
    label();
    document.dispatchEvent(new CustomEvent('talvii-theme', { detail: current() }));
  }
  function addButton() {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      changed();
    });
    document.body.appendChild(button);
    label();
  }
  // If they haven't chosen, keep following the device when its setting changes.
  if (system.addEventListener) system.addEventListener('change', function () { if (!root.getAttribute('data-theme')) changed(); });
  window.talviiTheme = { current: current };
  themeColor();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
})();
