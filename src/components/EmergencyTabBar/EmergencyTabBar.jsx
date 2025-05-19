import { useEffect, useRef, useState } from "react";
import { ChatCenteredDots, CalendarCheck, MapPin } from "phosphor-react";



const tabbar = [
  { label: 'Chat', icon: ChatCenteredDots, value: 'chat' },
  { label: 'Details', icon: CalendarCheck, value: 'details' },
  { label: 'location', icon: MapPin, value: 'location' },
];

function Tabbar({ tabs = tabbar, color = '#FFFFFF14', activeTab, setActiveTab }) {

  return (
    <>
      <div className={`flex justify-between items-center sm:rounded-[200px] w-full sm:mt-[24px] sm:py-[12px] sm:px-[24px] pt-[16px] pb-[24px] px-[16px] sm:relative fixed bottom-0 left-0`} style={{ backgroundColor: color }}>
        <div className="sm:block hidden"><img src="/images/setup/tab-logo.svg" alt="logo" className="md:max-w-[132px] max-w-[100px]" /></div>
        <div className="flex items-center justify-between sm:justify-center sm:w-auto w-full">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.value;
            const Icon = tab.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveTab(tab.value)}
                className={`
                relative flex flex-col items-center md:w-[130px] w-[100px] text-[8px] font-normal transition-all duration-200
                ${isActive ? 'text-white before:opacity-100' : 'text-[#f2b4a4] before:opacity-0'}
                before:content-[''] before:absolute before:bottom-[-14px] before:left-1/2 before:-translate-x-1/2
                before:w-[100%] before:h-1 before:rounded-full before:bg-white before:transition-opacity before:duration-300
              `}
              >
                <Icon
                  weight={isActive ? 'fill' : 'regular'}
                  className={`sm:w-7 sm:h-7 w-6 h-6 mb-1 ${isActive ? 'text-white' : 'text-[#f2b4a4]'}`}
                />
                <span className="sm:hidden">{tab.label}</span>
              </button>

            )
          })}
        </div>
        <div className="sm:flex hidden items-center gap-[24px]">
          <button><img src="/images/setup/toggle-icon.svg" alt="icon" className="w-6 h-6" /></button>
          <div><img src="/images/setup/tab-profile.png" alt="profile" className="object-cover object-center rounded-full h-[40px] w-[40px]" /></div>
        </div>
      </div>
    </>)
}

export default Tabbar;