function getActiveTasks(callback) {
  callback([]);
}

document.addEventListener('DOMContentLoaded', function() {
  var startTaskButton = document.getElementById('start_task');
  var stopTaskButton = document.getElementById('stop_task');

  function setupNoActiveTasksState() {
    chrome.browserAction.setIcon({ path: 'assets/titan-inactive.png' });
    stopTaskButton.style.display = 'none';
    startTaskButton.style.display = 'block';
  }

  function setupActiveTasksState() {
    chrome.browserAction.setIcon({ path: 'assets/titan-active.png' });
    stopTaskButton.style.display = 'block';
    startTaskButton.style.display = 'none';
  }

  getActiveTasks(function(tasks) {
    if(tasks.length === 0) {
      setupNoActiveTasksState();
    } else {
      setupActiveTasksState();
    }
  });

  startTaskButton.addEventListener('click', setupActiveTasksState);
  stopTaskButton.addEventListener('click', setupNoActiveTasksState);
});
