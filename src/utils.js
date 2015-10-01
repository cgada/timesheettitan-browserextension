window.utils = (function() {
  function initElements(ids) {
    ids = Array.isArray(ids) ? ids : [ids];

    var elements = {};

    for(var i = 0; i < ids.length; i++) {
      var id = ids[i];
      elements[id] = document.getElementById(id);
    }

    return elements;
  }

  return {
    initElements: initElements
  };
})();
