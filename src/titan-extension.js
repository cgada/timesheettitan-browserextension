function getActiveTasks(callback) {
  callback([]);
}

document.addEventListener('DOMContentLoaded', function() {
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

  getActiveTasks(function(tasks) {
    if(tasks.length === 0) {
      setupNoActiveTasksState();
    } else {
      setupActiveTasksState();
    }
  });

  doc.startTaskButton.addEventListener('click', setupActiveTasksState);
  doc.stopTaskButton.addEventListener('click', setupNoActiveTasksState);
});
