document.addEventListener('DOMContentLoaded', function() {
  var doc = utils.initElements([
    'loginForm',
    'userInfo',
    'loginButton',
    'logoutButton',
    'usernameInput',
    'passwordInput',
    'loggedInAs'
  ]);

  function onUserData(user) {
    if(user) {
      doc.loggedInAs.innerText = 'Logged in as ' + user.username;
      utils.hideElement(doc.loginForm);
      utils.showElement(doc.userInfo);
    } else {
      utils.hideElement(doc.userInfo);
      utils.showElement(doc.loginForm);
    }
  }

  titan.getCurrentUser({
    success: onUserData
  });

  doc.loginButton.addEventListener('click', function() {
    titan.login({
      username: doc.usernameInput.value,
      password: doc.passwordInput.value
    }, {
      success: onUserData
    });
  })

  doc.logoutButton.addEventListener('click', function() {
    titan.logout({
      success: onUserData
    });
  });
});
