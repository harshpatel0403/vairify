import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleSelectServices } from "../../../redux/action/Services";
import { useLocation } from "react-router-dom";
import { HandleAdvancedSelectServices } from "../../../redux/action/AdvancedSearch";
import Button from "../../../components/Button";
import MarketPlaceModale from "../../../components/MarketPlace/MarketPlaceModale";
import { CaretDown } from "phosphor-react";
import PageTitle from "../../../components/PageTitle";
const SensualServices = [
  "Girlfriend Experience",
  "Porn Star Experience",
  "French kissing",
  "Cunnilingus",
  "BBBJ",
  "CBJ",
  "Deepthroat",
  "Cum in mouth",
  "Msog",
  "Swallowing",
  "Prostate play",
  "Anal",
  "Rimming",
  "Fingering",
  "4 handed",
  "Pegging",
  "Kamasutra",
  "Erotic massage",
  "Duo with girl",
  "Couples",
  "Group sex",
  "With 2 men",
  "Hand Job",
  "Foot Job",
  "Bdsm",
  "Foot fetish",
  "Submissive",
  "Femdom",
  "Dirty talk",
  "Masturbation",
  "69 position",
  "Cum in face",
  "Casual photos",
  "Cum on body",
  "Golden shower",
  "Video with sex",
  "Virtual Sessions",
  "Only Fans ",
];
const typeOfEvent = [
  "Bachelor Party",
  "Bachelorette Party",
  "Bottle Services",
  "Police Strippers",
  "Sexy Bartender",
  "Erotic Golf Caddies",
  "Pool Party",
  "Football Parties",
  "Boat Party",
  "Sexy Pizza Delivery",
  "Lap Dance",
  "Extreme Lapdance",
];
const traditionalMassage = ["Deep Tissue", "Swedish", "Thai", "Shiatsu"];
const sensualMassage = [
  "Body Rub",
  "Tantra",
  "Dark tantra",
  "Prostate",
  "Erotic",
  "Nuru",
  "Foam",
  "Esalen",
  "Lingam",
  "Yoni",
];
const release = [
  "Therapeutic",
  "Hand job",
  "Full Service",
  "BBBJ",
  "Prostate",
  "CBJ",
  "Grinding",
  "Toys",
];
const Build = [
  "Average",
  "Slender",
  "Athletic",
  "Very muscular",
  "Curvy",
  "Few Extra Pounds",
  "Flabby",
  "Plus Size",
];
const HairLength = [
  "Bald ",
  "Super short",
  "Short",
  "Chin length",
  "Shoulder length",
  "Below shoulders",
  "Mid back",
  "Ass length",
  "Super long",
];
const HairColor = ["Bleached", "Blonde", "Brown", "Black", "Red", "Other"];
const HairStyle = ["Straight", "Some curls", "Curly", "Permed", "Other"];
const Eyes = ["Blue", "Brown", "Green", "Hazel", "Grey", "Black"];

const Weight = [
  "45kg / 99lbs or less",
  "46-50kg / 101-110 lbs",
  "51- 55kg / 112-121 lbs",
  "56-60kg / 123-132 lbs",
  "61-65kg / 134-143 lbs",
  "66-70kg / 146- 154 lbs",
  "71-90kg / 157 - 198 lbs",
  "91- 110kg / 201- 243 lbs",
  "111 / 245 lbs  and Over",
];
const PubicHair = ["Natural", "Partially shaved", "Shaved"];
const Piercings = [
  "None",
  "Tongue",
  "Breasts",
  "Belly button",
  "Pussy",
  "Face Tongue",
  "Tongue and breasts",
  "Breasts Tongue",
  "Pussy Breast",
  "Pussy Other",
];
const BreastAppearance = [
  "Flat",
  "Average",
  "Youthful",
  "Perky",
  "Rock hard",
  "Super nice",
  "Droopy",
  "Really saggy",
  "Unattractive",
  "Unnatural",
];
const BreastSize = ["A", "B", "C", "D", "DD", "DDD", "E or higher"];
const BreastType = ["Natural", "Augmented (Implants)"];
const Tattoos = ["None", "One", "A few", "Many", "Many"];
const DickSize = [
  "10cm / 3.94 inches",
  "11cm / 4.33 inches",
  "12cm / 4.72 inches",
  "13cm / 5.12 inches",
  "14cm / 5.51 inches",
  "15cm / 5.91 inches",
  "16cm / 6.30 inches",
  "17cm / 6.69 inches",
  "18cm / 7.09 inches",
  "19cm / 7.48 inches",
  "20cm / 7.87 inches",
  "21cm / 8.27 inches",
  "22cm / 8.66 inches",
  "23cm / 9.06 inches",
];

export default function AdvancedSearch() {
  const { state: InquiryData } = useLocation();

  const dispatch = useDispatch();
  const AdvanceServices = useSelector(
    (state) => state.AdvanceServices.services
  );
  const [options, setOptions] = useState(
    InquiryData?.EditData?.advancedservices || []
  );
  // Clone InquiryData and its properties
  const updatedInquiryData = { ...InquiryData };
  // Assign the value to the property
  updatedInquiryData.AllData.advancedservices = options;

  const [open, setOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);
  const [optionData, setOptionDate] = useState({});
  console.log(
    "🚀 ~ file: AdvancedSearch.jsx:168 ~ AdvancedSearch ~ optionData:",
    optionData
  );

  const [heightOptions, setHeightOptions] = useState([]);

  // useEffect(() => {
  //   dispatch(HandleAdvancedSelectServices([]));
  // }, []);
  const HandleOption = (event) => {
    setOptionDate({ ...optionData, [event.target.name]: event.target.value });
  };
  const handleTraditionalToggle = (massage) => {
    if (options.includes(massage)) {
      setOptions(options.filter((item) => item !== massage));
      dispatch(
        HandleAdvancedSelectServices(
          AdvanceServices.filter((item) => item !== massage)
        )
      );
    } else {
      setOptions([...options, massage]);
      dispatch(HandleAdvancedSelectServices([...AdvanceServices, massage]));
    }
  };

  const HandleReviewButton = (event) => {
    updatedInquiryData.AllData.favoriteStatus = event ? true : false;
    if (InquiryData.AllData.inquiry === "Invitation") {
      setOpen(true);
    } else {
      setsearchOpen(true);
    }
  };

  const HandleSubmitButton = () => {
    setsearchOpen(true);
  };

  useMemo(() => {
    if (InquiryData.AllData.gender === "Male") {
      setHeightOptions([
        "5'0\" - 5'5\"",
        "5'5\" - 5'8\"",
        "5'9\" - 5'11\"",
        "6'0\" - 6'2\"",
        "6'3\" - 6'5\"",
        "6'5\" or 6'7\"",
        "6'8\" or taller",
      ]);
    } else {
      setHeightOptions([
        "4'9\" - 4'11\"",
        "5'0\" - 5'2\"",
        "5'3\" - 5'5\"",
        "5'6\" - 5'8\"",
        "5'9\" - 5'11\"",
        "6'0\" - 6'2\"",
        "6'3\" - 6'5\"",
        "6'5\" or Taller",
      ]);
    }
    updatedInquiryData.AllData.build = optionData?.build;
    updatedInquiryData.AllData.height = optionData?.height;
    updatedInquiryData.AllData.eyescolor = optionData?.eyescolor;
    updatedInquiryData.AllData.haircolor = optionData?.haircolor;
    updatedInquiryData.AllData.hairlength = optionData?.hairlength;
    updatedInquiryData.AllData.weight = optionData?.weight;
    updatedInquiryData.AllData.piercings = optionData?.piercings;
    updatedInquiryData.AllData.publichair = optionData?.publichair;
    updatedInquiryData.AllData.breastappearance = optionData?.breastappearance;
    updatedInquiryData.AllData.breasttype = optionData?.breasttype;
    updatedInquiryData.AllData.breastsize = optionData?.breastsize;
    updatedInquiryData.AllData.dicksize = optionData?.dicksize;
    updatedInquiryData.AllData.tattoos = optionData?.tattoos;
  }, [InquiryData.AllData, optionData]);

  console.log(InquiryData.AllData, "InquiryDataInquiryData");
  return (
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Advanced Search"} />
      </div>
      <div className="w-full">
        {/* {InquiryData?.state?.title === "Escort" && (
          <p className="text-[30px] md:text-[33px] text-center text-[#040B47] font-roboto-serif font-bold">
            {InquiryData?.state?.title}
          </p>
        )} */}
        {InquiryData?.state?.title === "Massage" && (
          <>
            <div className="text-white text-[20px] font-medium text-center">
              {InquiryData?.state?.title}
            </div>
            <div className="w-full mx-auto flex items-center justify-center">
              <span className="text-white sm:text-[18px] text-[16px] font-medium text-center my-[24px]">
                Traditional Massage
              </span>
            </div>
            <div className="grid grid-cols-2 sm:gap-[24px] gap-[10px]">
              {traditionalMassage?.map((item) => (
                <div
                  key={item}
                  className={` cursor-pointer hover:bg-[#405FC4] ${options.includes(item) ? "bg-[#405FC4]" : "bg-[#FFFFFF14]"} rounded-lg flex flex-row items-center justify-center sm:px-4 px-[12px] py-[12px] relative`}
                  onClick={() => handleTraditionalToggle(item)}
                >
                  <span className="font-normal text-[14px] text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full mx-auto flex items-center justify-center">
              <span className="text-white sm:text-[18px] text-[16px] font-medium text-center my-[24px]">
                Sensual Massage
              </span>
            </div>
            <div className="grid grid-cols-2 sm:gap-[24px] gap-[10px]">
              {sensualMassage?.map((item) => (
                <div
                  key={item}
                  className={` cursor-pointer hover:bg-[#405FC4] ${options.includes(item) ? "bg-[#405FC4]" : "bg-[#FFFFFF14]"} rounded-lg flex flex-row items-center justify-center sm:px-4 px-[12px] py-[12px] relative`}
                  onClick={() => handleTraditionalToggle(item)}
                >
                  <span className="font-normal text-[14px] text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full mx-auto flex items-center justify-center">
              <span className="text-white sm:text-[18px] text-[16px] font-medium text-center my-[24px]">
                Release
              </span>
            </div>
            <div className="grid grid-cols-2 sm:gap-[24px] gap-[10px]">
              {release?.map((item) => (
                <div
                  key={item}
                  className={` cursor-pointer hover:bg-[#405FC4] ${options.includes(item) ? "bg-[#405FC4]" : "bg-[#FFFFFF14]"} rounded-lg flex flex-row items-center justify-center sm:px-4 px-[12px] py-[12px] relative`}
                  onClick={() => handleTraditionalToggle(item)}
                >
                  <span className="font-normal text-[14px] text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        {InquiryData?.state?.title?.startsWith("Dancer") && (
          <>
            <div className="text-white text-[20px] font-medium text-center mt-[24px]">
              {InquiryData?.state?.title}
            </div>
            <div className="w-full mx-auto flex items-center justify-center">
              <span className="text-white sm:text-[18px] text-[16px] font-medium text-center my-[24px]">
                Type of Event
              </span>
            </div>
            <div className="grid grid-cols-2 sm:gap-[24px] gap-[10px]">
              {typeOfEvent.map((item) => (
                <div
                  key={item}
                  className={` cursor-pointer hover:bg-[#405FC4] ${options.includes(item) ? "bg-[#405FC4]" : "bg-[#FFFFFF14]"} rounded-lg flex flex-row items-center justify-center sm:px-4 px-[12px] py-[12px] relative`}
                  onClick={() => handleTraditionalToggle(item)}
                >
                  <span className="font-normal text-[14px] text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {(true || InquiryData?.state?.title === "Escort") && (
          <div className="w-full">
            <div className="text-white sm:text-[18px] text-[16px] font-medium text-center my-[24px]">
              Personal Appearance
            </div>
            <div className="grid grid-cols-2 sm:gap-[24px] gap-[10px]">
              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="build"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Build
                  </option>
                  {Build.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="height"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Height
                  </option>
                  {heightOptions.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="eyescolor"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Eyes Color
                  </option>
                  {Eyes.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

              </div>
              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="hairtype"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Hair Type
                  </option>
                  {HairStyle.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

              </div>

              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="haircolor"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Hair Color
                  </option>
                  {HairColor.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

              </div>
              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="hairlength"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Hair Length
                  </option>
                  {HairLength.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

              </div>
              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="weight"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Weight
                  </option>
                  {Weight.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

              </div>
              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="publichair"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Public Hair
                  </option>
                  {PubicHair.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

              </div>
              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="piercings"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Piercings
                  </option>
                  {Piercings.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

              </div>
              {
                (InquiryData.AllData.gender === "Female" || InquiryData.AllData.gender?.startsWith("Trans")) &&
                <div className="relative w-full">
                  <select
                    className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                    name="breasttype"
                    onChange={HandleOption}
                  >
                    <option selected disabled>
                      Breast Type
                    </option>
                    {BreastType.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

                </div>
              }

              {
                (InquiryData.AllData.gender === "Female" || InquiryData.AllData.gender?.startsWith("Trans")) &&
                <div className="relative w-full">
                  <select
                    className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                    name="breastappearance"
                    onChange={HandleOption}
                  >
                    <option selected disabled>
                      Breast Appearance
                    </option>
                    {BreastAppearance.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

                </div>
              }

              {
                (InquiryData.AllData.gender === "Female" || InquiryData.AllData.gender?.startsWith("Trans")) &&
                <div className="relative w-full">
                  <select
                    className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                    name="breastsize"
                    onChange={HandleOption}
                  >
                    <option selected disabled>
                      Breast Size
                    </option>
                    {BreastSize.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

                </div>
              }

              {
                (InquiryData.AllData.gender === "Male" || InquiryData.AllData.gender?.startsWith("Trans")) &&
                <div className="relative w-full">
                  <select
                    className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                    name="dicksize"
                    onChange={HandleOption}
                  >
                    <option selected disabled>
                      Dick Size
                    </option>
                    {DickSize.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

                </div>
              }

              <div className="relative w-full">
                <select
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                  name="tattoos"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Tattoos
                  </option>
                  {Tattoos.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
            </div>
          </div>
        )}

        <div className="text-white sm:text-[18px] text-[16px] font-medium text-center my-[24px]">
          Sensual Services
        </div>
        <div className="grid grid-cols-2 sm:gap-[24px] gap-[10px]">
          {SensualServices.map((item) => (
            <div
              key={item}
              className={` cursor-pointer hover:bg-[#405FC4] ${options.includes(item) ? "bg-[#405FC4]" : "bg-[#FFFFFF14]"} rounded-lg flex flex-row items-center justify-center sm:px-4 px-[12px] py-[12px] relative`}
              onClick={() => handleTraditionalToggle(item)}
            >
              <span className="font-normal text-[14px] text-white">
                {item}
              </span>
            </div>
          ))}
        </div>
        <div className="max-w-[500px] mx-auto my-[24px]">
          <Button
            text={"Search"}
            onClick={() => HandleReviewButton(true)}
          />
          {/* <div className=" items-center justify-center w-full pb-4">
            <Button
              className={
                "flex items-center w-fit mt-4 py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[20px] rounded-xl shadow-[0px_9px_20px_rgba(0,0,0,0.5)]"
              }
              text={"Review and Submit"}
              size="45px"
              onClick={() => HandleReviewButton(false)}
            />
          </div> */}
        </div>
      </div>
      <MarketPlaceModale
        open={open}
        setOpen={setOpen}
        setsearchOpen={setsearchOpen}
        searchOpen={searchOpen}
        AllData={InquiryData.AllData}
        EditData={InquiryData?.EditData}
        state={InquiryData?.state}
      />
    </div>
  );
}
