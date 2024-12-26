import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useState } from "react";

const Catagory = [
  "Escort",
  "Massage",
  "Dancer / Strip Club",
  "Life style Clubs",
  "Adult Stores/toys",
  "Adult Forums",
  "Organizations",
];
export default function Community() {
  const navigate = useNavigate();
  const [specialtyOption, setSpecialtyOption] = useState([]);
  const [selectedSpecialtyOption, setSelectedSpecialtyOption] = useState("");
  const [type, setType] = useState([]);
  const [selectedCatagory, setSelectedCatagory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [error, setError] = useState({});

  const HandelCatagory = (event) => {
    if (event === "Escort") {
      setType(["Independant", "Agency"]);
    } else if (event === "Massage") {
      setType(["Independant", "Agency", "Massage Parlor"]);
    } else if (event?.startsWith("Dancer")) {
      setType(["Independant", "Agency", "Strip Club"]);
    } else if (event?.startsWith("Life")) {
      setType([
        "Swingers Lifestyle",
        "Gay Lifestyle",
        "Lesbian Lifestyle",
        "Trans Lifestyle",
      ]);
      setSelectedType("Swingers Lifestyle");
      HandleSpecialtyOption("Swingers Lifestyle");
    } else if (event === "Adult Stores/toys") {
      setType(["Online", "Local"]);
      setSelectedType("Online");
      HandleSpecialtyOption("Online");
    } else if (event === "Adult Forums") {
      setType(["Infiuencer", "Forums"]);
      setSelectedType("Infiuencer");
      HandleSpecialtyOption("Infiuencer");
    } else {
      setType([
        "Charitable Organizations",
        "Educational Organizations",
        "Research Organizations",
        "Advocary Groups",
        "Professional Associations",
      ]);
    }
    setSelectedCatagory(event);
  };
  const HandleSpecialtyOption = (type) => {
    if (type === "Swingers Lifestyle") {
      setSpecialtyOption([
        "Swingers Clubs or Lifestyle Clubs",
        "Swingers Resorts and Hotels",
        "Swingers Parties or House Parties",
        "Swingers Cruises",
        "Swingers Campgrounds",
        "Lifestyle Conventions and Takeovers",
        "Swingers Websites and Online",
        "Communities",
        "Swingers Bars or Meet and Greets",
        "Swinger-Friendly Travel Agencies",
        "Swingers Workshops and Seminars",
      ]);
    } else if (type === "Gay Lifestyle") {
      setSpecialtyOption([
        "Gay Bathhouses/Saunas",
        "Gay Bars & Clubs",
        "Gay Resorts",
        "Gay Bookstores",
        "Gay Cafés",
        "LGBTQ+ Community Centers",
        "Gay Beaches",
        "LGBTQ+ Film Festivals",
        "Gay Pride Parades and Festivals",
        "Gay Bed and Breakfasts/Hotels",
      ]);
    } else if (type === "Lesbian Lifestyle") {
      setSpecialtyOption([
        "Lesbian Bars & Clubs",
        "Lesbian Bookstores",
        "Women's Music Festivals",
        "Lesbian Cafés",
        "Women's Retreats and Resorts",
        "Lesbian Film Festivals",
        "Lesbian Pride Events and Parades",
        "Women-Only Dance Parties",
        "Lesbian Bed and Breakfasts/Hotels",
        "Lesbian Community Centers",
      ]);
    } else if (type === "Trans Lifestyle") {
      setSpecialtyOption([
        "Trans Bars & Clubs",
        "Trans-specific Medical Clinics and Health Centers",
        "Trans Pride Events and Parades",
        "Trans Conferences and Workshops",
        "Trans-friendly Clothing Stores and Boutiques",
        "Trans Film Festivals",
        "Trans Bookstores and Literature Events",
        "Trans Beauty Salons and Services",
      ]);
    } else if (type === "Online" || type === "Local") {
      setSpecialtyOption([
        "General Adult Stores",
        "Boutique Adult Stores",
        "Lingerie and Apparel Stores",
        "LGBTQ ",
        "Fetish and BDSM Stores",
        "Couples-Focused Stores",
        "Book/Video",
      ]);
    } else if (type === "Infiuencer") {
      setSpecialtyOption([
        "Instagram",
        "YouTube",
        "Blogs",
        "Twitter",
        "OnlyFans",
        "Snapchat",
        "TikTok",
        "Patreon",
        "Reddit Podcasts",
        "Websites & Personal Blogs",
      ]);
    } else if (type === "Forums") {
      setSpecialtyOption([
        "Gay",
        "Lesbian",
        "Sex Workers",
        "Transgender",
        "Bisexual",
        "Kink/BDSM Community",
      ]);
    } else {
      setSpecialtyOption([
        "Gay",
        "Lesbian",
        "Sex Workers",
        "Transgender",
        "Bisexual",
        "Kink/BDSM Community",
      ]);
    }
  };

  const HandleButton = () => {
    const body = {
      address: "",
      phone: "",
      catagory: selectedCatagory,
      type: selectedType,
      typespecialty: selectedSpecialtyOption,
    };
    const validationErrors = {};
    if (!selectedCatagory) {
      validationErrors.selectedCatagory = "Catagory is required";
    }
    if (!selectedType) {
      validationErrors.selectedType = "Type is required";
    }
    if (!selectedSpecialtyOption) {
      validationErrors.selectedSpecialtyOption = "Specialty is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return; // Prevent form submission if there are errors
    }

    // Clear any previous errors
    setError({});
    navigate("/business/tellus", { state: body });
  };
  return (
    <div>
      <div className="main-container justify-center">
        <div className="form-field-container w-full">
          <div className="relative top-6">
            <span className="font-bold text-[27px] font-robotot-700">
              Help our community find you
            </span>
          </div>
          <div className="relative mt-12">
            <span
              style={{ fontFamily: "Roboto Serif" }}
              className="font-bold font-robotot-700 max-w-xl text-[27px] text-center"
            >
              Tell us about your <br /> Business
            </span>
          </div>
        </div>

        <div className="form-field-container w-full">
          <div className=" mt-8 relative rounded-3xl flex justify-center items-center w-full h-[52px]">
            <select
              className="px-3 text-[22px] h-[50px] border-2 rounded-xl bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] text-white appearance-none w-full font-bold focus:outline-none"
              name="build"
              onChange={(event) => HandelCatagory(event.target.value)}
            >
              <option selected disabled>
                Select a Catagory
              </option>
              {Catagory?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute top-4 right-2">
              <svg
                className={`w-6 h-6 fill-current text-white`}
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
              </svg>
            </div>
          </div>
          {error.selectedCatagory && (
            <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
              {error.selectedCatagory}
            </label>
          )}
          <div className="mt-[30px] relative rounded-3xl flex justify-center items-center w-full h-[52px]">
            <select
              className="px-3 text-[22px] h-[50px] border-2 rounded-xl bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] text-white appearance-none w-full font-bold focus:outline-none"
              name="build"
              onChange={(e) => {
                HandleSpecialtyOption(e.target.value);
                setSelectedType(e.target.value);
              }}
            >
              <option selected disabled>
                Select a Type
              </option>
              {type?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute top-4 right-2">
              <svg
                className={`w-6 h-6 fill-current text-white`}
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
              </svg>
            </div>
          </div>
          {error.selectedType && (
            <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
              {error.selectedType}
            </label>
          )}
          <div className="mt-[30px] relative rounded-3xl flex justify-center items-center w-full h-[52px]">
            <select
              className="px-3 text-[22px] h-[50px] border-2 rounded-xl bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] text-white appearance-none w-full font-bold focus:outline-none"
              name="build"
              onChange={(e) => setSelectedSpecialtyOption(e.target.value)}
            >
              <option selected disabled>
                Select a Specialty
              </option>
              {specialtyOption?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute top-4 right-2">
              <svg
                className={`w-6 h-6 fill-current text-white`}
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
              </svg>
            </div>
          </div>
          {error.selectedSpecialtyOption && (
            <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
              {error.selectedSpecialtyOption}
            </label>
          )}
          <div className="mt-6 w-full form-field-container">
            <Button
              className={
                "bg-gradient-to-b w-full mb-8 from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold shadow-2xl"
              }
              text={"Next"}
              size={"45px"}
              onClick={HandleButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
