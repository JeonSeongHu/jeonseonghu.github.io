(function(){
  // reading time (words / 200 wpm) – counts visible article text
  function estimateReadingTime() {
    var article = document.querySelector('.article-post');
    if (!article) return null;
    var text = article.innerText || '';
    var words = text.trim().split(/\s+/).filter(Boolean).length;
    var minutes = Math.max(1, Math.round(words / 200));
    return minutes;
  }

  function injectReadingTime() {
    var minutes = estimateReadingTime();
    if (!minutes) return;
    var target = document.querySelector('.posttitle');
    if (!target) return;
    var badge = document.createElement('span');
    badge.className = 'ml-2 text-muted';
    badge.style.fontSize = '0.9rem';
    badge.textContent = (window.siteActiveLang === 'en' ? (minutes + ' min read') : (minutes + '분 소요'));
    target.appendChild(badge);
  }

  function setupProgressBar() {
    var bar = document.getElementById('read-progress');
    if (!bar) return;
    function onScroll(){
      var h = document.documentElement;
      var pos = h.scrollTop || document.body.scrollTop;
      var height = h.scrollHeight - h.clientHeight;
      var progress = height > 0 ? (pos / height) * 100 : 0;
      bar.style.width = progress + '%';
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', function(){
    // expose lang for reading time label
    try { window.siteActiveLang = document.documentElement.lang || 'ko'; } catch(e){}
    injectReadingTime();
    setupProgressBar();
  });
})();














