window.titan = (function() {
  var currentUsername = null;
  var currentApiKey = null;

  function authInterceptor(req) {
    req.setRequestHeader('Authentication', 'ApiKey');
    req.setRequestHeader('Username', currentUsername);
    req.setRequestHeader('ApiKey', currentApiKey);
  }

  function login(data, callbacks) {
    http.post('/users/login', data, {
      success: function(login) {
        chrome.storage.sync.set({
          username: login.username,
          api_key: login.api_key
        }, function() {
          currentApiKey = login.api_key;
          currentUsername = login.username;
          http.addInterceptor(authInterceptor);

          callbacks.success({
            username: data.username
          });
        });
      }
    });
  }

  function logout(callbacks) {
    http.post('/users/logout', undefined, {
      success: function() {
        chrome.storage.sync.set({
          username: null,
          api_key: null
        }, function() {
          currentApiKey = login.api_key;
          currentUsername = login.username;
          http.removeInterceptor(authInterceptor);

          callbacks.success(null);
        });
      }
    })
  }

  function getCurrentUser(callbacks) {
    chrome.storage.sync.get({
      username: null,
      api_key: null
    }, function(items) {
      if(items.username && items.api_key) {
        currentApiKey = items.api_key;
        currentUsername = items.username;
        http.addInterceptor(authInterceptor);

        callbacks.success({
          username: items.username,
          apiKey: items.api_key
        });
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
