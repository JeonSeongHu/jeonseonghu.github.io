(function(){
  function labelFromClass(pre){
    var code = pre.querySelector('code');
    if (!code) return '';
    var cls = code.className || '';
    var m = cls.match(/language-([\w+-]+)/);
    return m ? m[1] : '';
  }

  function addCopyButtons(){
    document.querySelectorAll('div.highlight').forEach(function(wrapper){
      if (wrapper.querySelector('.code-copy-btn')) return;
      // Find the code content (rouge-code cell or direct code element)
      var codeEl = wrapper.querySelector('td.rouge-code pre') || wrapper.querySelector('code');
      if (!codeEl) return;
      var btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.type = 'button';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function(){
        var text = codeEl.innerText;
        navigator.clipboard.writeText(text).then(function(){
          btn.textContent = 'Copied';
          setTimeout(function(){ btn.textContent = 'Copy'; }, 1200);
        }).catch(function(){
          btn.textContent = 'Failed';
          setTimeout(function(){ btn.textContent = 'Copy'; }, 1200);
        });
      });
      wrapper.appendChild(btn);
    });
  }

  function addLangBadges(){
    document.querySelectorAll('div.highlighter-rouge').forEach(function(wrapper){
      if (wrapper.querySelector('.code-lang-badge')) return;
      var cls = wrapper.className || '';
      var m = cls.match(/language-([\w+-]+)/);
      if (!m) return;
      var highlightDiv = wrapper.querySelector('div.highlight') || wrapper;
      var badge = document.createElement('span');
      badge.className = 'code-lang-badge';
      badge.textContent = m[1].toUpperCase();
      highlightDiv.appendChild(badge);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    addCopyButtons();
    addLangBadges();
  });
})();














