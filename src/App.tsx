import { useEffect, useState } from "react";
import SettingsIcon from "./assets/icons/SettingsIcon";
import './App.css';
import Tab from "./components/Tab";
import MainWrapper from "./components/MainWrapper";

export interface Profile {
  name: string;
  title: string;
  company: string;
}

export const tabs = [{label: "Current Profile", id: "0"}, {label: "Added", id: "1"}];

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedTab, setSelectedTab] = useState("Current Profile");

  useEffect(() => {
    chrome.storage.local.clear()
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs[0].id) return;

      chrome.tabs.sendMessage(tabs[0].id, {action: "getProfileInfo"}, (response) => {
        if (!response) return;
        setProfile({...response});
      })
    })
  }, []);

  return (
    <div className="w-[410px] h-[442px] p-[20px] border-1 border-borderGray main-shadow relative">
      {/* header */}
      <div className="flex flex-row justify-between items-center">
        <div className="h-full w-full relative">
          <img src="./Logo.png" alt="nex.ai-logo" className="object-cover" />
          <p className="opacity-40 absolute bottom-[-30px]" >The fastest CRM experience is here.</p>
        </div>

        <button className="w-[40px] aspect-square border-1 border-borderGray rounded-[4px] flex justify-center items-center bg-lightGray opacity-50 hover:opacity-100 transition-all duration-[250ms]">
          <SettingsIcon />
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-[60px] flex items-center gap-x-[3px]">
        {
          tabs.map(({label, id}) => (
            <Tab 
              key={id}
              selectedTab={selectedTab}
              label={label}
              handleClick={() => setSelectedTab(label)}
            />
          ))
        }
      </div>


      {/* Body */}
      <MainWrapper selectedTab={selectedTab} profile={profile} />
    </div>
  );
}

export default App;
