import { useEffect, useState } from "react";
import SettingsIcon from "./assets/icons/SettingsIcon";
import './App.css';
import Tab from "./components/Tab";
import MainWrapper from "./components/MainWrapper";
import LinkIcon from "./assets/icons/LinkIcon";

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
  const [autosave, setAutosave] = useState(false);

  let hideTimeout: any;

  // init current profile
  useEffect(() => {
    if (!isExtensionEnv()) return;

    // init auto save state
    chrome.storage.local.get(['autosave'], (response) => {
      if (!response.autosave) return;
      setAutosave(response.autosave);
    })

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0].id) return;

      chrome.tabs.sendMessage(tabs[0].id, { action: "getProfileInfo" }, (response) => {
        if (!response) return;
        setProfile({ ...response, id: Date.now() });
      })
    })
  }, []);

  // toggle settings menu
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

  // toggle autosave
  const toggleAutosave = () => {
    let newState = !autosave;
    setAutosave(newState);
    chrome.storage.local.set({autosave: newState});
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
          onMouseEnter={() => { clearTimeout(hideTimeout); setDisplaySettingsMenu(true) }}
          onMouseLeave={() => setDisplaySettingsMenu(false)}
          className={`absolute p-[15px] w-[202px] h-[86px] border border-borderGray rounded-[6px] right-0 top-[43px] bg-white z-[5] cursor-pointer settings-modal ${displaySettingsMenu ? 'settings-modal-active' : ''}`}>
          <span className={`flex flex-col justify-between h-full menu-container`}>
            {/* auto-save */}
            <button
              onClick={toggleAutosave}
              className={`flex justify-between items-center autosave-button
                ${autosave ? 'autosave-active' : ''}
                `}>
              <span className="opacity-40 transition-all duration-[0.4s]">Auto-save</span>
              <div className={`relative w-[28px] h-[17px] bg-lightGray border border-borderGray rounded-4xl autosave-toggle-con`}>
                <span className="absolute left-[2px] top-[2px] bg-borderGray w-[11px] aspect-square rounded-4xl" />
              </div>
            </button>

            <button className="group opacity-60 hover:opacity-100 transition-opacity duration-[0.2s] flex flex-row gap-x-[6px] items-center dashboard-link w-fit">
              <div className="relative overflow-hidden flex items-center gap-x-[6px]">
                <span className="absolute top-[50%] translate-y-[-50%] translate-x-[-16px] group-hover:translate-x-[0] scale-50 group-hover:scale-100"><LinkIcon /></span>
                <span className="group-hover:translate-x-[16px]">Dashboard</span>
                <span className="group-hover:translate-x-[16px] scale-100 group-hover:scale-50"><LinkIcon /></span>
              </div>
            </button>
          </span>
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
