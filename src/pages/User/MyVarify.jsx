import { faL, faLadderWater, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyVairifyService from "../../services/MyVairifyService";
import { toast } from "react-toastify";
import moment from "moment";
import Button from "../../components/Button";
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";

export default function MyVarify() {
  const [selectedContact, setSelectedContact] = useState("All");
  const [selectedClient, setSelectedClient] = useState("All");
  const [selectedRelevance, setSelectedRelevance] = useState("Newest");
  const [vairifyData, setVairifyData] = useState([]);
  const [parsedVairifyData, setParsedVairifyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const navigate = useNavigate();


  const [isDropdownOpenContact, setIsDropdownOpenContact] = useState(false);
  const [isDropdownSelectedOpenClient, setIsDropdownSelectedOpenClient] =
    useState(false);
  const [isDropdownSelectedOpenRelevance, setIsDropdownSelectedOpenRelevance] =
    useState(false);

  const contact = ["All", "Followed", "Following", "Favorites"];
  const client = ["All", "Clients", "Bussiness", "Companion"];
  const revelance = ["Newest", "Oldest", "Highest Trurevu", "Lowest Trurevu"];


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close all dropdowns
        setIsDropdownOpenContact(false);
        setIsDropdownSelectedOpenClient(false);
        setIsDropdownSelectedOpenRelevance(false);

      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const data = [
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer ",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #FF030B, #F8017B, #F300C5)",
      },
      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "2.0",
      contact: "Contacts",
      client: "Clients",
      newest: "Newest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #FF030B, #F8017B, #F300C5)",
      },
      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "2.0",
      contact: "Following",
      client: "Clients",
      newest: "Lowest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #FF030B, #F8017B, #F300C5)",
      },
      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "2.0",
      contact: "Contacts",
      client: "Clients",
      newest: "Oldest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Contacts",
      client: "Clients",
      newest: "Newest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #141416, #333e44, #4c5e68)",
      },
      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Contacts",
      client: "Clients",
      newest: "Newest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Followed",
      client: "Clients",
      newest: "Newest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Followed",
      client: "Clients",
      newest: "Newest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Followed",
      client: "Bussiness",
      newest: "Oldest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Contacts",
      client: "Bussiness",
      newest: "Oldest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Followed",
      client: "Clients",
      newest: "Newest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #FF030B, #F8017B, #F300C5)",
      },
      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal ",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Favorites",
      client: "Clients",
      newest: "Lowest TruRevu",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Favorites",
      client: "Bussiness",
      newest: "Oldest",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Favorites",
      client: "Bussiness",
      newest: "Lowest TruRevu",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Favorites",
      client: "Bussiness",
      newest: "Lowest TruRevu",
    },

    // Black colour
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #141416, #333e44, #4c5e68)",
      },
      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Following",
      client: "Bussiness",
      newest: "Lowest TruRevu",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #141416, #333e44, #4c5e68)",
      },
      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Following",
      client: "Bussiness",
      newest: "Lowest TruRevu",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Following",
      client: "Companion",
      newest: "Highest TruRevu",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Following",
      client: "Companion",
      newest: "Highest TruRevu",
    },
    {
      className:
        "flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer",
      style: {
        backgroundImage:
          "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
      },

      imgSrc: "images/AdminAboutMe2.png",
      imgAlt: "Hot Rod",
      companyName: "TruRevu",
      productModel: "Crystal",
      productModelId: "98UF98",
      rating: "5.0",
      contact: "Following",
      client: "Companion",
      newest: "Highest TruRevu",
    },
  ];

  const handlerDropdown = (value, type) => {
    if (type == "selectedContact") {
      setSelectedContact(value);
    } else if (type == "selectedClient") {
      setSelectedClient(value);
    } else if (type == "selectedRelevance") {
      setSelectedRelevance(value);
    }
  };

  // const filteredData = data.filter((item) => {
  //   return (
  //     (selectedContact === "Contacts" || item.contact === selectedContact) &&
  //     (selectedClient === "Clients" || item.client === selectedClient) &&
  //     (selectedRelevance === "Newest" || item.newest === selectedRelevance)
  //   );
  // });

  const handleCards = (selectedItem) => {
    console.log("item", selectedItem);
    navigate("/my-vairify-details", {
      state: selectedItem,
    });
  };

  const fetchMyVairify = async () => {
    setLoading(true);
    try {
      const result = await MyVairifyService.getMyVairifyList(UserDetails?._id);
      setVairifyData(result?.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVairify();
  }, []);

  const filterCategoryWise = (data) => {
    if (selectedContact !== "All") {
      if (selectedContact === "Followed") {
        let followedData = data?.find(
          (item) => item?.type === "followerUserData"
        );
        return followedData?.data || [];
      } else if (selectedContact === "Following") {
        let followingData = data?.find(
          (item) => item?.type === "followingUserData"
        );
        return followingData?.data || [];
      } else if (selectedContact === "Favorites") {
        let favouriteData = data?.find(
          (item) => item?.type === "favouriteData"
        );
        return favouriteData?.data || [];
      }
    } else {
      return data?.reduce((acc, item) => {
        let accIds = acc?.map((accItem) => accItem?._id);
        return [
          ...acc,
          ...(item?.data?.filter((ele) => !accIds?.includes(ele?._id)) || []),
        ];
      }, []);
    }
  };

  const filterUserTypeWise = (data) => {
    if (selectedClient !== "All") {
      if (selectedClient === "Clients") {
        return data?.filter((item) => item?.userType === "client-hobbyist");
      } else if (selectedClient === "Bussiness") {
        return data?.filter((item) => item?.userType === "agency-business");
      } else if (selectedClient === "Companion") {
        return data?.filter((item) => item?.userType === "companion-provider");
      }
    } else {
      return data;
    }
  };

  const sortResults = (data = []) => {
    if (selectedRelevance === "Newest") {
      return data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
    } else if (selectedRelevance === "Oldest") {
      return data.sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)));
    } else if (selectedRelevance === "Highest TruRevu") {
      return data.sort((a, b) => b.averageRating - a.averageRating);
    } else if (selectedRelevance === "Lowest TruRevu") {
      return data.sort((a, b) => a.averageRating - b.averageRating);
    }
  };

  useEffect(() => {
    let categoryWiseFiltered = filterCategoryWise(vairifyData);
    let userTypeWiseFiltered = filterUserTypeWise(categoryWiseFiltered);
    let sortedResult = sortResults(userTypeWiseFiltered);
    setParsedVairifyData(sortedResult);
  }, [vairifyData, selectedContact, selectedClient, selectedRelevance]);

  if (loading) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={" My VAIRIFY"} />
      </div>
      <div>
        <div className="flex gap-[16px] flex-wrap" ref={dropdownRef}>
          <div className="flex items-center justify-center ">
            <div className="relative varify-card-filter-tags">
              <button
                onClick={() => {
                  setIsDropdownOpenContact(!isDropdownOpenContact);
                  setIsDropdownSelectedOpenClient(false);
                  setIsDropdownSelectedOpenRelevance(false);
                }}
                className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
              >
                <div className="relative text-white text-sm font-bold " >
                  <div>{selectedContact}</div>
                </div>
              </button>
              {isDropdownOpenContact && (
                <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] z-50">
                  {contact.map((items) => {
                    return (
                      <span
                        onClick={() => {
                          handlerDropdown(items, "selectedContact");
                          setIsDropdownOpenContact(false);
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
          </div>
          <div className="flex items-center justify-center ">
            <div className="relative varify-card-filter-tags">
              <button
                onClick={() => {
                  setIsDropdownSelectedOpenClient(
                    !isDropdownSelectedOpenClient
                  );
                  setIsDropdownOpenContact(false);
                  setIsDropdownSelectedOpenRelevance(false);
                }}
                className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
              >
                <div className="relative text-white text-sm font-bold " >
                  <div>{selectedClient}</div>
                </div>
              </button>
              {isDropdownSelectedOpenClient && (
                <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                  {client.map((items) => {
                    return (
                      <span
                        onClick={() => {
                          handlerDropdown(items, "selectedClient");
                          setIsDropdownSelectedOpenClient(false);
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
          </div>

          <div className="flex items-center justify-center ">
            <div className="relative varify-card-filter-tags">
              <button
                onClick={() => {
                  setIsDropdownSelectedOpenRelevance(
                    !isDropdownSelectedOpenRelevance
                  );
                  setIsDropdownOpenContact(false);
                  setIsDropdownSelectedOpenClient(false);
                }}
                className="outline-none cursor-pointer appearance-none pl-[12px] min-w-[140px]  pr-[34px] py-[6px] bg-[#FFFFFF14] border border-[#FFFFFF4D] rounded-[8px] text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden  select-arrow before:right-[12px] before:top-[42%]"
              >
                <div className="relative text-white text-sm font-bold " >
                  <div>{selectedRelevance}</div>
                </div>
              </button>
              {isDropdownSelectedOpenRelevance && (
                <div className="absolute self-center py-2 bg-[#fff] mt-3 rounded-[8px] min-w-[140px] ">
                  {revelance.map((items) => {
                    return (
                      <span
                        onClick={() => {
                          handlerDropdown(items, "selectedRelevance");
                          setIsDropdownSelectedOpenRelevance(false);
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
          </div>
        </div>

        {!parsedVairifyData?.length && (
          <div className="w-[100%] text-center pt-14 font-semibold text-white">
            No results found!
          </div>
        )}
        <div className="w-full grid sm:grid-cols-2 gap-[24px] mt-[30px]">
          {parsedVairifyData &&
            parsedVairifyData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col rounded-[16px] p-[16px] cursor-pointer bg-[#919EAB33]"

              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center ">
                    <img
                      className="w-[48px] h-[48px] rounded-full object-cover"
                      src={
                        item?.profilePic
                          ? import.meta.env.VITE_APP_S3_IMAGE +
                          `/${item?.profilePic}`
                          : item?.gender === "Male"
                            ? "/images/male.png"
                            : "/images/female.png"
                      }
                      alt="profile picture"
                    />
                    <div>
                      <h6 className="text-base font-medium text-white">
                        {item.name}
                      </h6>
                      <h6 className="text-sm font-normal text-[#919EAB] uppercase">
                        {item.vaiID}
                      </h6>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <p className="text-[18px] text-white font-bold m-0">
                      {item.averageRating}
                    </p>
                    <img src="/images/home/star.svg" alt="star" />
                  </div>
                </div>
                <div className="flex gap-[8px] mt-[16px]">
                  <button
                    className="bg-[#FFFFFF] p-[7px] w-full text-sm font-medium rounded-[8px] text-[#060C4D] flex gap-2 justify-center items-center border border-white"
                    onClick={() => handleCards(item)}
                  >
                    <img src="/images/home/profile.svg" alt="profile" />
                    Profile
                  </button>
                  <button className="bg-transparent p-[7px] rounded-[8px] flex justify-center items-center gap-2 text-white w-full border border-[#919EAB33] text-sm font-medium">
                    <img src="/images/home/comment.svg" alt="profile" />
                    Chat
                  </button>
                </div>
                {/*** {item.companyName} */}
                {/* <h6 className="text-[20px] font-medium text-white uppercase">
                    TruRevu
                  </h6> */}

                {/* <div className="flex-col items-center mb-2 mt-[10px]">
                    {[1, 2, 3, 4, 5].map((star, starIndex) => (
                      <FontAwesomeIcon
                        key={starIndex}
                        icon={faStar}
                        color={
                          item.averageRating >= starIndex + 1
                            ? "#E1AB3F"
                            : "#CCCCCC"
                        }
                        size={"10xs"}
                        className="mb-3 rating-title"
                      />
                    ))}
                    <div>
                      <span className="text-[18px] text-white font-bold mb-[10px] rating-title">
                        {item.averageRating}
                      </span>
                    </div>
                  </div> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
