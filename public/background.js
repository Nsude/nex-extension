// reinject the content.js script if a user starts off at an invalid page then navigates to a profile
const onUpdatedCheck = (changeInfo, tab) => {
  return changeInfo.status === "complete" &&
    tab.url && tab.url.includes('linkedin.com/in/');
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (onUpdatedCheck(changeInfo, tab)) {
    if (autosaveEnabled) {
      // Inject all scripts for autosave
      chrome.scripting.executeScript({
        target: {tabId},
        files: ['linkedin-scrapper.js', 'content.js']
      }, () => {
        chrome.scripting.executeScript({
          target: {tabId},
          files: ['autosave.js']
        })
      })
    } else {
      chrome.scripting.executeScript({
        target: {tabId},
        files: ['linkedin-scrapper.js', 'content.js']
      })
    }
  }
})

// implement autosave
let autosaveEnabled = false;
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;

  if ('autosave' in changes) {
    autosaveEnabled = changes.autosave.newValue === true;
  }
})

// load the current autosave state on statup
chrome.storage.local.get(['autosave'], (response) => {
  autosaveEnabled = response.autosave === true;
})