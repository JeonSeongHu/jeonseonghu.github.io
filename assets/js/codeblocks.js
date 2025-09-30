(function(){
  function labelFromClass(pre){
    var code = pre.querySelector('code');
    if (!code) return '';
    var cls = code.className || '';
    var m = cls.match(/language-([\w+-]+)/);
    return m ? m[1] : '';
  }

  function addCopyButtons(){
    document.querySelectorAll('pre').forEach(function(pre){
      if (pre.querySelector('.code-copy-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.type = 'button';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function(){
        var code = pre.querySelector('code');
        if (!code) return;
        var text = code.innerText;
        navigator.clipboard.writeText(text).then(function(){
          btn.textContent = 'Copied';
          setTimeout(function(){ btn.textContent = 'Copy'; }, 1200);
        });
      });
      pre.appendChild(btn);
    });
  }

  function addLangBadges(){
    document.querySelectorAll('pre').forEach(function(pre){
      if (pre.querySelector('.code-lang-badge')) return;
      var label = labelFromClass(pre);
      if (!label) return;
      var badge = document.createElement('span');
      badge.className = 'code-lang-badge';
      badge.textContent = label.toUpperCase();
      pre.appendChild(badge);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    addCopyButtons();
    addLangBadges();
  });
})();














