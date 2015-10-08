window.titan = (function() {
  var apiBase = 'http://localhost:8000/api/v1';

  var currentLogin = null;

  function authInterceptor(req) {
    req.setRequestHeader('Authorization', 'ApiKey');
    req.setRequestHeader('Username', currentLogin.username);
    req.setRequestHeader('ApiKey', currentLogin.api_key);
  }

  function extractStoreData(data) {
    return {
      username: data.username,
      api_key: data.api_key,
      id: data.id
    };
  }

  function getEmptyStoreData() {
    return {
      username: null,
      api_key: null,
      id: null
    };
  }

  function login(data, callbacks) {
    http.post(apiBase + '/users/login', data, {
      success: function(login) {
        chrome.storage.sync.set(extractStoreData(login), function() {
          currentLogin = login;
          http.addInterceptor(authInterceptor);

          (callbacks.success || utils.noop)(currentLogin);
        });
      },
      error: callbacks.error || utils.noop,
      complete: callbacks.complete || utils.noop
    });
  }

  function logout(callbacks) {
    http.post(apiBase + '/users/logout', undefined, {
      success: function() {
        chrome.storage.sync.set(getEmptyStoreData(), function() {
          currentLogin = null;
          http.removeInterceptor(authInterceptor);

          (callbacks.success || utils.noop)(null);
        });
      },
      error: callbacks.error || utils.noop,
      complete: callbacks.complete || utils.noop
    });
  }

  function getCurrentUser(callbacks) {
    if(currentLogin) {
      return currentLogin;
    }

    chrome.storage.sync.get(getEmptyStoreData(), function(login) {
      callbacks.success = callbacks.success || utils.noop;

      if(login.username && login.api_key && login.id) {
        currentLogin = login;
        http.addInterceptor(authInterceptor);

        callbacks.success(login);
      } else {
        callbacks.success(null);
      }
    });
  }

  return {
    login: login,
    logout: logout,
    getCurrentUser: getCurrentUser
  }
})();
