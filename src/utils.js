window.utils = (function() {
  function initElements(ids) {
    ids = Array.isArray(ids) ? ids : [ids];

    var elements = {};
    var __list = [];

    for(var i = 0; i < ids.length; i++) {
      var id = ids[i];
      elements[id] = document.getElementById(id);
      __list.push(elements[id]);
    }

    elements.__list = __list;
    return elements;
  }

  function showElement(element) {
    element.style.display = 'block';
  }

  function hideElement(element) {
    element.style.display = 'none';
  }

  function showElements(elements) {
    elements.forEach(function(element) {
      showElement(element);
    });
  }

  function hideElements(elements) {
    elements.forEach(function(element) {
      hideElement(element);
    });
  }

  function noop() {

  }

  return {
    initElements: initElements,
    showElement: showElement,
    hideElement: hideElement,
    showElements: showElements,
    hideElements: hideElements,
    noop: noop
  };
})();
