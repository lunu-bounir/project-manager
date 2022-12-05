document.addEventListener('keydown', e => {
  const hold = (e.ctrlKey || e.metaKey) && e.shiftKey;
  const uhold = e.shiftKey;

  if (hold && e.code === 'KeyU') {
    e.preventDefault();
    document.getElementById('update-issue').click();
  }
  else if (hold && e.code === 'KeyA') {
    e.preventDefault();
    document.getElementById('add-issue').click();
  }
  else if (hold && e.code === 'KeyR') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('mark-as-read').click();
  }
  else if (uhold && e.code === 'KeyR') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('mark-as-unread').click();
  }
  else if (hold && e.code === 'KeyG') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('mark-as-flagged').click();
  }
  else if (uhold && e.code === 'KeyG') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('mark-as-unflagged').click();
  }
  else if (hold && e.code === 'KeyP') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('mark-as-pinned').click();
  }
  else if (uhold && e.code === 'KeyP') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('mark-as-unpinned').click();
  }
  else if (hold && e.code === 'KeyC') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('mark-as-complete').click();
  }
  else if (hold && e.code === 'KeyD') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('delete-issue').click();
  }
  else if (hold && e.code === 'KeyO') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('add-project').click();
  }
  else if (uhold && e.code === 'KeyO') {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('remove-project').click();
  }
});

document.getElementById('update-issue').title = 'Ctrl + Shift + U or Meta + Shift + U';
document.getElementById('add-issue').title = 'Ctrl + Shift + A or Meta + Shift + A';
document.getElementById('mark-as-read').title = 'Ctrl + Shift + R or Meta + Shift + R';
document.getElementById('mark-as-unread').title = 'Shift + R';
document.getElementById('mark-as-flagged').title = 'Ctrl + Shift + G or Meta + Shift + G';
document.getElementById('mark-as-unflagged').title = 'Shift + G';
document.getElementById('mark-as-pinned').title = 'Ctrl + Shift + P or Meta + Shift + P';
document.getElementById('mark-as-unpinned').title = 'Shift + P';
document.getElementById('mark-as-complete').title = 'Ctrl + Shift + C or Meta + Shift + C';
document.getElementById('delete-issue').title = 'Ctrl + Shift + D or Meta + Shift + D';
document.getElementById('add-project').title = 'Ctrl + Shift + O or Meta + Shift + O';
document.getElementById('remove-project').title = 'Shift + O';
