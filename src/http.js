window.http = (function() {
  return {
    get: function(url, callback) {
      var req = new XMLHttpRequest();
      req.addEventListener('load', function(res) {
        var raw = res.target.response;
        if(raw) {
          callback(JSON.parse(raw))
        } else {
          callback(null);
        }
      });
      req.open('GET', url);
      req.send();
    }
  }
})();
