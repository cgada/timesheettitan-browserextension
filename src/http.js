window.http = (function() {
  var interceptors = [];

  function applyInterceptors(req) {
    for(var i = 0; i < interceptors.length; i++) {
      interceptors[i](req);
    }
  }

  function getRequestHandler(req, callbacks) {
    return function() {
      if(req.readyState === 4) {
        var res = JSON.parse(req.responseText || '{"message": "Empty response!"}');
        if(200 <= req.status && req.status < 300) {
          callbacks.success(res);
        } else {
          callbacks.error(res)
        }
        callbacks.complete(res);
      }
    };
  }

  function openRequest(method, url, callbacks) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = getRequestHandler(req, callbacks);
    req.open(method, url);
    applyInterceptors(req);
    return req;
  }

  return {
    get: function(url, callbacks) {
      openRequest('GET', url, callbacks).send();
    },
    post: function(url, data, callbacks) {
      openRequest('POST', url, callbacks).send(JSON.stringify(data));
    },
    put: function(url, data, callbacks) {
      openRequest('PUT', url, callbacks).send(JSON.stringify(data));
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
