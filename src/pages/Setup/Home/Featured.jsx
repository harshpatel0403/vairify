import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";
import Carousel2 from "../../../components/Carousel-2/Carousel-2";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleGetAllPost,
  HandleLikePost,
} from "../../../redux/action/MarketplaceSearch";
import BaseAPI from "../../../BaseAPI";
import { toast } from "react-toastify";
import { CardPlacehoderSkeleton } from "../../../components/CardPlacehoderSkeleton";

const vairipayOptions = [
  { img: "images/fe (1).png", dis: "Lexi 57I90H7" },
  { img: "images/fe (2).png", dis: "Lexi 57I90H7" },
  { img: "images/fe (3).png", dis: "Lexi 57I90H7" },
  { img: "images/fe (4).png", dis: "Lexi 57I90H7" },
  { img: "images/fe (5).png", dis: "Lexi 57I90H7" },
  { img: "images/fe (6).png", dis: "Lexi 57I90H7" },
  { img: "images/fe (7).png", dis: "Lexi 57I90H7" },
  { img: "images/fe (8).png", dis: "Lexi 57I90H7" },
];
const tabsCode = Object.freeze({
  live: "LIVE",
  local: "LOCAL",
  marketplace: "MARKETPLACE",
});
const tabs = [
  { id: 1, name: "Live feed", icon: "", current: false, code: tabsCode.live },
  {
    id: 2,
    name: "Local Posts",
    icon: "",
    current: false,
    code: tabsCode.local,
  },
  {
    id: 3,
    name: "Marketplace",
    icon: "/images/marketplace-icon.png",
    current: false,
    code: tabsCode.marketplace,
  },
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

const businesstype = [
  "All",
  "Escort",
  "Massage",
  "Dancer",
  "Lifestyle",
  "Stores",
  "Organizations",
  "Adult Forums",
];
const gender = [
  "Male",
  "Female",
  "Trans Male (Pre-Op)",
  "Trans Female (Pre-Op)",
  "Trans Male (Post-Op)",
  "Trans Female (Post-Op)",
];

const swingers = [
  "Swingers Lifstyle",
  "Gay Lifesytle",
  "Lesbian Lifesytle",
  "Trans Lifesytle",
];

const store = ["Online", "Local"];

const organizations = ["M4W", "M4M", "Bisexual"];

const Adultforums = ["Influencer", "Forums"];
// ];
function classNames(...classes) {
  return classes?.filter(Boolean).join(" ");
}
const Featured = () => {
  const todayDate = new Date();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  console.log("userdetails", UserDetails);
  const ladyData = useSelector((state) => state.Market.getAllPost);
  const [selectedTab, setSelectedTab] = useState(tabsCode.local);
  const [selectedGrid, setSelectedGrid] = useState(1);
  const [lifestyleoptions, setLifestyleOptions] = useState([]);
  const [storeoptions, setStoreOptions] = useState([]);
  const [organizationoptions, setOrganizationOptions] = useState([]);
  const [Forumoptions, setForumOptions] = useState([]);
  const [isDropdownOpenSelectedOption, setIsDropdownOpenSelectedOption] =
    useState(false);
  const [isDropdownOpenGender, setIsDropdownOpenGender] = useState(false);
  const [isDropdownOpenLifestyle, setIsDropdownOpenLifestyle] = useState(false);
  const [isDropdownOpenOrientation, setIsDropdownOpenOrientation] =
    useState(false);
  const [isDropdownOpenResorts, setIsDropdownOpenResorts] = useState(false);
  const [isDropdownOpenStore, setIsDropdownOpenStore] = useState(false);
  const [isDropdownOpenFetish, setIsDropdownOpenFetish] = useState(false);
  const [isDropdownOpenWorder, setIsDropdownOpenWorker] = useState(false);
  const [isDropdownOpenAdvocacy, setIsDropdownOpenAdvocacy] = useState(false);
  const [orientationOptions, setOrientationOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    businesstype: "All",
    orientation: "",
    gender: "",
    swingers: "",
    resorts: "",
    store: "",
    fetish: "",
    advocacy: "",
    worker: "",
    Fourms: "",
  });

  useEffect(() => {
    dispatch(HandleGetAllPost());
  }, []);

  const handelerDropdown = (value, type) => {
    if (type == "businesstype") {
      setSelectedOption({ ...selectedOption, businesstype: value });
    } else if (type == "gender") {
      setSelectedOption({ ...selectedOption, gender: value });
    } else if (type == "orientation") {
      setSelectedOption({ ...selectedOption, orientation: value });
    } else if (type == "swingers") {
      setSelectedOption({ ...selectedOption, swingers: value });
    } else if (type == "resorts") {
      setSelectedOption({ ...selectedOption, resorts: value });
    } else if (type == "fetish") {
      setSelectedOption({ ...selectedOption, fetish: value });
    } else if (type == "advocacy") {
      setSelectedOption({ ...selectedOption, advocacy: value });
    } else if (type == "worker") {
      setSelectedOption({ ...selectedOption, worker: value });
    }
  };

  const HandleLike = async (id) => {
    const body = {
      userId: UserDetails?._id,
    };
    await dispatch(HandleLikePost(id, body));
    dispatch(HandleGetAllPost());
  };
  const updateOrientationOptions = (selectedGender) => {
    if (selectedGender === "Male") {
      setOrientationOptions(["M4W", "M4M", "Bisexual"]);
    } else if (selectedGender === "Female") {
      setOrientationOptions(["W4M", "W4W", "Bisexual"]);
    } else if (selectedGender.startsWith("Trans")) {
      setOrientationOptions(["T4W", "T4M", "Bisexual"]);
    } else {
      setOrientationOptions([]);
    }
  };
  const HandleOption = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSelectedOption({ ...selectedOption, [name]: value });
  };

  const handleTabSwitch = (tabDetails) => {
    setSelectedTab(tabDetails.code);
    tabDetails.code === tabsCode.marketplace && navigate("/marketplace");
  };

  // for LifeStyle
  const Updatelifesytleoptions = (Selectedlifestyle) => {
    if (Selectedlifestyle === "Swingers Lifestyle") {
      setLifestyleOptions([
        "Swingers Clubs or Lifestyle Clubs",
        "Swingers Resorts or hotels",
        "Swingers Parties or House Parties",
        "Swingers Cruises",
        "Swingers Campgrounds",
        "Lifestyle Conventions and Takeover",
        "Swingers Websites and Online",
        "Communities",
      ]);
    } else if (Selectedlifestyle === "Gay Lifestyle") {
      setLifestyleOptions([
        "Gay Bathhouse/Saunas",
        "Gay Bars&Clubs",
        "Gay Resorts",
        "Gay Bookstores",
        "Gay Cafes",
        "LGBTQ+ Community Centers",
        "Gay Beaches",
        "LGBTQ+ Flim Festivals",
      ]);
    } else if (Selectedlifestyle === "Lesbian Lifestyle") {
      setLifestyleOptions([
        "Lesbian Bars & Clubs",
        "Lesbian Bookstores",
        "Women's Music Festivals",
        "Lesbian Cafes",
        "Women's Retreats and Resorts",
        "Lesbian Flim Festivals",
        "Lesbian Pride Events and Prades",
        "Women-Only Dance Parties",
      ]);
    } else if (Selectedlifestyle === "Trans Lifestyle") {
      setLifestyleOptions([
        "Trans Bars & Clubs",
        "Trans-specific Medical Clinics and Health Centers",
        "Trans Pride Events and Parades",
        "Trans Conferences and Workshops",
        "Trans-friendly Clothing Stores and Boutiques",
        "Trans Film Festivals",
        "Trans Bookstores and Literature Events",
        "Trans Beauty Salons and Services",
      ]);
    } else {
      setLifestyleOptions([]);
    }
  };

  // for store
  const Updatestoreoptions = (SelectedStore) => {
    if (SelectedStore === "Online") {
      setStoreOptions([
        "General Adult Stores",
        "Boutique Adult Stores",
        "Lingerie and Apparel Stores",
        "LGBTQ ",
        "Fetish and BDSM Stores",
        "Couples-Focused Stores",
        "Book/Video",
      ]);
    } else if (SelectedStore === "Local") {
      setStoreOptions([
        "General Adult Stores",
        "Boutique Adult Stores",
        "Lingerie and Apparel Stores",
        "LGBTQ ",
        "Fetish and BDSM Stores",
        "Couples-Focused Stores",
        "Book/Video",
      ]);
    } else {
      setStoreOptions([]);
    }
  };

  // for organizations
  const Updateorganizations = (SelectedOrganizations) => {
    if (SelectedOrganizations === "Online") {
      setOrganizationOptions([
        "General Adult Stores",
        "Boutique Adult Stores",
        "Lingerie and Apparel Stores",
        "LGBTQ ",
        "Fetish and BDSM Stores",
        "Couples-Focused Stores",
        "Book/Video",
      ]);
    } else if (SelectedOrganizations === "Local") {
      setOrganizationOptions([
        "General Adult Stores",
        "Boutique Adult Stores",
        "Lingerie and Apparel Stores",
        "LGBTQ ",
        "Fetish and BDSM Stores",
        "Couples-Focused Stores",
        "Book/Video",
      ]);
    } else {
      setOrganizationOptions([]);
    }
  };

  // for forums

  const Updateadultforums = (SelectedAdultforums) => {
    if (SelectedAdultforums === "Influencer") {
      setForumOptions([
        "Instagram",
        "YouTube",
        "Blogs",
        "LGBTQ ",
        "Twitter",
        "OnlyFans",
        "Snapchat",
        "TikTok",
        "Patreon",
        "Reddit Podcasts",
        "Websites & Personal Blogs",
      ]);
    } else if (SelectedAdultforums === "Forums") {
      setForumOptions([
        "Gay",
        "Lesbian",
        "Sex Workers",
        "LGBTQ ",
        "Transgender",
        "Bisexual",
        "Kink/BDSM Community",
      ]);
    } else {
      setForumOptions([]);
    }
  };

  // Filter the ladyData array based on selected values
  const filteredData = ladyData?.filter((item) => {
    if (selectedOption.businesstype === "Dancer") {
      selectedOption.businesstype = "Dancer";
    }
    const serviceData = item?.serviceData || [];

    if (
      (selectedOption.businesstype === "All" ||
        serviceData?.some((type) =>
          type
            .toLowerCase()
            .includes(selectedOption?.businesstype.toLowerCase())
        )) &&
      (selectedOption?.gender === "" ||
        item.gender === selectedOption?.gender) &&
      (selectedOption?.orientation === "" ||
        item.orientation === selectedOption?.orientation)
    ) {
      return true;
    }
    return false;
  });
  const filteredLadyData =
    selectedTab === tabsCode.live
      ? filteredData?.filter(
        (item) =>
          new Date(item.createdAt).toDateString() === todayDate.toDateString()
      )
      : filteredData;

  useMemo(() => {
    if (selectedOption.businesstype === "All") {
      setSelectedOption({
        businesstype: "All",
        orientation: "",
        gender: "",
        swingers: "",
        resorts: "",
        store: "",
        fetish: "",
        advocacy: "",
        worker: "",
        Fourms: "",
      });
    }
  }, [selectedOption?.businesstype]);

  const handleRequestVairidate = (selectedItem) => {
    navigate(`/varidate/select-date/${selectedItem?.userId?._id}`);
  };

  return (
    <div className="main-content relative rounded-2xl overflow-hidden bg-[#D5D6E0] min-h-[640px]">
      <div className="bg-[#D5D6E0] absolute left-[50%] translate-x-[-50%] -top-[25px] w-[92px] rounded-t-[10px]">
        <span className="font-roboto text-[#02227E] font-[800] text-[16px]">
          Featured
        </span>
      </div>
      <Carousel2 images={vairipayOptions} admin={"true"} vairipay={"false"} />
      <div className="block px-2">
        <div className="border-b border-[#02227E]/[58%]">
          <nav
            className="-mb-[3px] flex  justify-around space-x-4 md:justify-center overflow-auto scroll-hide"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <button
                onClick={() => handleTabSwitch(tab)}
                key={tab.id}
                className={classNames(
                  selectedTab === tab.code
                    ? "border-[#040C50]/[40%] "
                    : "border-transparent  hover:border-[#040C50]/[40%] ",
                  "whitespace-nowrap flex items-center judtify-center gap-px font-roboto-serif font-bold text-[#02227E] border-b-[5px]  px-1 text-[12px]"
                )}
              >
                {!!tab.icon && <img src={tab.icon} />}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mt-px ">
          <div className="flex items-center min-w-0">
            <div className="flex gap-2 pr-4 overflow-scroll">
              <div>
                <button
                  onClick={() => {
                    setIsDropdownOpenSelectedOption(
                      !isDropdownOpenSelectedOption
                    );
                  }}
                  className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                >
                  <div className="relative flex items-center justify-between mx-2">
                    <div>{selectedOption.businesstype}</div>
                    <div className="">
                      <svg
                        className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </div>
                </button>
                {isDropdownOpenSelectedOption && (
                  <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                    {businesstype.map((items) => {
                      return (
                        <span
                          key={items}
                          onClick={() => {
                            handelerDropdown(items, "businesstype");
                            setIsDropdownOpenSelectedOption(false);
                          }}
                          href="#"
                          className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                        >
                          {items}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              {selectedOption.businesstype === "Escort" ||
                selectedOption.businesstype === "Massage" ||
                selectedOption.businesstype === "Dancer" ? (
                <>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenGender(!isDropdownOpenGender);
                      }}
                      className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption?.gender?.length == 0
                            ? "Gender"
                            : selectedOption.gender}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenGender && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {gender?.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "gender");
                                setIsDropdownOpenGender(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenOrientation(
                          !isDropdownOpenOrientation
                        );
                      }}
                      className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption?.orientation?.length == 0
                            ? "Orientation"
                            : selectedOption.orientation}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenOrientation && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {organizations?.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "orientation");
                                setIsDropdownOpenOrientation(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : selectedOption.businesstype === "Lifestyle" ? (
                <>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenLifestyle(!isDropdownOpenLifestyle);
                      }}
                      className="relative w-[115px] md:w-[180px] text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption?.swingers?.length == 0
                            ? "Swingers"
                            : selectedOption.swingers}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenLifestyle && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {swingers?.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "swingers");
                                setIsDropdownOpenLifestyle(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenResorts(!isDropdownOpenResorts);
                      }}
                      className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption.resorts.length == 0
                            ? "Resorts"
                            : selectedOption.resorts}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenResorts && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {lifestyleoptions.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "resorts");
                                setIsDropdownOpenResorts(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : selectedOption.businesstype === "Stores" ? (
                <>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenStore(!isDropdownOpenStore);
                      }}
                      className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption.store.length == 0
                            ? "Store"
                            : selectedOption.store}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenStore && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {store.map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "store");
                                setIsDropdownOpenStore(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenFetish(!isDropdownOpenFetish);
                      }}
                      className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption.fetish.length == 0
                            ? "Fetish"
                            : selectedOption.fetish}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenFetish && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {[].map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "fetish");
                                setIsDropdownOpenFetish(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : selectedOption.businesstype === "Organizations" ? (
                <>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenAdvocacy(!isDropdownOpenAdvocacy);
                      }}
                      className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption.advocacy.length == 0
                            ? "Advocacy"
                            : selectedOption.advocacy}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenAdvocacy && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {organizations.map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "advocacy");
                                setIsDropdownOpenAdvocacy(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenWorker(!isDropdownOpenWorder);
                      }}
                      className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption.worker.length == 0
                            ? "sex worker"
                            : selectedOption.worker}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenWorder && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {["sex worker"].map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "worker");
                                setIsDropdownOpenWorker(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : selectedOption.businesstype === "Adult Forums" ? (
                <>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenAdvocacy(!isDropdownOpenAdvocacy);
                      }}
                      className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption.advocacy.length == 0
                            ? "Advocacy"
                            : selectedOption.advocacy}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenAdvocacy && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {organizations.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "advocacy");
                                setIsDropdownOpenAdvocacy(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setIsDropdownOpenWorker(!isDropdownOpenWorder);
                      }}
                      className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer appearance-none px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
                    >
                      <div className="relative flex items-center justify-between mx-2">
                        <div>
                          {selectedOption.worker.length == 0
                            ? "sex worker"
                            : selectedOption.worker}
                        </div>
                        <div className="">
                          <svg
                            className={`w-4 md:w-6 h-5 md:h6 fill-current text-white`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {isDropdownOpenWorder && (
                      <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
                        {["sexWorker"].map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "worker");
                                setIsDropdownOpenWorker(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-bold text-[#02227E] cursor-pointer"
                            >
                              {items}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="border-slate-500 drop-shadow-lg border-e border-solid h-[48px] ms-auto" />
          <div className="flex items-center ps-3">
            <button
              onClick={() => setSelectedGrid(1)}
              className={classNames(
                selectedGrid === 1
                  ? "border bg-[#02227E]/[32%] border-[#02227E]"
                  : "",
                "flex items-center justify-center w-[40px] h-[35px]"
              )}
            >
              <img src="/images/grid-list.svg" />
            </button>
            <button
              onClick={() => setSelectedGrid(2)}
              className={classNames(
                selectedGrid === 2
                  ? "border bg-[#02227E]/[32%] border-[#02227E]"
                  : "",
                "flex items-center justify-center w-[40px] h-[35px]"
              )}
            >
              <img src="/images/grid-2.svg" />
            </button>
          </div>
        </div>
      </div>
      {/* <div
        className={classNames(
          selectedGrid === 2 ? "grid-cols-2" : "sm:grid-cols-1",
          " max-h-[calc(100vh_-_274px)] mb-2 overflow-auto grid mt-1.5  gap-2 pb-[50px] px-3 "
        )}
      > */}
      {filteredLadyData.length > 0
        ? filteredLadyData?.map((item, index) => {
          const likedByUser = item?.likes?.includes(UserDetails?._id);

          return (
            <div
              className={classNames(
                selectedGrid === 2 ? "grid-cols-2" : "sm:grid-cols-1",
                " max-h-[calc(100vh_-_274px)] mb-2 overflow-auto grid mt-1.5  gap-2 pb-[50px] px-3 "
              )}
            >
              <div
                key={index}
                className={classNames(
                  selectedGrid === 2 ? "rounded-[14px]" : "rounded-[30px]",
                  "bg-[#040C50]/[70%] py-1.5 md:max-w-[368px] w-full mx-auto "
                )}
              >
                <div
                  className={classNames(
                    selectedGrid === 2 ? "px-2" : " px-5",
                    "flex items-end"
                  )}
                >
                  <div className="flex items-center flex-1 gap-1 mb-1">
                    <img
                      // for dynamic
                      // <img
                      // src={
                      //   item?.userId?.profilePic
                      //     ? `${BaseAPI}/api/images/userprofile/${item?.userId?.profilePic}`
                      //     : `/images/Ellipse74.png`
                      // }

                      //
                      src={
                        item?.userId?.profilePic
                          ? `${import.meta.env
                            .VITE_APP_S3_IMAGE
                          }/${item?.userId?.profilePic}`
                          : item?.userId?.gender === "Male"
                            ? "/images/male.png"
                            : "/images/female.png"
                      }
                      // src={
                      //   item?.userId?.profilePic
                      //     ? `${import.meta.env
                      //       .VITE_APP_API_USERPROFILE_IMAGE_URL
                      //     }/${item?.userId?.profilePic}`
                      //     : item?.userId?.gender === "Male"
                      //       ? "/images/male.png"
                      //       : "/images/female.png"
                      // }
                      className={classNames(
                        selectedGrid === 2
                          ? "w-[14px] h-[14px] border"
                          : "w-[26px] h-[26px] border-[2px]",
                        "rounded-full  border-white"
                      )}
                    />
                    <div>
                      <h2
                        className={classNames(
                          selectedGrid === 2 ? "text-[6px]" : "text-[11px]",
                          " text-white font-bold font-roboto capitalize"
                        )}
                      >
                        {item?.userId?.name}
                      </h2>
                      <h2
                        className={classNames(
                          selectedGrid === 2 ? "text-[6px]" : "text-[11px]",
                          " text-white font-bold font-roboto"
                        )}
                      >
                        ID# {item?.userId?.vaiID}
                      </h2>
                      <div
                        className={classNames(
                          selectedGrid === 2 ? "gap-px" : "gap-1",
                          "flex items-center"
                        )}
                      >
                        {[0, 1, 2, 3, 4].map((rating, index) => (
                          <img
                            key={index}
                            src="/images/Star.svg"
                            className={classNames(
                              selectedGrid === 2
                                ? "w-[8px] h-[8px]"
                                : "w-[13px] h-[13px]"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={classNames(
                      selectedGrid === 2 ? "gap-1" : "gap-3",
                      "flex items-center mb-1 "
                    )}
                  >
                    <div
                      className="flex items-center gap-1"
                      onClick={() => HandleLike(item?._id)}
                    >
                      <span
                        className={classNames(
                          selectedGrid === 2 ? "text-[7px]" : "text-[11px]",
                          " text-white font-bold to"
                        )}
                      >
                        {item?.likes?.length}
                      </span>
                      <span
                        className={classNames(
                          selectedGrid === 2 ? "text-[7px]" : "text-[11px]",
                          " text-white font-bold to"
                        )}
                      >
                        {`Like${item?.likes?.length > 1 ? "s" : ""}`}
                      </span>
                      <img
                        src={
                          likedByUser
                            ? "/images/likes.png"
                            : "/images/like.svg"
                        }
                        className={classNames(
                          selectedGrid === 2 ? "w-[8px] h-[11px]" : "w-[22px]"
                        )}
                        alt={likedByUser ? "Liked" : "Like"}
                      />
                    </div>
                    <div
                      className="flex items-center gap-1"
                      onClick={() =>
                        navigate("/user/comments", {
                          state: item,
                        })
                      }
                    >
                      <span
                        className={classNames(
                          selectedGrid === 2 ? "text-[7px]" : "text-[11px]",
                          " text-white font-bold font-roboto"
                        )}
                      >
                        {item?.comments?.length}
                      </span>
                      <span
                        className={classNames(
                          selectedGrid === 2 ? "text-[7px]" : "text-[11px]",
                          " text-white font-bold font-roboto"
                        )}
                      >
                        {`Comment${item?.comments?.length > 1 ? "s" : ""}`}
                      </span>
                      <img
                        src="/images/Vector.png"
                        className={classNames(
                          selectedGrid === 2 ? "w-[10px] h-[11px]" : ""
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="px-px"
                  onClick={() =>
                    navigate("/user/details", {
                      state: item,
                    })
                  }
                >
                  <CardPlacehoderSkeleton
                    imageUrl={`${import.meta.env.VITE_APP_S3_IMAGE
                      }/${item?.image}`}
                    imageClassNames={classNames(
                      selectedGrid === 2
                        ? "rounded-[12px]"
                        : "rounded-[30px]",
                      " w-full mx-auto "
                    )}
                  />
                </div>

                <div className="mt-[5px]">
                  <h2
                    className={classNames(
                      selectedGrid === 2
                        ? "text-[8px] font-medium"
                        : "text-[15px] font-bold",
                      "text-white  mx-auto max-w-[300px]  sm:max-w-auto text-center "
                    )}
                  >
                    {item?.message === 'undefined' ? '' : item?.message}
                  </h2>
                </div>
                {UserDetails?._id === item?.userId?._id ? (
                  <div className="mt-2"></div>
                ) : (
                  <div className="mt-2">
                    {UserDetails?.user_type === "client-hobbyist" ? (
                      <button
                        onClick={() => handleRequestVairidate(item)}
                        className={classNames(
                          selectedGrid === 2 ? "text-[6px] " : "text-[14px] ",
                          "border-[2px] rounded-full px-2 py-[3px] mt-0 text-white bg-[#02227E] font-roboto  border-[#0198FE]"
                        )}
                      >
                        Request <span className="font-bold">VAI</span>
                        <span>RIDATE</span>
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
        : "There are No Posts Yet"}
      {/* </div> */}
    </div>
  );
};

export default Featured;
