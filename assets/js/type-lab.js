(function () {
    'use strict';

    var launch = document.querySelector('[data-type-lab-launch]');
    var panel = document.querySelector('[data-type-lab]');
    if (!launch || !panel) return;

    var ENABLED_KEY = 'seonghu-type-lab-enabled';
    var CONFIG_KEY = 'seonghu-type-lab-config-v3';
    var PREVIOUS_CONFIG_KEY = 'seonghu-type-lab-config-v2';
    var LEGACY_CONFIG_KEY = 'seonghu-type-lab-config-v1';
    var FONT_DB_NAME = 'seonghu-type-lab-fonts';
    var FONT_STORE_NAME = 'font-files';
    var body = document.body;
    var params = new URLSearchParams(window.location.search);
    var queryMode = params.get('typelab');
    var firstOpen = queryMode === '1';
    var fontsRequested = false;
    var comparing = false;
    var localFontFamilies = [];
    var localFontFaceCount = 0;
    var localFontTarget = 'both';

    var fontStacks = {
        wanted: '"Wanted Sans", "Wanted Sans Variable", Paperlogy, "Pretendard Variable", Pretendard, system-ui, sans-serif',
        pretendard: '"Pretendard Variable", "Pretendard", "Apple SD Gothic Neo", Inter, system-ui, sans-serif',
        instrument: '"Instrument Serif", Georgia, "Times New Roman", serif',
        space: '"Space Grotesk", "Pretendard Variable", system-ui, sans-serif',
        newsreader: 'Newsreader, Georgia, "Times New Roman", serif',
        paperlogy: 'Paperlogy, "Pretendard Variable", Pretendard, system-ui, sans-serif',
        georgia: 'Georgia, "Times New Roman", serif',
        inter: 'Inter, "Pretendard Variable", Pretendard, system-ui, sans-serif',
        plex: '"IBM Plex Sans", "Pretendard Variable", Pretendard, system-ui, sans-serif',
        manrope: 'Manrope, "Pretendard Variable", Pretendard, system-ui, sans-serif',
        system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
    };

    var propertyMap = {
        eyebrowSize: ['--tl-eyebrow-size', 'px'],
        eyebrowWeight: ['--tl-eyebrow-weight', ''],
        eyebrowLine: ['--tl-eyebrow-line', ''],
        eyebrowTracking: ['--tl-eyebrow-tracking', 'em'],
        eyebrowBottom: ['--tl-eyebrow-bottom', 'px'],
        titleSize: ['--tl-title-size', 'px'],
        titleWeight: ['--tl-title-weight', ''],
        titleLine: ['--tl-title-line', ''],
        titleTracking: ['--tl-title-tracking', 'em'],
        titleBottom: ['--tl-title-bottom', 'px'],
        deckSize: ['--tl-deck-size', 'px'],
        deckWeight: ['--tl-deck-weight', ''],
        deckLine: ['--tl-deck-line', ''],
        deckTracking: ['--tl-deck-tracking', 'em'],
        deckMeasure: ['--tl-deck-measure', 'px'],
        deckBottom: ['--tl-deck-bottom', 'px'],
        sectionTitleSize: ['--tl-section-title-size', 'px'],
        sectionTitleWeight: ['--tl-section-title-weight', ''],
        sectionTitleLine: ['--tl-section-title-line', ''],
        sectionTitleTracking: ['--tl-section-title-tracking', 'em'],
        sectionHeadGap: ['--tl-section-head-gap', 'px'],
        copyLine: ['--tl-copy-line', ''],
        copyTracking: ['--tl-copy-tracking', 'em'],
        pubBodyGap: ['--tl-pub-body-gap', 'px'],
        expDetailGap: ['--tl-exp-detail-gap', 'px'],
        heroTop: ['--tl-hero-top', 'px'],
        pageHeroTop: ['--tl-page-hero-top', 'px'],
        heroBottom: ['--tl-hero-bottom', 'px'],
        pageHeroBottom: ['--tl-page-hero-bottom', 'px'],
        heroColumnGap: ['--tl-hero-column-gap', 'px'],
        sectionPadding: ['--tl-section-padding', 'px'],
        flushSectionTop: ['--tl-flush-section-top', 'px'],
        newsRowPadding: ['--tl-news-row-padding', 'px'],
        pubRowPadding: ['--tl-pub-row-padding', 'px'],
        focusRowPadding: ['--tl-focus-row-padding', 'px'],
        expRowPadding: ['--tl-exp-row-padding', 'px']
    };

    var defaults = {
        preset: 'working',
        display: 'wanted',
        body: 'wanted',
        customDisplay: '',
        customBody: '',
        eyebrowSize: 13,
        eyebrowWeight: 500,
        eyebrowLine: 1.4,
        eyebrowTracking: 0,
        eyebrowBottom: 10,
        titleSize: 40,
        titleWeight: 600,
        titleLine: 1.1,
        titleTracking: -0.025,
        titleBottom: 16,
        deckSize: 17,
        deckWeight: 400,
        deckLine: 1.6,
        deckTracking: -0.01,
        deckMeasure: 620,
        deckBottom: 24,
        sectionTitleSize: 22,
        sectionTitleWeight: 600,
        sectionTitleLine: 1.25,
        sectionTitleTracking: -0.02,
        sectionHeadGap: 20,
        copyLine: 1.6,
        copyTracking: -0.005,
        pubBodyGap: 4,
        expDetailGap: 6,
        heroTop: 56,
        pageHeroTop: 56,
        heroBottom: 44,
        pageHeroBottom: 36,
        heroColumnGap: 48,
        sectionPadding: 40,
        flushSectionTop: 25,
        newsRowPadding: 5,
        pubRowPadding: 20,
        focusRowPadding: 16,
        expRowPadding: 16,
        advancedCss: ''
    };

    var presets = {
        working: clone(defaults),
        editorial: merge(defaults, {
            preset: 'editorial',
            display: 'instrument',
            body: 'inter',
            titleWeight: 400,
            sectionTitleWeight: 400,
            deckSize: 16.5,
            deckLine: 1.8,
            deckTracking: 0,
            deckMeasure: 680
        }),
        geometric: merge(defaults, {
            preset: 'geometric',
            display: 'space',
            body: 'plex',
            titleWeight: 600,
            sectionTitleWeight: 600,
            deckSize: 16,
            deckLine: 1.7,
            deckTracking: -0.005,
            deckMeasure: 660
        }),
        humanist: merge(defaults, {
            preset: 'humanist',
            display: 'newsreader',
            body: 'manrope',
            titleWeight: 500,
            sectionTitleWeight: 500,
            deckSize: 16.5,
            deckLine: 1.85,
            deckTracking: 0,
            deckMeasure: 700
        }),
        korean: merge(defaults, {
            preset: 'korean',
            display: 'paperlogy',
            body: 'pretendard',
            titleWeight: 700,
            sectionTitleWeight: 700,
            deckSize: 16,
            deckLine: 1.8,
            deckTracking: -0.005,
            deckMeasure: 650
        }),
        native: merge(defaults, {
            preset: 'native',
            display: 'georgia',
            body: 'system',
            titleWeight: 700,
            sectionTitleWeight: 700,
            deckSize: 16,
            deckLine: 1.75,
            deckTracking: 0,
            deckMeasure: 680
        })
    };

    var config = clone(defaults);

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function merge(base, overrides) {
        return Object.assign({}, clone(base), overrides || {});
    }

    function storageGet(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function storageSet(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            // The preview still works when storage is unavailable.
        }
    }

    function storageRemove(key) {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            // Nothing else to clean up.
        }
    }

    function migrateLegacy(saved) {
        if (!saved) return null;
        return merge(defaults, {
            preset: saved.preset || 'custom',
            display: saved.display || defaults.display,
            body: saved.body || defaults.body,
            titleWeight: Number(saved.displayWeight) || defaults.titleWeight,
            sectionTitleWeight: Number(saved.displayWeight) || defaults.sectionTitleWeight,
            deckWeight: Number(saved.bodyWeight) || defaults.deckWeight,
            deckSize: Number(saved.size) || defaults.deckSize,
            deckLine: Number(saved.line) || defaults.deckLine,
            deckTracking: Number(saved.tracking),
            deckMeasure: Number(saved.measure) || defaults.deckMeasure
        });
    }

    function normalize(saved) {
        var next = merge(defaults, saved || {});
        if (!fontStacks[next.display]) next.display = defaults.display;
        if (!fontStacks[next.body]) next.body = defaults.body;
        next.customDisplay = String(next.customDisplay || '');
        next.customBody = String(next.customBody || '');
        next.advancedCss = String(next.advancedCss || '');

        Object.keys(propertyMap).forEach(function (key) {
            var numeric = Number(next[key]);
            next[key] = Number.isFinite(numeric) ? numeric : defaults[key];
        });
        return next;
    }

    function loadSavedConfig() {
        var raw = storageGet(CONFIG_KEY);
        if (raw) {
            try {
                return normalize(JSON.parse(raw));
            } catch (error) {
                storageRemove(CONFIG_KEY);
            }
        }

        var previous = storageGet(PREVIOUS_CONFIG_KEY);
        if (previous) {
            try {
                var upgraded = JSON.parse(previous);
                upgraded.pageHeroTop = defaults.pageHeroTop;
                upgraded.pageHeroBottom = defaults.pageHeroBottom;
                var migrated = normalize(upgraded);
                storageSet(CONFIG_KEY, JSON.stringify(migrated));
                storageRemove(PREVIOUS_CONFIG_KEY);
                return migrated;
            } catch (error) {
                storageRemove(PREVIOUS_CONFIG_KEY);
            }
        }

        var legacy = storageGet(LEGACY_CONFIG_KEY);
        if (legacy) {
            try {
                var migrated = normalize(migrateLegacy(JSON.parse(legacy)));
                storageSet(CONFIG_KEY, JSON.stringify(migrated));
                return migrated;
            } catch (error) {
                storageRemove(LEGACY_CONFIG_KEY);
            }
        }
        return clone(defaults);
    }

    function requestFonts() {
        if (fontsRequested) return;
        fontsRequested = true;

        var google = document.createElement('link');
        google.rel = 'stylesheet';
        google.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700&family=Space+Grotesk:wght@400;500;600;700&display=swap';
        document.head.appendChild(google);

        var paperlogy = document.createElement('link');
        paperlogy.rel = 'stylesheet';
        paperlogy.href = 'https://cdn.jsdelivr.net/gh/fonts-archive/Paperlogy/subsets/Paperlogy-dynamic-subset.css';
        document.head.appendChild(paperlogy);
    }

    function openFontDatabase() {
        return new Promise(function (resolve, reject) {
            if (!window.indexedDB) {
                reject(new Error('IndexedDB unavailable'));
                return;
            }
            var request = window.indexedDB.open(FONT_DB_NAME, 1);
            request.onupgradeneeded = function () {
                var database = request.result;
                if (!database.objectStoreNames.contains(FONT_STORE_NAME)) {
                    database.createObjectStore(FONT_STORE_NAME, { keyPath: 'role' });
                }
            };
            request.onsuccess = function () {
                resolve(request.result);
            };
            request.onerror = function () {
                reject(request.error || new Error('Font database failed'));
            };
        });
    }

    function saveFontRecord(record) {
        return openFontDatabase().then(function (database) {
            return new Promise(function (resolve, reject) {
                var transaction = database.transaction(FONT_STORE_NAME, 'readwrite');
                transaction.objectStore(FONT_STORE_NAME).put(record);
                transaction.oncomplete = function () {
                    database.close();
                    resolve();
                };
                transaction.onerror = function () {
                    database.close();
                    reject(transaction.error || new Error('Font save failed'));
                };
            });
        });
    }

    function readFontRecord(role) {
        return openFontDatabase().then(function (database) {
            return new Promise(function (resolve, reject) {
                var transaction = database.transaction(FONT_STORE_NAME, 'readonly');
                var request = transaction.objectStore(FONT_STORE_NAME).get(role);
                request.onsuccess = function () {
                    database.close();
                    resolve(request.result || null);
                };
                request.onerror = function () {
                    database.close();
                    reject(request.error || new Error('Font read failed'));
                };
            });
        });
    }

    function registerFontBuffer(family, buffer) {
        var face = new FontFace(family, buffer);
        return face.load().then(function (loaded) {
            document.fonts.add(loaded);
            return loaded;
        });
    }

    function updateUploadLabel(role, filename) {
        var label = panel.querySelector('[data-tl-upload-label="' + role + '"]');
        if (label) label.textContent = filename || 'TTF, OTF, WOFF';
    }

    function restoreUploadedFonts() {
        return Promise.all(['display', 'body'].map(function (role) {
            return readFontRecord(role).then(function (record) {
                if (!record || !record.buffer || !record.family) return null;
                return registerFontBuffer(record.family, record.buffer).then(function () {
                    updateUploadLabel(role, record.filename);
                    return record;
                });
            }).catch(function () {
                return null;
            });
        }));
    }

    function handleFontFile(input) {
        var role = input.getAttribute('data-tl-font-file');
        var file = input.files && input.files[0];
        if (!file || (role !== 'display' && role !== 'body')) return;

        var family = role === 'display' ? 'Type Lab Local Display' : 'Type Lab Local Body';
        showStatus('Loading ' + file.name + '…', true);
        file.arrayBuffer().then(function (buffer) {
            return registerFontBuffer(family, buffer).then(function () {
                return saveFontRecord({
                    role: role,
                    family: family,
                    filename: file.name,
                    buffer: buffer
                }).catch(function () {
                    // The font still works for this session when persistence is unavailable.
                    return null;
                });
            });
        }).then(function () {
            if (role === 'display') {
                config.customDisplay = family;
                var displayInput = panel.querySelector('[data-tl-key="customDisplay"]');
                if (displayInput) displayInput.value = family;
            } else {
                config.customBody = family;
                var bodyInput = panel.querySelector('[data-tl-key="customBody"]');
                if (bodyInput) bodyInput.value = family;
            }
            config.preset = 'custom';
            updateUploadLabel(role, file.name);
            activate(config);
            showStatus(file.name + ' is loaded locally for ' + role + ' text.', true);
        }).catch(function () {
            showStatus('That font file could not be loaded.', true);
        });
    }

    function safeCustomStack(value, fallback) {
        var family = String(value || '').trim().replace(/[;{}]/g, '');
        if (!family) return fallback;
        if (family.indexOf(',') >= 0 || /^["']/.test(family)) return family;
        return '"' + family.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '", ' + fallback;
    }

    function displayStack(next) {
        return safeCustomStack(next.customDisplay, fontStacks[next.display]);
    }

    function bodyStack(next) {
        return safeCustomStack(next.customBody, fontStacks[next.body]);
    }

    function advancedStyleElement() {
        var style = document.getElementById('type-lab-advanced-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'type-lab-advanced-style';
            document.head.appendChild(style);
        }
        return style;
    }

    function clearPreviewProperties() {
        body.style.removeProperty('--pf-display');
        body.style.removeProperty('--pf-sans');
        Object.keys(propertyMap).forEach(function (key) {
            body.style.removeProperty(propertyMap[key][0]);
        });
        advancedStyleElement().textContent = '';
    }

    function setMappedProperties(next) {
        Object.keys(propertyMap).forEach(function (key) {
            var property = propertyMap[key][0];
            var unit = propertyMap[key][1];
            body.style.setProperty(property, String(next[key]) + unit);
        });
    }

    function applyConfig(next) {
        requestFonts();
        body.style.setProperty('--pf-display', displayStack(next));
        body.style.setProperty('--pf-sans', bodyStack(next));
        setMappedProperties(next);
        advancedStyleElement().textContent = next.advancedCss;
        body.classList.add('type-lab-active');
    }

    function saveConfig() {
        storageSet(CONFIG_KEY, JSON.stringify(config));
    }

    function showStatus(message, hold) {
        var status = panel.querySelector('[data-tl-status]');
        if (!status) return;
        status.textContent = message;
        window.clearTimeout(showStatus.timer);
        if (!hold) {
            showStatus.timer = window.setTimeout(function () {
                status.textContent = '';
            }, 2800);
        }
    }

    function trimmedNumber(value) {
        return String(parseFloat(Number(value).toFixed(3)));
    }

    function formattedValue(key) {
        var value = config[key];
        var unit = propertyMap[key] ? propertyMap[key][1] : '';
        var prefix = unit === 'em' && value > 0 ? '+' : '';
        return prefix + trimmedNumber(value) + unit;
    }

    function renderOutputs() {
        panel.querySelectorAll('[data-tl-output]').forEach(function (output) {
            var key = output.getAttribute('data-tl-output');
            if (Object.prototype.hasOwnProperty.call(config, key)) {
                output.textContent = formattedValue(key);
            }
        });
    }

    function renderPresetButtons() {
        panel.querySelectorAll('[data-preset]').forEach(function (button) {
            var isPressed = comparing
                ? button.getAttribute('data-preset') === 'original'
                : button.getAttribute('data-preset') === config.preset;
            button.setAttribute('aria-pressed', isPressed ? 'true' : 'false');
        });
    }

    function renderFontPairButtons() {
        panel.querySelectorAll('[data-tl-font-pair]').forEach(function (button) {
            var pair = button.getAttribute('data-tl-font-pair').split(':');
            var isPressed = !comparing
                && !config.customDisplay
                && !config.customBody
                && pair[0] === config.display
                && pair[1] === config.body;
            button.setAttribute('aria-pressed', isPressed ? 'true' : 'false');
        });
    }

    function renderControls() {
        panel.querySelectorAll('[data-tl-key]').forEach(function (control) {
            var key = control.getAttribute('data-tl-key');
            if (Object.prototype.hasOwnProperty.call(config, key)) {
                control.value = String(config[key]);
            }
        });
        renderOutputs();
        renderPresetButtons();
        renderFontPairButtons();
        renderLocalFontSelection();
    }

    function setCompareButton() {
        var compare = panel.querySelector('[data-tl-action="compare"]');
        if (!compare) return;
        compare.setAttribute('aria-pressed', comparing ? 'true' : 'false');
        compare.textContent = comparing ? 'Show preview' : 'Show site baseline';
    }

    function setComparing(value) {
        comparing = value;
        if (value) {
            body.classList.remove('type-lab-active');
            clearPreviewProperties();
            showStatus('Showing the current site baseline.');
        } else {
            applyConfig(config);
            showStatus('Showing your working preview.');
        }
        setCompareButton();
        renderPresetButtons();
        renderFontPairButtons();
        renderLocalFontSelection();
    }

    function activate(next, persist) {
        config = normalize(next);
        comparing = false;
        applyConfig(config);
        renderControls();
        setCompareButton();
        if (persist !== false) saveConfig();
    }

    function openPanel() {
        requestFonts();
        panel.hidden = false;
        body.classList.add('is-type-lab-open');
        launch.setAttribute('aria-expanded', 'true');
        window.setTimeout(function () {
            var close = panel.querySelector('[data-tl-action="close"]');
            if (close) close.focus();
        }, 0);
    }

    function closePanel() {
        body.classList.remove('is-type-lab-open');
        launch.setAttribute('aria-expanded', 'false');
        launch.focus();
    }

    function enableLab(openNow) {
        storageSet(ENABLED_KEY, '1');
        launch.hidden = false;
        panel.hidden = false;
        activate(loadSavedConfig(), false);
        restoreUploadedFonts().then(function () {
            if (body.classList.contains('type-lab-active')) applyConfig(config);
        });
        if (openNow) openPanel();
    }

    function disableLab() {
        storageRemove(ENABLED_KEY);
        storageRemove(CONFIG_KEY);
        storageRemove(PREVIOUS_CONFIG_KEY);
        storageRemove(LEGACY_CONFIG_KEY);
        config = clone(defaults);
        comparing = false;
        body.classList.remove('type-lab-active', 'is-type-lab-open');
        clearPreviewProperties();
        launch.hidden = true;
        panel.hidden = true;
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            var area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            try {
                document.execCommand('copy');
                resolve();
            } catch (error) {
                reject(error);
            }
            area.remove();
        });
    }

    function cssSnippet() {
        var lines = [
            'body.layout-portfolio {',
            '  --pf-display: ' + displayStack(config) + ';',
            '  --pf-sans: ' + bodyStack(config) + ';',
            '}',
            '',
            '.pf-eyebrow {',
            '  font-size: ' + config.eyebrowSize + 'px;',
            '  font-weight: ' + config.eyebrowWeight + ';',
            '  line-height: ' + config.eyebrowLine + ';',
            '  letter-spacing: ' + config.eyebrowTracking + 'em;',
            '  margin-bottom: ' + config.eyebrowBottom + 'px;',
            '}',
            '',
            '.pf-h1, .pf-page-h1 {',
            '  font-size: ' + config.titleSize + 'px;',
            '  font-weight: ' + config.titleWeight + ';',
            '  line-height: ' + config.titleLine + ';',
            '  letter-spacing: ' + config.titleTracking + 'em;',
            '  margin-bottom: ' + config.titleBottom + 'px;',
            '}',
            '',
            '.pf-deck, .pf-page-deck {',
            '  font-size: ' + config.deckSize + 'px;',
            '  font-weight: ' + config.deckWeight + ';',
            '  line-height: ' + config.deckLine + ';',
            '  letter-spacing: ' + config.deckTracking + 'em;',
            '  max-width: ' + config.deckMeasure + 'px;',
            '  margin-bottom: ' + config.deckBottom + 'px;',
            '}',
            '',
            '.pf-sec-title {',
            '  font-size: ' + config.sectionTitleSize + 'px;',
            '  font-weight: ' + config.sectionTitleWeight + ';',
            '  line-height: ' + config.sectionTitleLine + ';',
            '  letter-spacing: ' + config.sectionTitleTracking + 'em;',
            '}',
            '',
            '.pf-sec-head { margin-bottom: ' + config.sectionHeadGap + 'px; }',
            '.pf-hero { padding-top: ' + config.heroTop + 'px; padding-bottom: ' + config.heroBottom + 'px; column-gap: ' + config.heroColumnGap + 'px; }',
            '.pf-page-hero { padding-top: ' + config.pageHeroTop + 'px; padding-bottom: ' + config.pageHeroBottom + 'px; }',
            '.pf-sec { padding-top: ' + config.sectionPadding + 'px; padding-bottom: ' + config.sectionPadding + 'px; }',
            '.pf-sec.pf-sec--flush { padding-top: ' + config.flushSectionTop + 'px; }',
            '.pf-news-item { padding-top: ' + config.newsRowPadding + 'px; padding-bottom: ' + config.newsRowPadding + 'px; }',
            '.pf-pub { padding-top: ' + config.pubRowPadding + 'px; padding-bottom: ' + config.pubRowPadding + 'px; }',
            '.pf-focus-item { padding-top: ' + config.focusRowPadding + 'px; padding-bottom: ' + config.focusRowPadding + 'px; }',
            '.pf-exp-item { padding-top: ' + config.expRowPadding + 'px; padding-bottom: ' + config.expRowPadding + 'px; }',
            '',
            '.pf-news-body, .pf-pub-authors, .pf-focus-desc, .pf-exp-detail, .pf-proj-desc, .pf-blog-excerpt {',
            '  line-height: ' + config.copyLine + ';',
            '  letter-spacing: ' + config.copyTracking + 'em;',
            '}',
            '.pf-pub-body { gap: ' + config.pubBodyGap + 'px; }',
            '.pf-focus-desc, .pf-exp-detail { margin-top: ' + config.expDetailGap + 'px; }'
        ];

        if (config.advancedCss.trim()) {
            lines.push('', '/* Advanced Type Lab override */', config.advancedCss.trim());
        }
        if (/^Type Lab Local /.test(config.customDisplay) || /^Type Lab Local /.test(config.customBody)) {
            lines.push('', '/* The uploaded font file is device-local and is not embedded in this CSS. */');
        }
        return lines.join('\n');
    }

    function addLocalFontOptions(families) {
        var list = document.getElementById('type-lab-local-fonts');
        if (!list) return;
        var existing = {};
        Array.prototype.forEach.call(list.options, function (option) {
            existing[option.value] = true;
        });
        families.forEach(function (family) {
            if (existing[family]) return;
            var option = document.createElement('option');
            option.value = family;
            list.appendChild(option);
            existing[family] = true;
        });
    }

    function groupLocalFonts(fonts) {
        var grouped = {};

        fonts.forEach(function (font) {
            var family = String(font.family || '').trim();
            if (!family) return;
            var key = family.toLocaleLowerCase();
            if (!grouped[key]) {
                grouped[key] = {
                    family: family,
                    styles: [],
                    search: family.toLocaleLowerCase()
                };
            }

            var style = String(font.style || '').trim();
            if (style && grouped[key].styles.indexOf(style) === -1) {
                grouped[key].styles.push(style);
            }

            [font.fullName, font.postscriptName].forEach(function (name) {
                if (name) grouped[key].search += ' ' + String(name).toLocaleLowerCase();
            });
        });

        return Object.keys(grouped).map(function (key) {
            grouped[key].styles.sort(function (a, b) {
                return a.localeCompare(b);
            });
            return grouped[key];
        }).sort(function (a, b) {
            return a.family.localeCompare(b.family);
        });
    }

    function renderLocalFontMessage(message) {
        var list = panel.querySelector('[data-tl-local-font-list]');
        if (!list) return;
        list.textContent = '';
        var empty = document.createElement('div');
        empty.className = 'type-lab__local-font-empty';
        empty.textContent = message;
        list.appendChild(empty);
    }

    function localFontIsSelected(family) {
        if (comparing) return false;
        if (localFontTarget === 'display') return config.customDisplay === family;
        if (localFontTarget === 'body') return config.customBody === family;
        return config.customDisplay === family && config.customBody === family;
    }

    function renderLocalFontSelection() {
        panel.querySelectorAll('[data-tl-local-font-family]').forEach(function (button) {
            var family = button.getAttribute('data-tl-local-font-family');
            button.setAttribute('aria-pressed', localFontIsSelected(family) ? 'true' : 'false');
        });
    }

    function renderLocalFontTargets() {
        panel.querySelectorAll('[data-tl-font-target]').forEach(function (button) {
            button.setAttribute(
                'aria-pressed',
                button.getAttribute('data-tl-font-target') === localFontTarget ? 'true' : 'false'
            );
        });
        renderLocalFontSelection();
    }

    function renderLocalFontList() {
        var list = panel.querySelector('[data-tl-local-font-list]');
        var count = panel.querySelector('[data-tl-local-font-count]');
        var search = panel.querySelector('[data-tl-local-font-search]');
        if (!list || !count) return;

        var query = String(search ? search.value : '').trim().toLocaleLowerCase();
        var filtered = localFontFamilies.filter(function (entry) {
            return !query || entry.search.indexOf(query) !== -1;
        });

        count.textContent = query
            ? filtered.length + ' of ' + localFontFamilies.length + ' families'
            : localFontFamilies.length + ' families, ' + localFontFaceCount + ' faces';
        list.textContent = '';

        if (!filtered.length) {
            renderLocalFontMessage(query ? 'No installed fonts match this search.' : 'No installed fonts were returned.');
            return;
        }

        var fragment = document.createDocumentFragment();
        filtered.forEach(function (entry) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'type-lab__local-font-row';
            button.setAttribute('data-tl-local-font-family', entry.family);
            button.setAttribute('aria-label', 'Apply ' + entry.family + ' to ' + localFontTarget);
            button.setAttribute('aria-pressed', localFontIsSelected(entry.family) ? 'true' : 'false');

            var preview = document.createElement('span');
            preview.className = 'type-lab__local-font-preview';
            preview.style.fontFamily = '"' + entry.family.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '", sans-serif';
            preview.textContent = 'Seonghu Jeon. 성후 연구 Aa 0123';

            var meta = document.createElement('span');
            meta.className = 'type-lab__local-font-meta';

            var name = document.createElement('span');
            name.className = 'type-lab__local-font-name';
            name.textContent = entry.family;

            var styles = document.createElement('span');
            styles.className = 'type-lab__local-font-styles';
            styles.textContent = entry.styles.length + (entry.styles.length === 1 ? ' style' : ' styles');
            if (entry.styles.length) styles.title = entry.styles.join(', ');

            meta.appendChild(name);
            meta.appendChild(styles);
            button.appendChild(preview);
            button.appendChild(meta);
            fragment.appendChild(button);
        });
        list.appendChild(fragment);
    }

    function applyLocalFont(family) {
        var next = clone(config);
        if (localFontTarget === 'both' || localFontTarget === 'display') {
            next.customDisplay = family;
        }
        if (localFontTarget === 'both' || localFontTarget === 'body') {
            next.customBody = family;
        }
        next.preset = 'custom';
        activate(next);
        renderLocalFontSelection();
        showStatus(family + ' applied to ' + (localFontTarget === 'both' ? 'all text' : localFontTarget) + '.');
    }

    function scanLocalFonts() {
        var button = panel.querySelector('[data-tl-action="scan-fonts"]');
        var count = panel.querySelector('[data-tl-local-font-count]');
        if (typeof window.queryLocalFonts !== 'function') {
            if (count) count.textContent = 'Browser access unavailable';
            renderLocalFontMessage('This browser cannot enumerate every installed font. Use an exact family name or load a font file below.');
            showStatus('Full local-font access needs desktop Chromium. Exact family names and font files still work.', true);
            return;
        }

        if (button) {
            button.disabled = true;
            button.textContent = 'Loading…';
        }
        if (count) count.textContent = 'Waiting for permission';
        showStatus('Waiting for local-font permission…', true);
        window.queryLocalFonts().then(function (fonts) {
            localFontFaceCount = fonts.length;
            localFontFamilies = groupLocalFonts(fonts);
            addLocalFontOptions(localFontFamilies.map(function (entry) {
                return entry.family;
            }));
            renderLocalFontList();
            showStatus(localFontFamilies.length + ' installed font families are ready with live previews.', true);
        }).catch(function (error) {
            if (error && error.name === 'NotAllowedError') {
                if (count) count.textContent = 'Permission not granted';
                renderLocalFontMessage('Local-font permission was not granted. Select Load fonts to try again.');
                showStatus('Font permission was not granted. Exact family names still work.', true);
            } else {
                if (count) count.textContent = 'Could not load fonts';
                renderLocalFontMessage('Installed fonts could not be read. Select Load fonts to try again.');
                showStatus('Installed fonts could not be read. Exact family names still work.', true);
            }
        }).then(function () {
            if (button) {
                button.disabled = false;
                button.textContent = 'Reload fonts';
            }
        });
    }

    function commitControl(control) {
        var key = control.getAttribute('data-tl-key');
        if (!key || !Object.prototype.hasOwnProperty.call(config, key)) return;

        if (comparing) {
            comparing = false;
            setCompareButton();
        }

        if (Object.prototype.hasOwnProperty.call(propertyMap, key)) {
            config[key] = Number(control.value);
        } else {
            config[key] = control.value;
        }

        if (key === 'display') {
            config.customDisplay = '';
            var displayInput = panel.querySelector('[data-tl-key="customDisplay"]');
            if (displayInput) displayInput.value = '';
        } else if (key === 'body') {
            config.customBody = '';
            var bodyInput = panel.querySelector('[data-tl-key="customBody"]');
            if (bodyInput) bodyInput.value = '';
        }

        config.preset = 'custom';
        config = normalize(config);
        applyConfig(config);
        saveConfig();
        renderOutputs();
        renderPresetButtons();
        renderFontPairButtons();
        renderLocalFontSelection();
    }

    if (queryMode === '0') {
        disableLab();
        return;
    }

    if (firstOpen || storageGet(ENABLED_KEY) === '1') {
        enableLab(firstOpen);
    }

    launch.addEventListener('click', function () {
        if (body.classList.contains('is-type-lab-open')) {
            closePanel();
        } else {
            openPanel();
        }
    });

    panel.addEventListener('click', function (event) {
        var fontTargetButton = event.target.closest('[data-tl-font-target]');
        if (fontTargetButton) {
            localFontTarget = fontTargetButton.getAttribute('data-tl-font-target');
            renderLocalFontTargets();
            return;
        }

        var localFontButton = event.target.closest('[data-tl-local-font-family]');
        if (localFontButton) {
            applyLocalFont(localFontButton.getAttribute('data-tl-local-font-family'));
            return;
        }

        var fontPairButton = event.target.closest('[data-tl-font-pair]');
        if (fontPairButton) {
            var pair = fontPairButton.getAttribute('data-tl-font-pair').split(':');
            var next = clone(config);
            next.display = pair[0];
            next.body = pair[1];
            next.customDisplay = '';
            next.customBody = '';
            next.preset = 'custom';
            activate(next);
            var fontPairName = fontPairButton.querySelector('span:last-child');
            showStatus((fontPairName ? fontPairName.textContent : 'Font choice') + ' applied. Sizes and spacing are unchanged.');
            return;
        }

        var presetButton = event.target.closest('[data-preset]');
        if (presetButton) {
            var preset = presetButton.getAttribute('data-preset');
            if (preset === 'original') {
                setComparing(true);
            } else if (presets[preset]) {
                activate(clone(presets[preset]));
                showStatus(presetButton.querySelector('.type-lab__preset-name').textContent + ' applied.');
            }
            return;
        }

        var actionButton = event.target.closest('[data-tl-action]');
        if (!actionButton) return;
        var action = actionButton.getAttribute('data-tl-action');

        if (action === 'close') {
            closePanel();
        } else if (action === 'compare') {
            setComparing(!comparing);
        } else if (action === 'reset') {
            storageRemove(CONFIG_KEY);
            activate(clone(defaults), false);
            showStatus('Reset to your Wanted Sans working choice.');
        } else if (action === 'copy') {
            copyText(cssSnippet()).then(function () {
                showStatus('Complete CSS copied.');
            }).catch(function () {
                showStatus('Copy failed. Please try again.');
            });
        } else if (action === 'disable') {
            disableLab();
        } else if (action === 'scan-fonts') {
            scanLocalFonts();
        }
    });

    panel.addEventListener('input', function (event) {
        if (event.target.matches('[data-tl-local-font-search]')) {
            if (localFontFamilies.length) renderLocalFontList();
            return;
        }
        var control = event.target.closest('[data-tl-key]');
        if (!control) return;
        commitControl(control);
    });

    panel.addEventListener('change', function (event) {
        var fontFile = event.target.closest('[data-tl-font-file]');
        if (fontFile) {
            handleFontFile(fontFile);
            return;
        }
        var control = event.target.closest('[data-tl-key]');
        if (!control) return;
        commitControl(control);
        if (control.hasAttribute('data-tl-custom-font') && control.value.trim()) {
            showStatus('Local font family applied. The browser falls back if that family is unavailable.');
        } else {
            showStatus('Custom setting saved in this browser.');
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && body.classList.contains('is-type-lab-open')) {
            closePanel();
        }
    });
})();
