(() => {
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
