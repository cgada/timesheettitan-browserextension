window.titan = (function() {
  function login(data, callbacks) {
    chrome.storage.sync.set({
      username: data.username,
      api_key: 'hereisarandomapikey'
    }, function() {
      callbacks.success({
        username: data.username
      });
    });
  }

  function logout(callbacks) {
    chrome.storage.sync.set({
      username: null,
      api_key: null
    }, function() {
      callbacks.success(null);
    });
  }

  function getCurrentUser(callbacks) {
    chrome.storage.sync.get({
      username: null,
      api_key: null
    }, function(items) {
      if(items.username && items.api_key) {
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
