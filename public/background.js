// reinject the content.js script if a user starts off at an invalid page then navigates to a profile
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url && 
    tab.url.includes('linkedin.com/in/')
  ) {
    chrome.scripting.executeScript({
      target: {tabId},
      files: ['content.js']
    })
  }
})