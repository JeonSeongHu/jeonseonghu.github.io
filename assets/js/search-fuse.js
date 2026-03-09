---
layout: null
---
// Command-palette search powered by Fuse.js
(function () {
    'use strict';

    // ── State ──────────────────────────────────────
    let searchData = [];
    let fuse = null;
    let activeIndex = -1;
    let debounceTimer = null;

    // ── DOM refs (resolved on DOMContentLoaded) ────
    let overlay, dialog, input, resultsWrap, resultsList, trigger, backdrop;

    // ── Fuse options (Korean-friendly) ─────────────
    const fuseOptions = {
        keys: [
            { name: 'title', weight: 0.8 },
            { name: 'content', weight: 0.5 },
            { name: 'excerpt', weight: 0.6 },
            { name: 'tags', weight: 0.3 },
            { name: 'categories', weight: 0.3 }
        ],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 2,
        includeScore: true,
        includeMatches: true,
        ignoreLocation: true,
        findAllMatches: true
    };

    // ── Data loading ───────────────────────────────
    async function loadSearchData() {
        try {
            var response = await fetch('/search.json');
            searchData = await response.json();
            fuse = new Fuse(searchData, fuseOptions);
        } catch (err) {
            console.error('Search index load failed:', err);
        }
    }

    // ── Open / Close ───────────────────────────────
    function openSearch() {
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('search-open');
        // Slight delay so the CSS transition plays before focus
        setTimeout(function () { input.focus(); }, 50);
        showPrompt();
    }

    function closeSearch() {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('search-open');
        input.value = '';
        activeIndex = -1;
        resultsList.innerHTML = '';
    }

    function isOpen() {
        return overlay.classList.contains('open');
    }

    // ── Prompt / Empty states ──────────────────────
    function showPrompt() {
        resultsList.innerHTML =
            '<li class="search-prompt">검색어를 2글자 이상 입력하세요.</li>';
    }

    function showEmpty(term) {
        resultsList.innerHTML =
            '<li class="search-empty">' +
                '<div class="search-empty-title">검색 결과가 없습니다</div>' +
                '<div class="search-empty-hint">다른 키워드로 검색해보세요.</div>' +
            '</li>';
    }

    // ── Highlight helper ───────────────────────────
    function highlight(text, term) {
        if (!term || term.length < 2 || !text) return escapeHtml(text || '');
        var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp('(' + escaped + ')', 'gi');
        // Escape HTML first, then wrap matches
        return escapeHtml(text).replace(regex, '<span class="search-highlight">$1</span>');
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ── Render results ─────────────────────────────
    function renderResults(results, term) {
        if (results.length === 0) {
            showEmpty(term);
            activeIndex = -1;
            return;
        }

        var html = results.slice(0, 20).map(function (result, idx) {
            var item = result.item;
            var title = highlight(item.title, term);
            var rawExcerpt = item.excerpt || (item.content ? item.content.substring(0, 160) : '');
            var excerpt = highlight(rawExcerpt, term);
            var cats = (item.categories && item.categories.length) ? escapeHtml(item.categories.join(', ')) : '';
            var date = item.date || '';

            var meta = '';
            if (cats) meta += '<span>' + cats + '</span>';
            if (cats && date) meta += '<span class="search-result-meta-sep">&middot;</span>';
            if (date) meta += '<span>' + escapeHtml(date) + '</span>';

            return (
                '<li class="search-result-item">' +
                    '<a href="' + escapeHtml(item.url) + '" class="search-result-link" data-index="' + idx + '">' +
                        '<span class="search-result-title">' + title + '</span>' +
                        (excerpt ? '<span class="search-result-excerpt">' + excerpt + '</span>' : '') +
                        (meta ? '<div class="search-result-meta">' + meta + '</div>' : '') +
                    '</a>' +
                '</li>'
            );
        }).join('');

        resultsList.innerHTML = html;
        activeIndex = -1;
    }

    // ── Keyboard navigation ────────────────────────
    function getResultLinks() {
        return resultsList.querySelectorAll('.search-result-link');
    }

    function setActive(index) {
        var links = getResultLinks();
        if (links.length === 0) return;

        // Remove previous
        links.forEach(function (el) { el.classList.remove('active'); });

        // Clamp
        if (index < 0) index = links.length - 1;
        if (index >= links.length) index = 0;

        activeIndex = index;
        links[activeIndex].classList.add('active');
        links[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    function navigateToActive() {
        var links = getResultLinks();
        if (activeIndex >= 0 && activeIndex < links.length) {
            window.location.href = links[activeIndex].getAttribute('href');
        }
    }

    // ── Search execution (debounced) ───────────────
    function onInput() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            var term = input.value.trim();
            if (term.length < 2) {
                showPrompt();
                activeIndex = -1;
                return;
            }
            if (!fuse) return;
            var results = fuse.search(term);
            renderResults(results, term);
        }, 150);
    }

    // ── Event wiring ───────────────────────────────
    function init() {
        overlay    = document.getElementById('searchOverlay');
        dialog     = overlay.querySelector('.search-dialog');
        input      = document.getElementById('searchInput');
        resultsWrap = document.getElementById('searchResultsWrap');
        resultsList = document.getElementById('searchResults');
        trigger    = document.getElementById('searchTrigger');
        backdrop   = document.getElementById('searchBackdrop');

        if (!overlay || !input) return;

        // Load search index
        loadSearchData();

        // Trigger button
        trigger.addEventListener('click', function () {
            if (isOpen()) { closeSearch(); } else { openSearch(); }
        });

        // Backdrop click
        backdrop.addEventListener('click', closeSearch);

        // Prevent dialog click from closing
        dialog.addEventListener('click', function (e) { e.stopPropagation(); });

        // Live search
        input.addEventListener('input', onInput);

        // Keyboard shortcuts
        document.addEventListener('keydown', function (e) {
            // Ctrl+K / Cmd+K to open
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen()) { closeSearch(); } else { openSearch(); }
                return;
            }

            if (!isOpen()) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                closeSearch();
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive(activeIndex + 1);
                return;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive(activeIndex - 1);
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex >= 0) {
                    navigateToActive();
                } else {
                    // If no item selected, select first if available
                    var links = getResultLinks();
                    if (links.length > 0) {
                        setActive(0);
                        navigateToActive();
                    }
                }
                return;
            }
        });
    }

    // ── Bootstrap ──────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
