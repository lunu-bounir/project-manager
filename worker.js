chrome.action.onClicked.addListener(() => chrome.tabs.create({
  url: '/data/view/index.html'
}));
