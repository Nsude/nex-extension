import { useEffect, useState } from "react";
import LinkedInIcon from "../assets/icons/LinkedInIcon";
import StatusIcon, { type statusIconProps } from "../assets/icons/StatusIcon";
import { isExtensionEnv, type Profile } from "../App";

interface ProfileProps extends statusIconProps {
  profile: Profile;
  selectedTab: string
}
const ProfileCard = ({ profile, isLoading, isComplete, selectedTab }: ProfileProps) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!isExtensionEnv()) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      setUrl(currentUrl || '');
    })
  }, [])

  return (
    <div className="relative flex flex-row gap-x-[10px]">
      <div className="bg-linkedinBlue rounded-[4px] min-w-[60px] w-[60px] aspect-square flex justify-center items-center">
        <span>
          {
            url.includes('linkedin.com') ?
              <LinkedInIcon /> : null
          }
        </span>
      </div>

      <div className="flex flex-col leading-[1] w-full">
        <div className="mb-[8px]">
          <a href={profile.link} target="_blank"
            className={`w-[80%] relative truncate-lines ${selectedTab.toLowerCase() === "added" ? "profile-link" : ""}`}>
            {profile.name}
          </a>

          <span className="block mt-[2px] opacity-40 w-[80%] truncate-lines">{profile.title}</span>
        </div>
        <span className="w-[80%] truncate-lines">{profile.company}</span>
      </div>

      <div className="absolute w-[24px] aspect-square right-0 top-[50%] translate-y-[-50%]">
        <StatusIcon isLoading={isLoading} isComplete={isComplete} />
      </div>
    </div>
  )
}

export default ProfileCard;