import Checkmark from "./Checkmark";

export interface statusIconProps {
  isLoading: boolean;
  isComplete: boolean;
}

const StatusIcon = ({isLoading, isComplete}: statusIconProps) => {
  return (
    <>
    { isLoading ? 
      // spinner
      <div className="custom-spinner w-full h-full" /> 
      : isComplete ? 
      // checkmark
      <div className="checkmark-con">
        <Checkmark />
      </div> 
      : null
    } 
    </>
  )
}

export default StatusIcon;