import { tabs, type Profile } from "../App";
import ProfileIcon from "../assets/icons/ProfileIcon";
import CustomButton from "./CustomButton";

interface Props {
  selectedTab: string;
  profile: Profile | null;
  added?: Profile[];
}

const MainWrapper = ({selectedTab, profile, added}: Props) => {
  // const testProfile: Profile = {name: "John Doe", title: "Chief Executive Officer AFter the first named priest of Antarctica", company: "Google"}
  return (
    <div className="w-full pt-[25px]">
      {/* Tab 1 (Current Profile) */}
      {
        selectedTab === tabs[0].label && profile ? (
          <div>
            <ProfileCard profile={profile} />
            <span className="absolute bottom-[20px] left-[20px]">
              <CustomButton label="Add Profile" profile={profile} handleClick={() => {}} />
            </span>
          </div>
        ) : selectedTab === tabs[0].label && !profile ? (
          <div className="flex w-full flex-col gap-y-[10px] opacity-40 mt-15px] items-center text-center">
            <span className="w-[65%]">
              To get started, go to a profile then click “Add Profile”
            </span>
            <span className="w-[65%]">
              or enable auto-save in “Settings” to add every profile you visit while Nex is running.
            </span>
          </div>
        ) : null
      }

      {/* Tab 2 (Added) */}
      {
        selectedTab === tabs[1].label && added ? (
          <div>

          </div>
        ) : selectedTab === tabs[1].label && !added ? (
          <div className="flex mt-[50px] justify-center items-center">
            <span className="w-[65%] opacity-40 text-center">
              Seems like you haven’t added anyone yet :)
            </span>
          </div>
        ) : null
      }
    </div>
  )
}

export default MainWrapper;

interface ProfileProps {
  profile: Profile
}
const ProfileCard = ({profile}: ProfileProps) => {
  return (
    <div className="flex flex-row gap-x-[10px]">
      <div className="bg-lightGray rounded-[4px] min-w-[60px] w-[60px] aspect-square flex justify-center items-center">
        <span className="opacity-60">
          <ProfileIcon />
        </span>
      </div>

      <div className="flex flex-col leading-[1] w-full">
        <div className="mb-[8px]">
          <span className="w-full">{profile.name}</span>
          <span className="block mt-[4px] opacity-40 w-[80%] truncate-lines">{profile.title}</span>
        </div>
        <span>{profile.company}</span>
      </div>
    </div>
  )
}