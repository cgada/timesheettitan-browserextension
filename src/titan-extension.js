document.addEventListener('DOMContentLoaded', function() {
  var mainDoc = utils.initElements(['notLoggedInContainer', 'taskContainer', 'projectsContainer', 'loggedInAs']);
  utils.hideElements(mainDoc.__list);

  function openOptionsPage(event) {
    if(event) event.preventDefault();
    chrome.tabs.create({ url: '/options.html' });
  }

  titan.getCurrentUser({
    success: function(user) {
      if(user) {
        setupMainView(user);
      } else {
        setupNotLoggedIn();
      }
    }
  });

  function setupMainView(user) {
    var doc = utils.initElements(['loggedInInfo', 'manageConnections']);
    utils.showElement(mainDoc.loggedInAs);
    doc.loggedInInfo.innerText = 'Logged in as ' + user.username;
    doc.manageConnections.addEventListener('click', openOptionsPage);
    setupProjects(user);
  }

  function setupNotLoggedIn() {
    var doc = utils.initElements(['loginLink']);

    utils.showElement(mainDoc.notLoggedInContainer);
    doc.loginLink.addEventListener('click', openOptionsPage);
  }

  function setupProjects(user) {
    utils.showElement(mainDoc.projectsContainer);

    var doc = utils.initElements(['projectsList']);

    titan.getProjects(user.id, {
      success: function(data) {
        data.objects.forEach(function(project) {
          var li = document.createElement('li');
          li.innerHTML = '<a href="#">' + project.name + '</a>';
          li.addEventListener('click', function(event) {
            event.preventDefault();
            setupTaskList(project.id, li);
            li.innerText = project.name;
          });
          doc.projectsList.appendChild(li);
        });
      }
    });
  }

  function setupTaskList(projectId, parentElement) {
    titan.getTasks(projectId, {
      success: function(data) {
        console.log(data);
        var ul = document.createElement('ul');
        data.objects.forEach(function(task) {
          var li = document.createElement('li');
          li.innerHTML = '<a href="#">' + task.description + '</a>';
          li.addEventListener('click', function() {

          });
          ul.appendChild(li);
        });
        parentElement.appendChild(ul);
      }
    });
  }

  function setupTask() {
    var doc = utils.initElements(['stopTaskButton', 'startTaskButton']);

    function setupNoActiveTasksState() {
      chrome.browserAction.setIcon({ path: 'assets/titan-inactive.png' });
      doc.stopTaskButton.style.display = 'none';
      doc.startTaskButton.style.display = 'block';
    }

    function setupActiveTasksState() {
      chrome.browserAction.setIcon({ path: 'assets/titan-active.png' });
      doc.stopTaskButton.style.display = 'block';
      doc.startTaskButton.style.display = 'none';
    }

    titan.getTasks(0, function(tasks) {
      if(tasks.length === 0) {
        setupNoActiveTasksState();
      } else {
        setupActiveTasksState();
      }
    });

    doc.startTaskButton.addEventListener('click', setupActiveTasksState);
    doc.stopTaskButton.addEventListener('click', setupNoActiveTasksState);
  }
});
