(() => {
  const linkedInExperinceParentClass =
    'a[data-field="experience_company_logo"]:not(.pvs-entity__image-container--outline-offset)';

  const checkElem = () => {
    return !!document.querySelector(`${linkedInExperinceParentClass} span`);
  }

  // run check every 200ms
  // if it exist clearinterval and run function
  // also set a timeout timer to terminate the operation 
  const runAfterLoad = (callback: () => void) => {
    const loadStart = Date.now();

    const checkInterval = setInterval(() => {
      if (checkElem()) {
        clearInterval(checkInterval);
        callback();
      }

      if (Date.now() - loadStart > 10000) {
        clearInterval(checkInterval);
        console.warn("Error loading profile for autosave");
      }
    }, 200)
  }

  // const awaitContentScript = (callback: () => void) => {
  //   const loadStart = Date.now();

  //   const readyInterval = setInterval(() => {
  //     chrome.runtime.sendMessage({action: 'ping'}, (response) => {
  //       if (response === 'ready') {
  //         clearInterval(readyInterval);
  //         callback();
  //       } else {
  //         console.warn("content script not ready")
  //       }
  //     })

  //     // terminate after 10s
  //     if (Date.now() - loadStart > 10000) {
  //       clearInterval(readyInterval);
  //       console.error("Unable to make connection with content script");
  //     }
  //   }, 200)
  // }

  runAfterLoad(() => {
    // awaitContentScript(() => {
    //   chrome.runtime.sendMessage({action: "getProfileInfo"}, (response) => {
    //     console.log('runtime things')
    //     if (!response) return;
    //     console.log(response);
    //   })
    // })
  })

})();
