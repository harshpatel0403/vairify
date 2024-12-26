import { faL, faLadderWater, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyVairifyService from "../../services/MyVairifyService";
import { toast } from "react-toastify";
import moment from "moment";

export default function MyVarify() {
  const [selectedContact, setSelectedContact] = useState("All");
  const [selectedClient, setSelectedClient] = useState("All");
  const [selectedRelevance, setSelectedRelevance] = useState("Newest");
  const [vairifyData, setVairifyData] = useState([]);
  const [parsedVairifyData, setParsedVairifyData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <div className="main-container h-full">
        <div className="h-full flex justify-center items-center">
          <p className="text-[22px] font-bold mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start mt-2 main-container-other">
      <div>
        <h2 className="text-[34px] text-[#02227E] font-bold ">
          My VAI<span className="font-medium">RIFY</span>
        </h2>
        <div className="grid grid-cols-3 gap-1 mt-3 ml-3 mr-3 border-b border-black sm:grid-cols-3 md:grid-cols-3 md:gap-2 b">
          <div className="flex items-center justify-center ">
            <div className="relative varify-card-filter-tags">
              <button
                onClick={() => {
                  setIsDropdownOpenContact(!isDropdownOpenContact);
                  setIsDropdownSelectedOpenClient(false);
                  setIsDropdownSelectedOpenRelevance(false);
                }}
                className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer mb-1 appearance-none mt-4 px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
              >
                <div className="relative flex items-center justify-between mx-2">
                  <div>{selectedContact}</div>
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
              {isDropdownOpenContact && (
                <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
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
                className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer mb-1 appearance-none mt-4 px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
              >
                <div className="relative flex items-center justify-between mx-2">
                  <div>{selectedClient}</div>
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
              {isDropdownSelectedOpenClient && (
                <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
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
                className="min-w-[115px] md:min-w-[180px] pl-2 md:pl-6 text-center outline-none cursor-pointer mb-1 appearance-none mt-4 px-1 md:px-4 h-[35px] bg-[#02227E] border-2 border-[#0198FE] rounded-full text-[12px] md:text-[18px] text-[#fff] font-bold overflow:hidden"
              >
                <div className="relative flex items-center justify-between mx-2">
                  <div>{selectedRelevance}</div>
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
              {isDropdownSelectedOpenRelevance && (
                <div className="absolute self-center md:w-44 w-32 py-2 bg-[#e5e7eb] shadow-xl">
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
      </div>
      {!parsedVairifyData?.length && (
        <div className="w-[100%] text-center pt-14 font-semibold">
          No results found!
        </div>
      )}
      <div className="w-full  grid grid-cols-3 lg:grid-cols-5 md:grid-cols-5 mt-3 mb-3 pr-3 pl-3 gap-x-3 gap-y-3 overflow-hidden overflow-y-auto rounded-xl inner-card-part">
        {parsedVairifyData &&
          parsedVairifyData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col  rounded-t-[84px] md:rounded-t-[92px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #011a61, #0233ba, #0244f3)",
              }}
              onClick={() => handleCards(item)}
            >
              <img
                className="md:min-w-[120px] md:max-w-[120px] md:w-[120px] md:h-[120px] min-w-[100px] max-w-[100px] w-[100px] h-[100px] rounded-[100px] my-1 mx-auto"
                // src={import.meta.env.BASE_URL + item.profilePic}
                src={
                  item?.profilePic
                    ? import.meta.env.VITE_APP_S3_IMAGE +
                      `/${item?.profilePic}`
                    : item?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                // src={
                //   item?.profilePic
                //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //       `/${item?.profilePic}`
                //     : item?.gender === "Male"
                //     ? "/images/male.png"
                //     : "/images/female.png"
                // }
                alt=""
              />

              <div className="varify-card-content">
                <h6 className="text-[20px] font-medium text-white uppercase">
                  {/*** {item.companyName} */}
                  TruRevu
                </h6>
                <h6 className="text-[18px] font-bold text-white mb-[5px] uppercase">
                  {item.name}
                </h6>
                <h6 className="text-[18px] font-bold text-white mb-[15px] uppercase">
                  {item.vaiID}
                </h6>
                <div className="flex-col items-center mb-2 mt-[10px]">
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
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
