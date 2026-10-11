// Home page behaviour: News filter + collapse, mobile "Details" toggles,
// Focus hover state, and the mobile section menu.
(function () {
  'use strict';

  var small = window.matchMedia('(max-width: 560px)');
  function onChange(mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn);
  }

  // ---------- News: category pills + "Show all" ----------
  var list = document.querySelector('[data-news]');
  if (list) {
    var rows = Array.prototype.slice.call(list.querySelectorAll('.pf-nrow'));
    var toggle = document.querySelector('[data-news-toggle]');
    var label = toggle ? toggle.querySelector('[data-label]') : null;
    var pills = Array.prototype.slice.call(document.querySelectorAll('.pf-pill-f'));
    var filter = 'all';
    var expanded = false;

    var render = function () {
      var visible = rows.filter(function (r) { return filter === 'all' || r.getAttribute('data-cat') === filter; });
      var limit = small.matches ? 3 : 4;              // rows shown in full before the faded one
      var collapse = !expanded && visible.length > limit + 1;
      rows.forEach(function (r) {
        r.classList.remove('is-hidden', 'is-fade', 'is-end');
        if (visible.indexOf(r) < 0) r.classList.add('is-hidden');
      });
      if (collapse) {
        visible.forEach(function (r, i) {
          if (i === limit) r.classList.add('is-fade');
          else if (i > limit) r.classList.add('is-hidden');
        });
      }
      var shown = visible.filter(function (r) { return !r.classList.contains('is-hidden'); });
      if (shown.length) shown[shown.length - 1].classList.add('is-end');
      if (toggle) {
        toggle.parentElement.hidden = visible.length <= limit + 1;
        toggle.setAttribute('aria-expanded', String(expanded));
        if (label) label.textContent = expanded ? 'Show less' : 'Show all ' + visible.length;
      }
    };

    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        filter = p.getAttribute('data-filter');
        pills.forEach(function (q) {
          var on = q === p;
          q.classList.toggle('is-active', on);
          q.setAttribute('aria-pressed', String(on));
        });
        render();
      });
    });
    if (toggle) {
      toggle.addEventListener('click', function () {
        expanded = !expanded;
        render();
        if (!expanded) {
          var sec = list.closest('section');
          if (sec && sec.getBoundingClientRect().top < 0) sec.scrollIntoView({ block: 'start' });
        }
      });
    }
    onChange(small, render);
    render();
  }

  // ---------- "Details" toggles (phone) ----------
  Array.prototype.forEach.call(document.querySelectorAll('.pf-details'), function (btn) {
    btn.addEventListener('click', function () {
      var host = btn.closest('.pf-pub, .pf-xrow');
      if (!host) return;
      var open = !host.classList.contains('is-open');
      host.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (btn.firstChild && btn.firstChild.nodeType === 3) btn.firstChild.textContent = open ? 'Hide' : 'Details';
    });
  });

  // ---------- Focus: hovering a panel highlights its half of the loop ----------
  var focus = document.querySelector('[data-focus]');
  if (focus) {
    Array.prototype.forEach.call(focus.querySelectorAll('[data-side]'), function (panel) {
      panel.addEventListener('mouseenter', function () { focus.setAttribute('data-active', panel.getAttribute('data-side')); });
      panel.addEventListener('mouseleave', function () { focus.removeAttribute('data-active'); });
    });
  }

  // ---------- Mobile section menu ----------
  var fab = document.querySelector('[data-fab]');
  if (fab) {
    var btn = fab.querySelector('.pf-fab-btn');
    var panel = fab.querySelector('.pf-fab-panel');
    var hero = document.getElementById('hero');
    var setOpen = function (open) {
      fab.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    };
    btn.addEventListener('click', function () { setOpen(!fab.classList.contains('is-open')); });
    Array.prototype.forEach.call(panel.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    var onScroll = function () {
      var past = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 300;
      fab.classList.toggle('is-visible', past);
      if (!past) setOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
