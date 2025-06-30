import { useEffect, useState } from "react";
import { isExtensionEnv, tabs, type Profile } from "../App";
import CustomButton from "./CustomButton";
import CloseIcon from "../assets/icons/CloseIcon";
import ProfileCard from "./ProfileCard";

interface Props {
  selectedTab: string;
  profile: Profile | null;
}

// const addedProfiles:Profile[] = [
//   {name: "Meshach Nsude", id: 1, title: "Frontend Developer & Designer", company: "creaition", link: ''}
// ]

const MainWrapper = ({ selectedTab, profile }: Props) => {
  const [addedProfiles, setAddedProfiles] = useState<Profile[]>([]);
  const [status, setStatus] = useState({ isLoading: false, isComplete: false });

  // display checkmark for already added profiles
  useEffect(() => {
    if (!profile || selectedTab !== tabs[0].label || !isExtensionEnv()) return;

    chrome.storage.local.get(['addedProfiles'], (response) => {
      const added = response.addedProfiles || [];
      const isAlreadyAdded = added.find((item: Profile) => item.name === profile.name);

      if (isAlreadyAdded) {
        setStatus({ isComplete: true, isLoading: false });
      } else {
        setStatus({ isComplete: false, isLoading: false });
      }
    });
  }, [profile, selectedTab]);

  // Hide checkmarks when on the "added" tab
  useEffect(() => {
    if (!isExtensionEnv()) return;

    if (selectedTab === tabs[1].label) {
      setStatus({ isComplete: false, isLoading: false });
    }
  }, [selectedTab]);


  // load added profiles from storage
  useEffect(() => {
    if (!isExtensionEnv()) return;

    chrome.storage.local.get(['addedProfiles'], (response) => {
      if (!response.addedProfiles) return;

      setAddedProfiles([...response.addedProfiles]);
    })
  }, [])

  const handleAddProfile = () => {
    if (!profile || !isExtensionEnv()) return;

    const isAdded = addedProfiles.find((item: Profile) => {
      return (
        item.name === profile.name
        && item.title === profile.title
        && item.company === profile.company
      )
    })
    if (isAdded) return;
    setStatus({ isComplete: false, isLoading: true });

    chrome.storage.local.get(['addedProfiles'], (response) => {
      let updatedProfileList;
      if (response.addedProfiles) {
        updatedProfileList = [...response.addedProfiles, profile];
      } else {
        updatedProfileList = [profile];
      };

      setTimeout(() => {
        setAddedProfiles(updatedProfileList);
        chrome.storage.local.set({ addedProfiles: updatedProfileList });
        setStatus({ isComplete: true, isLoading: false });
      }, 2000)
    })
  }

  // delete profile 
  const deleteProfile = (id: number) => {
    if (!isExtensionEnv()) return;

    const toDelete = addedProfiles.find(profile => profile.id === id);
    if (!toDelete) return;

    const updatedList = [...addedProfiles];
    updatedList.splice(updatedList.indexOf(toDelete), 1);
    setAddedProfiles(updatedList);

    chrome.storage.local.set({ addedProfiles: updatedList });
  }

  // fade hovered profile 
  const fadeProfile = (index: number) => {
    disableFade();
    const hoveredProfile = document.querySelector(`.profile-container[data-index="${index}"]`);

    hoveredProfile?.classList.add("fade");
  }

  const disableFade = () => {
    document.querySelector(".fade")?.classList.remove("fade");
  }

  return (
    <div className="w-full pt-[25px]">
      {/* current profile */}
      {selectedTab === tabs[0].label && (
        profile ? (
          <div>
            <ProfileCard
              profile={profile}
              isLoading={status.isLoading}
              selectedTab={selectedTab}
              isComplete={status.isComplete} />

            <span className="absolute bottom-[20px] left-[20px]">
              <CustomButton
                label="Add Profile"
                profile={profile}
                isAlreadyAdded={status.isComplete}
                handleClick={handleAddProfile} />
            </span>
          </div>
        ) : (
          // empty state
          <div className="flex w-full flex-col gap-y-[10px] opacity-40 mt-[25px] items-center text-center">
            <span className="w-[65%]">
              To get started, go to a profile then click “Add Profile”
            </span>
            <span className="w-[65%]">
              or enable auto-save in “Settings” to add every profile you visit.
            </span>
          </div>
        )
      )}

      {/* added profiles */}
      {selectedTab === tabs[1].label && (
        addedProfiles.length > 0 ? (
          <div className="flex flex-col gap-y-[20px] w-full h-[258px] overflow-y-scroll">
            {addedProfiles.slice().reverse().map((item, i) => (
              <div className="relative mt-[20px] added-profile-card min-h-fit overflow-x-clip"
                key={'profile_' + (i + 1)}>
                <div data-index={i} className="profile-container">
                  <ProfileCard
                    profile={item}
                    selectedTab={selectedTab}
                    isLoading={status.isLoading}
                    isComplete={status.isComplete} />
                </div>

                {/* delete button */}
                <button
                  onClick={() => deleteProfile(item.id)}
                  onMouseEnter={() => fadeProfile(i)}
                  onMouseLeave={disableFade}
                  className="absolute right-[20px] top-[50%] translate-y-[-50%] bg-lightGray h-[40px] aspect-square rounded-[30px] flex justify-center items-center profile-delete-button">
                  <span className="opacity-40">
                    <CloseIcon />
                  </span>
                </button>

                <span className="h-[1px] right-[20px] absolute bottom-[-20px] left-0 bg-borderGray/50 profile-border" />
              </div>
            ))}
          </div>
        ) : (
          // empty state
          <div className="flex mt-[50px] justify-center items-center">
            <span className="w-[65%] opacity-40 text-center">
              Seems like you haven’t added anyone yet :)
            </span>
          </div>
        )
      )}
    </div>
  );

}

export default MainWrapper;