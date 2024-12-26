import React, { useEffect, useMemo, useState } from "react";

import Slider from "react-slick";
import Button from "../../../components/Button";
import Modal from "react-modal";
import SelectBox_ from "../../../components/SelectBox_";
import InputText from "../../../components/InputText";
import ReactModal from "react-modal";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleGetMarketPlace,
  HandleResultMarketPlace,
  HandleSearchWithVaiId,
} from "../../../redux/action/MarketplaceSearch";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
const marketplace = [
  {
    title: "GFE Dubai Search",
    image: "/images/lady-1.png",
  },
  {
    title: "Strip Club Dubai Search",
    image: "/images/lady-2.png",
  },
  {
    title: "Last Minute Invitation Atlanta",
    image: "/images/lady-1.png",
  },
  {
    title: "GFE Dubai Search",
    image: "/images/lady-3.png",
  },
  {
    title: "Strip Club Dubai Search",
    image: "/images/lady-4.png",
  },
];
const marketplaceSlider = [
  {
    title: "Escort",
    image: "/images/marketplace-1.png",
    status: true,
  },
  {
    title: "Massage",
    image: "/images/marketplace-2.png",
    status: true,
  },
  {
    title: "Dancer / Strip Club",
    image: "/images/marketplace-3.png",
    status: true,
  },
  {
    title: "Life style Clubs",
    image: "/images/marketplace-4.png",
    status: false,
  },
  {
    title: "Adult Stores/toys",
    image: "/images/marketplace-5.png",
    status: false,
  },
  {
    title: "Adult Forums",
    image: "/images/marketplace-7.png",
    status: false,
  },
  {
    title: "Organizations",
    image: "/images/marketplace-6.png",
    status: false,
  },
];
const tabs = [
  { id: 1, name: "My Favorite Searches" },
  // { id: 2, name: "My Invitations/Post" },
  { id: 3, name: "My Favorites Invitation/Post " },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const VerifyMarketplace = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const marketplacedata = useSelector(
    (state) => state?.Market?.marketplacedata
  );

  const [selecterdTab, setSelecterdTab] = useState(1);
  const [vairifyIdModal, setVairifyIdModal] = useState(false);
  const [vairifyId, setVairifyId] = useState("");
  const [loading, setLoading] = useState(false);
  const settings2 = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 4.5,
    slidesToScroll: 1,
    initialSlide: 0,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    dispatch(HandleGetMarketPlace(UserDetails?._id));
  }, [UserDetails]);

  const HandleResult = async (id) => {
    await dispatch(HandleResultMarketPlace(id));
    navigate("/results");
  };

  const handleCloseVairifyIdModal = () => {
    setVairifyIdModal(false);
  };

  const handleSubmitSearch = async () => {
    if (!vairifyId) {
      return toast.error("VaiID is required!");
    }
    setLoading(true);
    dispatch(HandleSearchWithVaiId(vairifyId))
      .then((res) => {
        if (res?.payload?.result?.length) {
          navigate("/user/profile", {
            state: { item: res?.payload?.result?.[0]?.profile, market: true },
          });
        } else {
          toast.error("Invalid vaiID!");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong!");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="main-content py-4 rounded-2xl pb-[45px] bg-[#D5D6E0] min-h-[calc(100vh-149px)]">
      <div className="flex flex-col justify-between">
        <div className="flex justify-center items-center flex-col">
          {
            //   <div className=" w-full bg-[#040C50]/[26%] h-[40px]">
            //   <h1 className="capitalize text-[30px] font-roboto-serif text-[#01195C]">
            //     <span className="font-[700]">VAI</span>RIFY{" "}
            //     <span className="font-bold">Marketplace</span>
            //   </h1>
            // </div>
          }
          {
            // <div className="mb-1 px-3 mt-2 w-full">
            //   <span className="font-roboto-serif block text-left text-[12px] font-bold text-[#02227E] ">
            //     Find Member
            //   </span>
            //   <div className="flex gap-4 items-center justify-between">
            //     <div>
            //       <input
            //         placeholder="Enter VAIRIFY ID#"
            //         className="border border-[#02227E] py-2 px-2 bg-[#02227E]/[11%] font-roboto-serif text-[14px] rounded-[10px]  focus:outline-none outline-none placeholder:text-[#02227E]/[49%] text-[#02227E]/[49%]"
            //       />
            //     </div>
            //     <div className="flex items-center">
            //       <span className="text-[#02227E]/[49%] font-Roboto font-bold text-[12px]">
            //         Scan QR Code
            //       </span>
            //       <button>
            //         <img src="/images/qr-code 2.png" width="35px" height="35px" />
            //       </button>
            //     </div>
            //   </div>
            // </div>
          }

          <div className="px-6 w-full pt-2.5 pb-3.5">
            <button
              onClick={() => navigate("/vairify-search")}
              className=" bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] uppercase"
            >
              VAI<span className="logoSetupweight">rify-now</span>
            </button>
          </div>

          <div className="mt-2 bg-[#040C50]/[26%] w-full h-[40px]">
            <h2 className="font-bold text-[26px] text-[#02227E] font-inter ">
              Marketplace Search
            </h2>
          </div>
          <div className="mx-auto w-full mt-4">
            <Slider {...settings2}>
              {marketplaceSlider.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="w-[145px] h-[auto] max-w-[145px] px-1"
                    onClick={() =>
                      navigate("/escort-type", {
                        state: { title: item.title, status: item.status },
                      })
                    }
                  >
                    <img
                      className="w-[145px] max-h-[120px] border-[2px] border-[#01195C] rounded-t-[26px]"
                      src={item.image}
                      alt="Slide 1"
                    />
                    <div className="bg-[#02227E] py-[11px] rounded-b-[24px] text-white font-Roboto text-[12px] font-semibold">
                      <span>{item.title}</span>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
          <div className="mt-1 bg-[#040C50]/[26%] w-full h-[40px] mt-4 mb-2">
            <h2 className="font-bold text-[26px] text-[#02227E] font-light">
              <strong className="font-bold">Find a Member</strong>
              {/* <strong className="change-font-family font-bold">VAI</strong>RIFY <strong className="change-font-family font-bold">Marketplace</strong> */}
            </h2>
          </div>
          <div className="px-2 w-full pt-4 pb-6">
            <div className="w-full mx-auto flex flex-row justify-center items-center gap-4">
              <button
                onClick={() => setVairifyIdModal((prevVal) => !prevVal)}
                className=" bg-gradient-to-t px-4 py-2 from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[16px] text-[#040C50] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] h-[54px]"
              >
                Enter <span className="font-extrabold">VAI</span>
                <span className="logoSetupweight">RIFY ID#</span>
              </button>
              <button
                onClick={() => navigate("/search/scan-qr")}
                className=" flex items-center px-4 py-2 bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[16px] text-[#040C50] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] h-[54px]"
              >
                Scan QR Code
                <img
                  src="/images/qr-code 2.png"
                  className="w-[25px] h-[25px] ml-2"
                />
              </button>
            </div>
          </div>
          <div className="mt-4 bg-[#040C50]/[26%] w-full mb-4 h-[40px]">
            <h2 className="font-bold text-[26px] text-[#02227E] font-inter ">
              Saved Search
            </h2>
          </div>

          <div className="border-b mb-[18px] w-full border-black">
            <nav
              className="-mb-px flex justify-center sm:space-x-4"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelecterdTab(tab.id)}
                  className={classNames(
                    selecterdTab === tab.id
                      ? "border-[#02227E] "
                      : "border-transparent",
                    tab.id === 1 ? " max-w-[95px]" : " max-w-[120px]",
                    "font-bold  font-inter text-[14px]  sm:max-w-full sm:w-auto w-content text-[#02227E] border-b-2  px-1 "
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="w-full flex flex-col gap-[11px]">
            {marketplacedata &&
              marketplacedata
                ?.filter((data) => {
                  if (selecterdTab === 1) {
                    return data.inquiry === "Search";
                  } else if (selecterdTab === 2) {
                    return (
                      data.inquiry === "Invitation" && !data.favoriteStatus
                    );
                  } else {
                    return (
                      (data.inquiry === "Invitation" && data.favoriteStatus) ||
                      (data?.favoriteStatus && data?.typespecialty)
                    );
                  }
                })
                .map((item, index) => {
                  if (
                    item?.service === "Escort" ||
                    item?.service === "Massage" ||
                    item?.service?.startsWith("Dancer")
                  ) {
                    item.status = true;
                  } else {
                    item.status = false;
                  }
                  return (
                    <div
                      key={index}
                      className="flex gap-2 items-center justify-center mb-2"
                    >
                      <div className="w-[80%]">
                        <div
                          className="min-h-[50px] rounded-full flex relative pl-14 pr-3 sm:px-14 border-[3px] border-[#01195C] justify-center items-center text-center text-white bg-[#3760CB]"
                          onClick={() => HandleResult(item?._id)}
                        >
                          <img
                            src="/images/lady-1.png"
                            className="absolute top-0 h-full bottom-0 left-0"
                          />
                          <span className="text-[18px] font-bold">
                            {item?.searchname}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate("/escort-type", {
                            state: {
                              title: item.service,
                              status: item.status,
                              EditData: item,
                            },
                          })
                        }
                      >
                        <img src="/images/Mask group.png" alt="" />
                      </button>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={vairifyIdModal}
        onRequestClose={handleCloseVairifyIdModal}
        className=" w-[360px] h-[210px] bg-[#3760CB] relative center-modal rounded-2xl px-4"
      >
        <button
          onClick={handleCloseVairifyIdModal}
          className="absolute top-2 right-2"
        >
          <img
            src="/images/Mask group-close.png"
            alt=""
            width="30px"
            height="30px"
          />
        </button>
        <div className="flex items-center justify-start pt-10 ">
          <p className="text-[20px] font-bold text-center text-[#fff] leading-5">
            Enter VAI<span className="logoSetupweight">RIFY Id</span>
          </p>
        </div>
        <div className="flex flex-col justify-around items-center w-full gap-3 p-2">
          <div className="w-full h-full">
            <InputText
              size="60px"
              className="text-[24px] font-bold text-[#01195C] h-full bg-[#fff] rounded-xl border-2 border-[#02227E] h-[60px]"
              bgColor={"#fff"}
              onChange={(e) => setVairifyId(e.target.value)}
              value={vairifyId}
              disabled={loading}
            />
            {/* {error.name && (
              <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                {error.name}
              </label>
            )} */}
          </div>
          <div className="w-[30%]">
            <Button
              className={
                "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[20px]"
              }
              text={
                !loading ? (
                  "Save"
                ) : (
                  <div className="flex items-center	justify-center pt-[6px]">
                    <Loading />
                  </div>
                )
              }
              size="45px"
              onClick={handleSubmitSearch}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VerifyMarketplace;
