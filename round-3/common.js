/* Shared behavior for all round 3 pages: menu, header state, scroll helpers, tilt.
   Every effect is skipped when the visitor has reduced motion turned on. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.LC = { reduce: reduce };

  // menu
  var h = document.getElementById('top');
  if (h) {
    var b = h.querySelector('.menu-btn');
    if (b) {
      b.addEventListener('click', function () {
        var o = h.classList.toggle('open');
        b.setAttribute('aria-expanded', o);
        b.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
      });
      h.querySelectorAll('.mobile-nav a').forEach(function (a) {
        a.addEventListener('click', function () { h.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && h.classList.contains('open')) { h.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); b.focus(); }
      });
    }
  }

  // scroll-linked work runs once per frame
  var jobs = [];
  LC.onScroll = function (fn) { jobs.push(fn); fn(); };
  var ticking = false;
  function run() { ticking = false; for (var i = 0; i < jobs.length; i++) jobs[i](); }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  window.addEventListener('resize', function () { requestAnimationFrame(run); });
  LC.onScroll(function () { if (h) h.classList.toggle('scrolled', window.scrollY > 10); });

  // 0 when the element's top reaches the bottom of the screen, 1 when its bottom leaves the top
  LC.progress = function (el) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    return Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
  };
  // 0 to 1 while a tall pinned section scrolls past its sticky child
  LC.pinProgress = function (el) {
    var r = el.getBoundingClientRect(), span = r.height - window.innerHeight;
    return span <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / span));
  };

  // pointer tilt for [data-tilt] (desktop pointers only)
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 8;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (x * max) + 'deg) rotateX(' + (-y * max) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  // simple reveal: elements with .rv fade up once; content is visible without JS or with reduced motion
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-rv');
    var items = document.querySelectorAll('.rv');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { if (!document.querySelector('.rv.in')) items.forEach(function (el) { el.classList.add('in'); }); }, 1500);
  }
})();
