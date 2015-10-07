window.http = (function() {
  var apiBase = 'http://localhost:8000';

  var interceptors = [];

  function applyInterceptors(req) {
    for(var i = 0; i < interceptors.length; i++) {
      interceptors[i](req);
    }
  }

  function getRequestHandler(req, callbacks) {
    return function() {
      if(req.readystate === 4) {
        var res = JSON.parse(req.responseText || '{"message": "Empty response!"}');
        if(200 <= req.status && req.status < 300) {
          callbacks.success(res);
        } else {
          callbacks.error(res)
        }
      }
    };
  }

  return {
    get: function(url, callbacks) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = getRequestHandler(req, callbacks);
      req.open('GET', apiBase + url);
      req.send();
    },
    post: function(url, data, callbacks) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = getRequestHandler(req, callbacks);
      req.open('POST', apiBase + url);
      req.send(JSON.stringify(data));
    },
    addInterceptor: function(interceptor) {
      if(interceptors.indexOf(interceptor) === -1) {
        interceptors.push(interceptor);
      }
    },
    removeInterceptor: function(interceptor) {
      var index = interceptors.indexOf(interceptor);
      if(index !== -1) {
        interceptors.splice(index, 1);
      }
    }
  }
})();
