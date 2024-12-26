import React, { useRef, useState } from "react";
import NewPost from "../../../components/MarketPlace/NewPost";
import ExistingPost from "../../../components/MarketPlace/ExistingPost";

const tabs = [
  { id: 1, name: "New Post" },
  { id: 2, name: "Existing Post" },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function PostAnnouncement() {
  const [selecterdTab, setSelecterdTab] = useState(1);

  return (
    <div className="main-container px-0 pt-8 pb-4 mt-[-15px]">
      <div className="bg-[#040B476f] w-full h-[45px] flex justify-center items-center">
        <h3 className="text-[#040C50] text-[24px] font-bold">
          Post Announcement
        </h3>
      </div>
      <div className="border-b mb-[18px] w-full border-black">
        <nav
          className="-mb-px flex justify-around w-full pt-[10px] sm:space-x-4"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelecterdTab(tab.id)}
              className={classNames(
                selecterdTab === tab.id
                  ? "border-[#02227E] bg-[#3760CB30] "
                  : "border-transparent",
                // tab.id === 1 ? " max-w-[95px]" : " max-w-[120px]",
                "font-bold w-1/2   font-inter text-[20px]  sm:max-w-full sm:w-auto w-content text-[#02227E] border-b-2  px-1 "
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      {selecterdTab === 1 && <NewPost />}

      {selecterdTab === 2 && <ExistingPost />}
    </div>
  );
}
