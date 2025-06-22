import type { Profile } from "../App";
import type { TabProps } from "./Tab";

interface Props extends TabProps {
  profile: Profile | null;
}


const CustomButton = ({label, profile, handleClick}: Props) => {
  return (
    <button 
      onClick={handleClick}
      className={`w-[183px] h-[40px] border-1 border-borderGray rounded-[6px] flex justify-center items-center bg-lightGray custom-button ${profile ? 'custom-button-active' : ''}`}>
      <span className="opacity-40">{label}</span> 
    </button>
  )
}

export default CustomButton;