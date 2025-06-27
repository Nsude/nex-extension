import { useEffect, useState } from "react";
import SettingsIcon from "./assets/icons/SettingsIcon";
import './App.css';
import Tab from "./components/Tab";
import MainWrapper from "./components/MainWrapper";

export interface Profile {
  name: string;
  title: string;
  company: string;
  id: number;
}

export const tabs = [{ label: "Current Profile", id: "0" }, { label: "Added", id: "1" }];

// prevent dev env chrome api errors
export const isExtensionEnv = () => {
  return typeof chrome !== undefined && chrome.tabs
}

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedTab, setSelectedTab] = useState("Current Profile");
  const [displaySettingsMenu, setDisplaySettingsMenu] = useState(false);
  let hideTimeout: any;

  // init current profile
  useEffect(() => {
    if (!isExtensionEnv()) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0].id) return;

      chrome.tabs.sendMessage(tabs[0].id, { action: "getProfileInfo" }, (response) => {
        if (!response) return;
        setProfile({ ...response, id: Date.now() });
      })
    })
  }, []);

  const toggleSettingsModal = (mouseLeave: boolean = false) => {
    if (mouseLeave) {
      hideTimeout = setTimeout(() => {
        setDisplaySettingsMenu(false);
      }, 400);

    } else {
      clearTimeout(hideTimeout);
      setDisplaySettingsMenu((prev) => !prev);
    }
  }

  return (
    <div className="w-[410px] h-[442px] p-[20px] border-1 border-borderGray main-shadow relative">
      {/* blur overlay */}
      <div
        className={`absolute left-0 top-0 h-full w-full bg-black/[0.08] backdrop-blur-[2px] z-[4] blur-overlay ${displaySettingsMenu ? 'blur-overlay-active' : ''}`} />

      {/* header */}
      <div className="relative flex flex-row justify-between items-center">
        <div className="h-full w-full relative">
          <img src="./Logo.png" alt="nex.ai-logo" className="object-cover" />
          <p className="opacity-40 absolute bottom-[-30px]" >The fastest CRM experience is here.</p>
        </div>

        {/* settings-icon/button */}
        <button
          onMouseLeave={() => toggleSettingsModal(true)}
          onClick={() => toggleSettingsModal()}
          className={`group w-[40px] aspect-square border border-borderGray rounded-[4px] flex justify-center items-center bg-lightGray z-[5] settings-button ${displaySettingsMenu ? 'settings-icon-open' : ''}`}>
          <span className="opacity-50 transition-opacity group-hover:opacity-100 duration-[0.25s]"><SettingsIcon /></span>
        </button>

        {/* settings modal */}
        <div 
          onMouseEnter={() => { clearTimeout(hideTimeout); setDisplaySettingsMenu(true)}}
          onMouseLeave={() => setDisplaySettingsMenu(false)}
          className={`absolute w-[202px] h-[86px] border border-borderGray rounded-[6px] right-0 top-[43px] bg-white z-[5] cursor-pointer settings-modal ${displaySettingsMenu ? 'settings-modal-active' : ''}`}>

        </div>
      </div>

      {/* Tabs */}
      <div className="mt-[60px] flex items-center gap-x-[3px]">
        {
          tabs.map(({ label, id }) => (
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
