
export interface TabProps {
  selectedTab?: string;
  label: string;
  handleClick: () => void;
}

const Tab = ({selectedTab, label, handleClick}: TabProps) => {
  return (
    <button 
    onClick={handleClick}
    className={`w-full h-[40px] border-1 border-borderGray rounded-[6px] flex justify-center items-center bg-lightGray ${selectedTab === label ? 'active-tab' : ''} tab-button`}
    >
      <span className="opacity-40">{label}</span>
    </button>
  )
}

export default Tab;