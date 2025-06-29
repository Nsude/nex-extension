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

  runAfterLoad(() => {
    const data = extractProfileInfo();
    if (!data) {
      console.error("Error extracting profile info: ", chrome.runtime.lastError);
      return;
    }

    const profileData = {...data, id: Date.now()};

    chrome.storage.local.get(['addedProfiles'], (response) => {
      let updatedProfileList;
      let currentProfiles = response.addedProfiles;
      if (currentProfiles) {
        const alreadyAdded = currentProfiles.find((item: {name: string, title: string, company: string, id: number}) => {
          return (
            item.name === profileData.name 
            && item.title === profileData.title
            && item.company === profileData.company
          )
        })

        if (alreadyAdded) return;

        updatedProfileList = [...response.addedProfiles, profileData];
      } else {
        updatedProfileList = [profileData];
      }

      chrome.storage.local.set({addedProfiles: updatedProfileList});
    })
  })

})();
