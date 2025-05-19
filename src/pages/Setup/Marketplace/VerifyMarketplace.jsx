import React, { useEffect, useMemo, useState } from "react";
import Button from "../../../components/Button";
import Modal from "react-modal";
import SelectBox_ from "../../../components/SelectBox_";
import InputText from "../../../components/InputText";
import ReactModal from "react-modal";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import {
  HandleGetMarketPlace,
  HandleResultMarketPlace,
  HandleSearchWithVaiId,
} from "../../../redux/action/MarketplaceSearch";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode } from "swiper/modules";
import PageTitle from "../../../components/PageTitle";
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
    image: "/images/home/marketplace-1.png",
    status: true,
  },
  {
    title: "Massage",
    image: "/images/home/marketplace-2.png",
    status: true,
  },
  {
    title: "Dancer / Strip Club",
    image: "/images/home/marketplace-3.png",
    status: true,
  },
  {
    title: "Life style Clubs",
    image: "/images/home/marketplace-4.png",
    status: false,
  },
  {
    title: "Adult Stores/toys",
    image: "/images/home/marketplace-5.png",
    status: false,
  },
  {
    title: "Adult Forums",
    image: "/images/home/marketplace-6.png",
    status: false,
  },
  {
    title: "Organizations",
    image: "/images/home/marketplace-7.png",
    status: false,
  },
];
const tabs = [
  { id: 1, name: "My Fav Searches" },
  // { id: 2, name: "My Invitations/Post" },
  { id: 3, name: "My Fav Invitation/Post " },
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
  const [resultsLoading, setResultsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState({});

  useEffect(() => {
    dispatch(HandleGetMarketPlace(UserDetails?._id));
  }, [UserDetails]);

  const HandleResult = async (id) => {
    setLoadingIds((prev) => ({ ...prev, [id]: true }));

    setResultsLoading(true);
    await dispatch(HandleResultMarketPlace(id));
    navigate("/results");
    setResultsLoading(false);
    setLoadingIds((prev) => ({ ...prev, [id]: true }));

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
    <div>
      <div className="container">
        <div className=" relative md:block hidden">
          <h3 className="text-center text-white sm:text-[28px] text-[24px] font-medium sm:my-[48px] mt-[-32px] mb-[70px]">Search/Invite</h3>
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

          <div className=" absolute right-0 top-[50px] sm:top-0">
            <Button
              text={"VAIrify-now"}
              onClick={() => navigate("/vairify-search")}
              className={'px-[20px] !py-[6px]'}
            />
          </div>
        </div>

        <div className="md:hidden block md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={'Marketplace Search'} isSmall={true} />
        </div>
        <div className="md:hidden block mb-[24px]">
          <Button
            text={"VAIrify-now"}
            onClick={() => navigate("/vairify-search")}
            className={'px-[20px] !py-[6px] !w-fit'}
          />
        </div>
      </div>
      <div className="container sm:px-[30px] px-0">
        <div className="mx-auto w-full mt-4 mb-[24px]">
          <Swiper
            loop={true}
            spaceBetween={16}
            freeMode={true}
            modules={[FreeMode]}
            className="w-full"
            breakpoints={{
              300: {
                slidesPerView: 2.2,
              },
              480: {
                slidesPerView: 3,
              },
              640: {
                slidesPerView: 4,
              },
              768: {
                slidesPerView: 5,
              },
              1024: {
                slidesPerView: 6,
              },
            }}
          >
            {marketplaceSlider.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="max-w-[155px] h-[128px] p-[8px] cursor-pointer rounded-lg bg-[#E8EBF0] flex flex-col justify-center items-center gap-[8px]"
                  onClick={() =>
                    navigate("/escort-type", {
                      state: { title: item.title, status: item.status },
                    })
                  }
                >
                  <img className="mx-auto" src={item.image} alt="Slide" />
                  <div>
                    <h3 className="text-[#060C4D] font-medium text-[14px] text-center">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="container">
        <h3 className="font-medium sm:text-[20px] text-lg text-white mb-[8px] sm:text-left text-center">Find a Member</h3>
        {/* <strong className="change-font-family font-bold">VAI</strong>RIFY <strong className="change-font-family font-bold">Marketplace</strong> */}
        <div className="w-full mx-auto flex justify-center items-center gap-4 mb-[24px]">
          <Button
            text={"Enter VAIRIFY ID#"}
            onClick={() => setVairifyIdModal((prevVal) => !prevVal)}
            className={'px-[20px]'}
          />
          <Button
            text={" Scan QR Code"}
            onClick={() => navigate("/search/scan-qr")}
            className={'px-[20px]'}
          />
        </div>


        <h2 className="font-medium sm:text-[20px] text-lg text-white mb-[8px] sm:text-left text-center">
          Saved Search
        </h2>
        <div className="">
          <nav
            className="flex items-center gap-[16px] w-full sm:bg-transparent bg-[#FFFFFF0A] sm:p-0 p-[8px]"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelecterdTab(tab.id)}
                className={classNames(
                  selecterdTab === tab.id
                    ? "bg-[#919EAB66]"
                    : "sm:bg-[#FFFFFF14]",
                  tab.id === 1 ? " " : " ",
                  "font-medium sm:text-[14px] text-[12px] text-white px-[12px] py-[8px] rounded-lg sm:w-fit w-full"
                )}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-[24px] my-[24px] pb-5">
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

                let imageSrc = "/images/home/marketplace-1.png";
                switch (item?.service) {
                  case "Escort":
                    imageSrc = "/images/home/marketplace-1.png";
                    break;
                  case "Massage":
                    imageSrc = "/images/home/marketplace-2.svg";
                    break;
                  case "Dancer / Strip Club":
                    imageSrc = "/images/home/marketplace-3.svg";
                    break;
                  case "Life style Clubs":
                    imageSrc = "/images/home/marketplace-4.svg";
                    break;
                  case "Adult Stores/toys":
                    imageSrc = "/images/home/marketplace-5.svg";
                    break;
                  case "Adult Forums":
                    imageSrc = "/images/home/marketplace-6.svg";
                    break;
                  case "Organizations":
                    imageSrc = "/images/home/marketplace-7.svg";
                    break;
                  default:
                    imageSrc = "/images/home/marketplace-1.png";
                    break;
                }
                return (
                  <div
                    key={index}
                    className="flex gap-2 items-center justify-center mb-2 w-full relative"
                  >
                    <div
                      className="bg-[#919EAB33] p-[8px] rounded-lg flex items-center w-full cursor-pointer"
                      onClick={() => HandleResult(item?._id)}
                    >
                      <div className="flex items-center gap-[8px]">
                        <img
                          src={imageSrc}
                          className="rounded-full w-[40px] h-[40px] object-cover bg-white"
                        />
                        <h3 className="text-[18px] font-normal text-white">
                          {item?.searchname}
                        </h3>
                      </div>
                    </div>
                    <div className=" absolute right-[16px] top-[16px]">
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
                        {loadingIds[item?._id] ? <Loading /> : <FaEdit color="white" size={20} />}
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>



        <Modal
          isOpen={vairifyIdModal}
          onRequestClose={handleCloseVairifyIdModal}
          className=" max-w-[550px] max-h-[700px] mx-auto bg-white overflow-auto fixed rounded-2xl sm:p-[24px] p-[16px] w-[90%]"
        >
          <button
            onClick={() => setVairifyIdModal(false)}
            className="absolute sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          >
            <IoCloseCircleOutline size={26} />
          </button>
          <p cclassName="sm:text-[20px] text-[16px] sm:w-auto w-[80%] mx-auto font-medium text-center text-[#212B36]">
            Enter VAI<span className="logoSetupweight">rify Id</span>
          </p>
          <div className="w-full my-[24px]">
            <InputText
              className="text-[14px] font-normal !text-[#212B36] placeholder:!text-black  bg-[#919EAB14] rounded-lg border-0"
              border={"#D9D9D9"}
              bgColor={"#919EAB14"}
              onChange={(e) => setVairifyId(e.target.value)}
              value={vairifyId}
              disabled={loading}
              placeholder={'Enter Id'}
            />
            {/* {error.name && (
              <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                {error.name}
              </label>
            )} */}
          </div>
          <div className="w-full">
            <Button
              className={'secondary-btn'}
              text={
                !loading ? (
                  "Save"
                ) : (
                  <div className="flex items-center	justify-center">
                    <Loading />
                  </div>
                )
              }
              disabled={loading}
              onClick={handleSubmitSearch}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default VerifyMarketplace;
