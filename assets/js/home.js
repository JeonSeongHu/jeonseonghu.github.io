// Home page behaviour: News filter + year groups, mobile "Details" toggles,
// Focus hover state, and the mobile section menu.
(function () {
  'use strict';

  function slice(nodes) { return Array.prototype.slice.call(nodes); }

  // ---------- News: category pills + year groups + "Show all" ----------
  // Each year opens and closes on its own. With "All", only the newest year starts
  // open; picking a category opens every year that has a match.
  var list = document.querySelector('[data-news]');
  if (list) {
    var years = slice(list.querySelectorAll('.pf-nyear'));
    var toggle = document.querySelector('[data-news-toggle]');
    var label = toggle ? toggle.querySelector('[data-label]') : null;
    var pills = slice(document.querySelectorAll('.pf-pill-f'));
    var filter = 'all';
    var open = [];

    var reset = function () {
      years.forEach(function (y, i) { open[i] = filter !== 'all' || i === 0; });
    };

    var render = function () {
      var shown = [];
      years.forEach(function (y, i) {
        var rows = slice(y.querySelectorAll('.pf-nrow'));
        var vis = rows.filter(function (r) { return filter === 'all' || r.getAttribute('data-cat') === filter; });
        rows.forEach(function (r) {
          r.classList.toggle('is-hidden', vis.indexOf(r) < 0);
          r.classList.remove('is-end');
        });
        if (vis.length) {
          vis[vis.length - 1].classList.add('is-end');
          shown.push(i);
        }
        y.hidden = !vis.length;
        var count = y.querySelector('[data-count]');
        if (count) count.textContent = vis.length + (vis.length === 1 ? ' item' : ' items');
        y.classList.toggle('is-open', !!open[i]);
        y.querySelector('.pf-nyear-head').setAttribute('aria-expanded', String(!!open[i]));
      });
      if (toggle) {
        var allOpen = shown.every(function (i) { return open[i]; });
        toggle.parentElement.hidden = shown.length < 2;
        toggle.setAttribute('aria-expanded', String(allOpen));
        if (label) label.textContent = allOpen ? 'Show less' : 'Show all';
      }
    };

    years.forEach(function (y, i) {
      y.querySelector('.pf-nyear-head').addEventListener('click', function () {
        open[i] = !open[i];
        render();
      });
    });
    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        filter = p.getAttribute('data-filter');
        pills.forEach(function (q) {
          var on = q === p;
          q.classList.toggle('is-active', on);
          q.setAttribute('aria-pressed', String(on));
        });
        reset();
        render();
      });
    });
    if (toggle) {
      toggle.addEventListener('click', function () {
        var collapsing = toggle.getAttribute('aria-expanded') === 'true';
        if (collapsing) {
          // back to only the first year that has a match
          var first = true;
          years.forEach(function (y, i) {
            open[i] = !y.hidden && first;
            if (!y.hidden) first = false;
          });
        } else {
          years.forEach(function (y, i) { open[i] = true; });
        }
        render();
        if (collapsing) {
          var sec = list.closest('section');
          if (sec && sec.getBoundingClientRect().top < 0) sec.scrollIntoView({ block: 'start' });
        }
      });
    }
    reset();
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

  // ---------- Focus: hovering a card highlights its brain region and line ----------
  var focus = document.querySelector('[data-focus]');
  if (focus) {
    Array.prototype.forEach.call(focus.querySelectorAll('[data-side]'), function (panel) {
      panel.addEventListener('mouseenter', function () { focus.setAttribute('data-active', panel.getAttribute('data-side')); });
      panel.addEventListener('mouseleave', function () { focus.removeAttribute('data-active'); });
    });
  }

  // ---------- Floating section menu ----------
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
