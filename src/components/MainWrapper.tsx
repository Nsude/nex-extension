import { useEffect, useState } from "react";
import { tabs, type Profile } from "../App";
import CustomButton from "./CustomButton";
import StatusIcon, { type statusIconProps } from "../assets/icons/StatusIcon";
import LinkedInIcon from "../assets/icons/LinkedInIcon";

interface Props {
  selectedTab: string;
  profile: Profile | null;
}


const MainWrapper = ({ selectedTab, profile }: Props) => {
  const [addedProfiles, setAddedProfiles] = useState<Profile[]>([]);
  const [status, setStatus] = useState({ isLoading: false, isComplete: false });

  useEffect(() => {
    if (!profile || selectedTab !== tabs[0].label) return;

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
    if (selectedTab === tabs[1].label) {
      setStatus({ isComplete: false, isLoading: false });
    }
  }, [selectedTab]);


  // load added profiles
  useEffect(() => {
    chrome.storage.local.get(['addedProfiles'], (response) => {
      if (!response.addedProfiles) return;

      setAddedProfiles([...response.addedProfiles]);
    })
  }, [])

  const handleAddProfile = () => {
    if (!profile) return;

    const isAdded = addedProfiles.find(item => item.name === profile?.name);
    if (isAdded) return;
    setStatus({ isComplete: false, isLoading: true });

    chrome.storage.local.get(['addedProfiles'], (response) => {
      let updatedProfileList;
      if (response.addedProfiles) {
        updatedProfileList = [...response.addedProfiles, profile];
      } else {
        updatedProfileList = [profile];
      };

      setAddedProfiles(updatedProfileList);
      chrome.storage.local.set({ addedProfiles: updatedProfileList });
    })

    setTimeout(() => {
      setStatus({ isComplete: true, isLoading: false });
    }, 2000)
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
          <div className="flex w-full flex-col gap-y-[10px] opacity-40 mt-[15px] items-center text-center">
            <span className="w-[65%]">
              To get started, go to a profile then click “Add Profile”
            </span>
            <span className="w-[65%]">
              or enable auto-save in “Settings” to add every profile you visit while Nex is running.
            </span>
          </div>
        )
      )}

      {/* added profiles */}
      {selectedTab === tabs[1].label && (
        addedProfiles.length > 0 ? (
          <div className="flex flex-col gap-y-[20px] w-full h-[258px] overflow-y-scroll">
            {addedProfiles.slice().reverse().map((item, i) => (
              <div className="relative mt-[20px] added-profile-card"
                key={'profile_' + (i + 1)}>
                <ProfileCard
                  profile={item}
                  isLoading={status.isLoading}
                  isComplete={status.isComplete} />

                <span className="h-[1px] w-[95%] absolute bottom-[-20px] left-0 bg-borderGray/50 profile-border" />
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

interface ProfileProps extends statusIconProps {
  profile: Profile;
}
const ProfileCard = ({ profile, isLoading, isComplete }: ProfileProps) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentUrl = tabs[0].url;
      setUrl(currentUrl || '');
    })
  }, [])

  return (
    <div className="relative flex flex-row gap-x-[10px]">
      <div className="bg-linkedinBlue rounded-[4px] min-w-[60px] w-[60px] aspect-square flex justify-center items-center">
        <span>
          {
            url.includes('linkedin.com/in/') ? 
            <LinkedInIcon /> : null
          }
        </span>
      </div>

      <div className="flex flex-col leading-[1] w-full">
        <div className="mb-[8px]">
          <span className="w-full">{profile.name}</span>
          <span className="block mt-[4px] opacity-40 w-[80%] truncate-lines">{profile.title}</span>
        </div>
        <span>{profile.company}</span>
      </div>

      <div className="absolute w-[24px] aspect-square right-0 top-[50%] translate-y-[-50%]">
        <StatusIcon isLoading={isLoading} isComplete={isComplete} />
      </div>
    </div>
  )
}