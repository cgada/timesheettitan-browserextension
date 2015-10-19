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
      success: function(loginData) {
        chrome.storage.sync.set(extractStoreData(loginData), function() {
          currentLogin = loginData;
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
      callbacks.success(currentLogin);
      return;
    }

    chrome.storage.sync.get(getEmptyStoreData(), function(loginData) {
      callbacks.success = callbacks.success || utils.noop;

      if(loginData.username && loginData.api_key && loginData.id) {
        currentLogin = loginData;
        http.addInterceptor(authInterceptor);

        callbacks.success(loginData);
      } else {
        callbacks.success(null);
      }
    });
  }

  function extractCallbacks(callbacks) {
    return {
      success: callbacks.success || utils.noop,
      error: callbacks.error || utils.noop,
      complete: callbacks.complete || utils.noop
    };
  }

  function getActiveSessions(userId, callbacks) {
    http.get(apiBase + '/users/' + userId + '/active_sessions', extractCallbacks(callbacks));
  }

  function getProjects(userId, callbacks) {
    http.get(apiBase + '/users/' + userId + '/projects', extractCallbacks(callbacks));
  }

  function getTasks(projectId, callbacks) {
    http.get(apiBase + '/projects/' + projectId + '/tasks', extractCallbacks(callbacks));
  }

  function getTask(taskId, projectId, callbacks) {
    http.get(apiBase + '/projects/' + projectId + '/tasks/' + taskId, extractCallbacks(callbacks));
  }

  function startTask(taskId, callbacks) {
    http.post(apiBase + '/tasks/' + taskId + '/start', undefined, extractCallbacks(callbacks));
  }

  function stopTask(taskId, callbacks) {
    http.put(apiBase + '/tasks/' + taskId + '/stop', undefined, extractCallbacks(callbacks));
  }

  return {
    login: login,
    logout: logout,
    getCurrentUser: getCurrentUser,
    getTasks: getTasks,
    getProjects: getProjects,
    startTask: startTask,
    stopTask: stopTask,
    getActiveSessions: getActiveSessions
  }
})();
