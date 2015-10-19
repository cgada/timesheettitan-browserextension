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
        titan.getActiveSessions(user.id, {
          success: function(data) {
            var session = data.objects[0];
            if(session) {
              setupTask(session.task.resource_uri.substring(session.task.resource_uri.length - 1), session.task, true);
            } else {
              setupMainView(user);
            }
          }
        });
      } else {
        setupNotLoggedIn();
      }
    }
  });

  function setupMainView(user) {
    utils.hideElements(mainDoc.__list);
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

    while(doc.projectsList.hasChildNodes()) {
      doc.projectsList.removeChild(doc.projectsList.lastChild);
    }

    titan.getProjects(user.id, {
      success: function(data) {
        data.objects.forEach(function(project) {
          var a = document.createElement('a');
          a.innerText = project.name;
          a.href = '#';
          var li = document.createElement('li');
          li.appendChild(a);
          a.addEventListener('click', function(event) {
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
        var ul = document.createElement('ul');
        data.objects.forEach(function(task) {
          var li = document.createElement('li');
          li.innerHTML = '<a href="#">' + task.description + '</a>';
          li.addEventListener('click', function() {
            setupTask(parseInt(task.resource_uri.substring(task.resource_uri.length - 1)), task);
          });
          ul.appendChild(li);
        });
        parentElement.appendChild(ul);
      }
    });
  }

  function setupTask(taskId, task, active) {
    active = active || false;

    utils.hideElements(mainDoc.__list);

    utils.showElement(mainDoc.taskContainer);

    var doc = utils.initElements(['stopTaskButton', 'startTaskButton', 'taskInfo']);

    doc.taskInfo.innerText = task.description;

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

    if(active) {
      setupActiveTasksState();
    } else {
      setupNoActiveTasksState();
    }

    doc.startTaskButton.addEventListener('click', function() {
      titan.startTask(taskId, {
        success: function() {
          setupActiveTasksState();
        }
      });
    });

    doc.stopTaskButton.addEventListener('click', function() {
      titan.stopTask(taskId, {
        success: function() {
          titan.getCurrentUser({
            success: function(user) {
              setupNoActiveTasksState();
              setupMainView(user);
            }
          });
        }
      });
    });
  }
});
