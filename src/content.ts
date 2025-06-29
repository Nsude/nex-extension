// Multiple injection issues - if your script gets injected multiple times, variables won't redeclare

// The IIFE creates an isolated scope, which is a best practice for content scripts even without duplicate const declarations.

(() => {
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'getProfileInfo') {
      const isProfilePage = window.location.href.includes('linkedin.com/in/');
      if (!isProfilePage) return sendResponse(null);

      const data = extractProfileInfo();
      sendResponse(data);
    }
  });
})();