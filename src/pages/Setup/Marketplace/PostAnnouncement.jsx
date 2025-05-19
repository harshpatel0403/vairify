import React, { useRef, useState } from "react";
import NewPost from "../../../components/MarketPlace/NewPost";
import ExistingPost from "../../../components/MarketPlace/ExistingPost";
import MyCalendar from "./MyCalendar";
import PageTitle from "../../../components/PageTitle";

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
    <div className="container pb-[50px]">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Post Announcement"} />
      </div>
      <div className="lg:grid grid-cols-12 gap-[24px] hidden">
        <div className=" xl:col-span-4 col-span-5">
          <div className="bg-[#FFFFFF0A] rounded-[16px] p-[16px]">
            <NewPost />
          </div>
        </div>
        <div className="xl:col-span-8 col-span-7">
          <div className="bg-[#FFFFFF0A] rounded-[16px] p-[16px]">
            <ExistingPost />
          </div>
        </div>
      </div>

      <div className="lg:hidden block">
        <nav
          className="flex justify-around w-full bg-[#FFFFFF14] p-[8px] rounded-[8px]"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelecterdTab(tab.id)}
              className={classNames(
                selecterdTab === tab.id
                  ? "bg-[#3760CB30]"
                  : "border-transparent bg-transparent",
                " text-[14px] font-medium text-white text-center py-[7px] px-[20px] rounded-[8px] max-w-[180px] w-full"
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
        {selecterdTab === 1 && <NewPost />}

        {selecterdTab === 2 && <ExistingPost />}
      </div>
    </div>
  );
}



{/* <div className="container">
<h3 className="text-white text-[28px] font-semibold text-center my-[48px]">
  Post Announcement
</h3>
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
</div> */}