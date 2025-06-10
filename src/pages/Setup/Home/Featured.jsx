import { useEffect, useMemo, useState, useRef } from "react";

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
import Header from "../../layout/Header";
import BottomTabbar from "../../../components/BottomTabbar/BottomTabbar";
import Comments from "./Comments";
import PostDetails from "./PostDetails";
import Modal from 'react-modal';
import Button from "../../../components/Button";
import { IoCloseCircleOutline } from "react-icons/io5";
import Loading from "../../../components/Loading/Index";
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
  // {
  //   id: 3,
  //   name: "Marketplace",
  //   icon: "/images/marketplace-icon.png",
  //   current: false,
  //   code: tabsCode.marketplace,
  // },
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

const organizations = ["M4W", "W4M", "Bisexual"];

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
  const [isOpen, setIsOpen] = useState(false);
  const [particularPostItem, setParticularPostItem] = useState({});
  const [likeUnlike, setLikeUnlike] = useState(false);
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
  const dropdownRef = useRef(null);


  useEffect(() => {
    dispatch(HandleGetAllPost());
  }, [likeUnlike]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close all dropdowns
        setIsDropdownOpenSelectedOption(false);
        setIsDropdownOpenGender(false);
        setIsDropdownOpenOrientation(false);
        setIsDropdownOpenLifestyle(false);
        setIsDropdownOpenResorts(false);
        setIsDropdownOpenStore(false);
        setIsDropdownOpenFetish(false);
        setIsDropdownOpenAdvocacy(false);
        setIsDropdownOpenWorker(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    } else if (type === "store") {
      setSelectedOption({ ...selectedOption, store: value });
    } else if (type == "fetish") {
      setSelectedOption({ ...selectedOption, fetish: value });
    } else if (type == "advocacy") {
      setSelectedOption({ ...selectedOption, advocacy: value });
    } else if (type == "worker") {
      setSelectedOption({ ...selectedOption, worker: value });
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setParticularPostItem({})
    dispatch(HandleGetAllPost());
  }
  const HandleLike = async (id) => {
    try {
      setLikeUnlike(true);
      const body = {
        userId: UserDetails?._id,
      };
      await dispatch(HandleLikePost(id, body));
      dispatch(HandleGetAllPost());
    } catch (error) {
      console.error(error);
    }
    finally {
      setLikeUnlike(false);
    }
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
    <>
      <div className="md:hidden block fixed top-0 sm:h-[80px] h-[70px] w-full bg-[#060C4D] z-50"></div>
      <div className="container relative rounded-2xl ">
        <div className="min-h-[calc(100vh-280px)] ">

          <Carousel2 images={vairipayOptions} admin={"true"} vairipay={"false"} />
          <div className="flex justify-between items-end sm:mt-[48px] mt-[24px] md:flex-nowrap flex-wrap sm:gap-[24px] gap-[16px]" >
            <nav
              className="flex gap-[16px] md:w-fit w-full"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <button
                  onClick={() => handleTabSwitch(tab)}
                  key={tab.id}
                  className={classNames(
                    selectedTab === tab.code
                      ? "bg-[#FFFFFF4D] "
                      : "bg-[#FFFFFF14]",
                    "whitespace-nowrap px-[12px] py-[6px] text-sm font-medium text-white rounded-[8px]"
                  )}
                >
                  {!!tab.icon && <img src={tab.icon} />}
                  {tab.name}
                </button>
              ))}
            </nav>
            <div className="flex gap-2 flex-wrap" ref={dropdownRef}>
              <div>
                <button
                  onClick={() => {
                    setIsDropdownOpenSelectedOption(
                      !isDropdownOpenSelectedOption
                    );
                  }}
                  className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                >
                  <div className="relative text-white text-sm font-medium " >
                    {selectedOption.businesstype}
                  </div>
                </button>
                {isDropdownOpenSelectedOption && (
                  <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] z-[2]">
                    {businesstype.map((items) => {
                      return (
                        <span
                          key={items}
                          onClick={() => {
                            handelerDropdown(items, "businesstype");
                            setIsDropdownOpenSelectedOption(false);
                          }}
                          href="#"
                          className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption?.gender?.length == 0
                          ? "Gender"
                          : selectedOption.gender}
                      </div>
                    </button>
                    {isDropdownOpenGender && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] max-w-[140px]">
                        {gender?.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "gender");
                                setIsDropdownOpenGender(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption?.orientation?.length == 0
                          ? "Orientation"
                          : selectedOption.orientation}
                      </div>
                    </button>
                    {isDropdownOpenOrientation && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                        {organizations?.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "orientation");
                                setIsDropdownOpenOrientation(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption?.swingers?.length == 0
                          ? "Swingers"
                          : selectedOption.swingers}
                      </div>
                    </button>
                    {isDropdownOpenLifestyle && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                        {swingers?.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "swingers");
                                setIsDropdownOpenLifestyle(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption.resorts.length == 0
                          ? "Resorts"
                          : selectedOption.resorts}
                      </div>
                    </button>
                    {isDropdownOpenResorts && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                        {lifestyleoptions.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "resorts");
                                setIsDropdownOpenResorts(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption.store.length == 0
                          ? "Store"
                          : selectedOption.store}
                      </div>
                    </button>
                    {isDropdownOpenStore && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                        {store.map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "store");
                                setIsDropdownOpenStore(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption.fetish.length == 0
                          ? "Fetish"
                          : selectedOption.fetish}
                      </div>
                    </button>
                    {isDropdownOpenFetish && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                        {[].map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "fetish");
                                setIsDropdownOpenFetish(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption.advocacy.length == 0
                          ? "Advocacy"
                          : selectedOption.advocacy}
                      </div>
                    </button>
                    {isDropdownOpenAdvocacy && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                        {organizations.map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "advocacy");
                                setIsDropdownOpenAdvocacy(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption.worker.length == 0
                          ? "sex worker"
                          : selectedOption.worker}
                      </div>
                    </button>
                    {isDropdownOpenWorder && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                        {["sex worker"].map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "worker");
                                setIsDropdownOpenWorker(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption.advocacy.length == 0
                          ? "Advocacy"
                          : selectedOption.advocacy}
                      </div>
                    </button>
                    {isDropdownOpenAdvocacy && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                        {organizations.map((items) => {
                          return (
                            <span
                              key={items}
                              onClick={() => {
                                handelerDropdown(items, "advocacy");
                                setIsDropdownOpenAdvocacy(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
                      className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-medium overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
                    >
                      <div className="relative text-white text-sm font-medium " >
                        {selectedOption.worker.length == 0
                          ? "sex worker"
                          : selectedOption.worker}
                      </div>
                    </button>
                    {isDropdownOpenWorder && (
                      <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                        {["sexWorker"].map((items) => {
                          return (
                            <span
                              onClick={() => {
                                handelerDropdown(items, "worker");
                                setIsDropdownOpenWorker(false);
                              }}
                              href="#"
                              className="block px-4 py-2 font-medium text-[#02227E] cursor-pointer text-sm"
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
          {/* <div className="">
          <div className="flex items-center justify-between mt-px ">
            <div className="flex items-center min-w-0">

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
        </div> */}
          {/* <div
        className={classNames(
          selectedGrid === 2 ? "grid-cols-2" : "sm:grid-cols-1",
          " max-h-[calc(100vh_-_274px)] mb-2 overflow-auto grid mt-1.5  gap-2 pb-[50px] px-3 "
        )}
      > */}
          <div
            className="md:grid-cols-2 grid gap-[24px] pb-[50px] sm:mt-[48px] mt-[30px]"
          >
            {filteredLadyData.length > 0
              ? filteredLadyData?.map((item, index) => {
                const likedByUser = item?.likes?.includes(UserDetails?._id);

                return (

                  <div
                    key={index}
                    className="w-full"
                  >
                    <div
                      className={classNames(
                        "flex items-start justify-between"
                      )}
                    >
                      <div className="flex items-center flex-1 gap-[8px] mb-1">
                        <img
                          src={
                            item?.userId?.profilePic
                              ? `${import.meta.env
                                .VITE_APP_S3_IMAGE
                              }/${item?.userId?.profilePic}`
                              : item?.userId?.gender === "Male"
                                ? "/images/male.png"
                                : "/images/female.png"
                          }
                          className='h-[40px] w-[40px] rounded-full object-cover'
                        />
                        <div>
                          <h2
                            className="font-medium text-white text-base"
                          >
                            {item?.userId?.name}
                          </h2>
                          <h2
                            className="text-[#919EAB] font-regular text-sm"
                          >
                            ID# {item?.userId?.vaiID}
                          </h2>
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        <p className="text-white font-semibold text-base mt-[3px]">{item?.userId?.averageRating}</p>
                        <img
                          key={index}
                          src="/images/home/star.svg"
                          className="h-[20px] w-[20px]"
                        />
                      </div>
                    </div>
                    <div
                      className="sm:h-[300px] h-[200px] mt-[8px]"
                    >
                      <CardPlacehoderSkeleton
                        imageUrl={`${import.meta.env.VITE_APP_S3_IMAGE
                          }/${item?.image}`}
                        imageClassNames='h-full w-full object-cover rounded-[8px]'
                      />
                    </div>
                    <div className="flex items-center mb-1 mt-[8px] gap-[10px]">
                      <div
                        className="flex items-center gap-[6px] cursor-pointer"
                        onClick={() => {
                          HandleLike(item?._id);
                        }}

                      >
                        {likedByUser ? <img src="/images/home/like.svg" alt={likedByUser ? "Liked" : "Like"}
                        /> : <img src="/images/home/like_outline.svg" alt={likedByUser ? "Liked" : "Like"}
                        />}
                        <span
                          className=" text-white font-medium text-base"
                        >
                          {item?.likes?.length}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-[6px] cursor-pointer"
                        onClick={() => {
                          setParticularPostItem(item);
                          setIsOpen(true)
                        }
                        }
                      >
                        <img src="/images/home/comment.svg"
                        />
                        <span
                          className=" text-white font-medium font-roboto text-base"
                        >
                          {item?.comments?.length}
                        </span>
                      </div>
                    </div>
                    <div className="mt-[5px]">
                      <h2
                        className="text-[#919EAB] text-sm font-normal"
                      >
                        {item?.message === 'undefined' ? '' : item?.message}
                      </h2>
                    </div>

                    {UserDetails?._id === item?.userId?._id ? (
                      <div className="mt-2"></div>
                    ) : (
                      <div className="mt-2 mb-4 w-fit">
                        {UserDetails?.user_type === "client-hobbyist" && item?.userId?.user_type !== "client-hobbyist" ? (
                          <Button className={'px-2 !py-1 !text-[14px]'} onClick={() => handleRequestVairidate(item)} text={'Request VAIRIDATE'} />
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>

                );
              })

              : <>
                <div className="w-full flex flex-col justify-center items-center md:col-span-2">
                  <img src="/images/home/no-post.svg" alt="no post" />
                  <p className="text-white font-medium text-xl mt-[24px]">There are no posts yet </p>
                </div>
              </>}

            <Modal
              isOpen={isOpen}
              onRequestClose={closeModal}
              className={
                "sm:bg-[#FFFFFF] bg-[#060C4D] relative mx-auto sm:rounded-[16px] sm:px-[24px] sm:pb-[24px] sm:pt-[24px] px-[16px] pt-[60px] pb-[75px] sm:w-[90%] w-[100%] md:max-w-[548px] overflow-y-auto h-[100%] sm:h-auto z-[100000]"
              }
              contentLabel="#"
            >

              <button
                className="sm:absolute fixed sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-white sm:text-black cursor-pointer z-[100000] float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={closeModal}
              >
                <IoCloseCircleOutline size={26} />
              </button>

              <div className="sm:block hidden"><PostDetails state={particularPostItem} /></div>
              <Comments state={particularPostItem} />
            </Modal>
          </div>
        </div>
      </div>
      <div className="sm:pb-0 pb-[80px]"></div>
      <BottomTabbar />

    </>
  );
};

export default Featured;
