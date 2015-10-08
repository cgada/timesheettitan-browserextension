document.addEventListener('DOMContentLoaded', function() {
  var doc = utils.initElements([
    'loginForm',
    'userInfo',
    'loginButton',
    'logoutButton',
    'usernameInput',
    'passwordInput',
    'loggedInAs',
    'errorDiv'
  ]);

  function onUserData(user) {
    if(user) {
      doc.loggedInAs.innerText = 'Logged in as ' + user.username;
      utils.hideElement(doc.loginForm);
      utils.showElement(doc.userInfo);
      doc.usernameInput.value = null;
      doc.passwordInput.value = null;
      errorDiv.innerText = '';
    } else {
      utils.hideElement(doc.userInfo);
      utils.showElement(doc.loginForm);
    }
  }

  titan.getCurrentUser({
    success: onUserData
  });

  doc.loginButton.addEventListener('click', function() {
    doc.loginButton.disabled = true;
    errorDiv.innerText = '';

    titan.login({
      username: doc.usernameInput.value,
      password: doc.passwordInput.value
    }, {
      success: onUserData,
      error: function(data) {
        errorDiv.innerText = data.error_message;
      },
      complete: function() {
        doc.loginButton.disabled = false;
      }
    });
  })

  doc.logoutButton.addEventListener('click', function() {
    doc.logoutButton.disabled = true;
    errorDiv.innerText = '';

    titan.logout({
      success: onUserData,
      error: function(data) {
        errorDiv.innerText = data.error_message;
      },
      complete: function() {
        doc.logoutButton.disabled = false;
      }
    });
  });
});
