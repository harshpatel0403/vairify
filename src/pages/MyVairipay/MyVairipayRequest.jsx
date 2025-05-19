import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import VaripayService from "../../services/VaripayServices";
import CarouselPrevArrow from "../../components/CarouselPrevArrow";
import CarouselNextArrow from "../../components/CarouselNextArrow";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import Loading from "../../components/Loading/Index";
import { IoCloseCircleOutline } from "react-icons/io5";
import PageTitle from "../../components/PageTitle";
const sugar_apps = {
  paymentAppName: "Sugar Apps",
  paymentLink: "https://sugar.app/",
  qrCode: "sugar.png",
  paymentImage: "/images/543644526211ae559a75f7131ee94db6.png",
  _id: "64fca17323706278dec2a657",
};
export default function MyVairipayRequest() {
  const { state } = useLocation();

  const [messageOpen, setMessageOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [userVaripays, setUserVaripays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDenyLoading, setIsDenyLoading] = useState(false);
  const [userVaripay, setUserVaripay] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qRCode, setQRCode] = useState(false);
  const [selectedVaripayId, setSelectedVaripayId] = useState(null);
  const handleView = (item, index) => {
    setSelectedItem(item);
    VaripayService.getUserVariapys(item?.requester?._id)
      .then((res) => {
        setUserVaripays(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setMessageOpen(true);
  };

  // const settings = {
  //   dots: false,
  //   infinite: false,
  //   speed: 500,
  //   arrow: true,
  //   slidePerRow: 3,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   cssEase: "linear",
  //   prevArrow: <CarouselPrevArrow />,
  //   nextArrow: <CarouselNextArrow />,
  // };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    loop: false,
    arrow: true,
    slidesToShow: Math.min(6, userVaripay?.length),
    slidesToScroll: 1,
    cssEase: "linear",
    prevArrow: <CarouselPrevArrow />,
    nextArrow: <CarouselNextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(4, userVaripay?.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(3, userVaripay?.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(3, userVaripay?.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleNextClick = () => {
    if (currentItemIndex < state.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const currentRequest = state[currentItemIndex];
  const getUseraripays = () => {
    VaripayService.getUserVariapys(currentRequest?.requester?._id)
      .then((res) => {
        setUserVaripays(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const compareUserVaripays = () => {
    VaripayService.comapareUserVaripays(
      UserData?._id,
      currentRequest?.requester?._id
    )
      .then((res) => {
        setUserVaripay(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sugar_apps = {
    paymentAppName: `${currentRequest?.requester?.name} App`,
    paymentLink: "https://sugar.app/",
    qrCode: "sugar.png",
    paymentImage: "/images/543644526211ae559a75f7131ee94db6.png",
    _id: "64fca17323706278dec2a657",
    status: true,
  };
  useMemo(() => {
    userVaripay.unshift(sugar_apps);
  }, [userVaripay]);


  // useEffect(() => {
  //   if (userVaripay?.length) {
  //     const alreadyAdded = userVaripay.some(app => app._id === sugar_apps._id);
  //     if (!alreadyAdded) {
  //       setUserVaripay(prev => [sugar_apps, ...prev]);
  //     }
  //   }
  // }, [userVaripay]);


  useEffect(() => {
    compareUserVaripays();
    getUseraripays();
  }, [currentRequest]);

  const closeMessage = () => {
    setMessageOpen(false);
    setQRCode(false);
  };

  const navigate = useNavigate();

  const handleDenyRequest = (e, id) => {
    e.preventDefault();
    setIsDenyLoading(true);
    // VaripayService.deleteUserVaripayRequest(id)
    VaripayService.updateUserVairipayRequest(id, { slug: "deny" })
      .then((res) => {
        navigate("/my-vairipay");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsDenyLoading(false);
      })
  };

  const handelUpdateRequest = (e, id) => {
    e.preventDefault();
    setIsLoading(true);
    VaripayService.updateUserVairipayRequest(id, { slug: 'paid' })
    navigate("/my-vairipay");
    // .then((res) => {
    //   setIsLoading(false);
    //   // console.log(res, "deleteUserVaripayRequest");
    // })
    // .catch((err) => {
    //   setIsLoading(false);
    //   console.log(err);
    // });
  };

  const uniqueLinks = new Set();

  const uniqueApps =
    userVaripay &&
    userVaripay
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .filter((item) => {
        if (uniqueLinks.has(item.paymentAppName)) {
          return false;
        }
        uniqueLinks.add(item.paymentAppName);
        return true;
      });

  // const HandleProfile = () => {
  //   const userId = currentRequest?.requester;
  //   navigate("/user/profile", {
  //     state: { item: { userId }, vairipay: true },
  //   });
  // };
  const HandleProfile = (item) => {
    const userId = item?.requester;
    navigate("/user/profile", {
      state: { item: { userId }, vairipay: true },
    });
  };
  const openQRCode = (item) => {
    setMessageOpen(false);
    setQRCode(true);
    setSelectedVaripayId(item);
  }

  return (
    <div>
      <div className="container mb-[48px]">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Request Payment"} />
        </div>
        <div className="grid md:grid-cols-2 gap-[24px]">
          {state.map((item, index) => {
            return (
              <div key={item.id} className="w-full p-[16px] bg-[#919EAB33] rounded-[16px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-[8px] flex-grow">
                    <div>
                      <img
                        className="w-[48px] h-[48px] bg-[#fff] rounded-full overflow-hidden object-cover"
                        src={
                          currentRequest?.requester?.profilePic != ""
                            ? `${import.meta.env.VITE_APP_S3_IMAGE}/${item?.requester?.profilePic
                            }`
                            : currentRequest?.requester?.gender === "Male"
                              ? "/images/male.png"
                              : "/images/female.png"
                        }
                        alt={item?.requester?.name}
                      />
                    </div>
                    <div>
                      <div className="sm:text-base text-sm text-white font-medium">
                        {item?.requester?.name}
                      </div>
                      <div className="sm:text-sm text-xs font-normal text-[#919EAB] uppercase">ID# {' '}
                        {item?.requester?.vaiID}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-[4px]">
                      <p className="sm:text-base text-sm text-white font-semibold">
                        {item?.requester?.averageRating}
                      </p>
                      <img src="/images/home/star.svg" alt="rating" />
                    </div>
                  </div>
                </div>

                <div className="mt-[16px]">
                  <div className="flex flex-col">
                    <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs"> You have Request to pay</div>
                    <h5 className="text-white font-medium sm:text-[28px] text-[20px]"> ${item.amount}.00</h5>
                  </div>
                </div>

                <div className="mt-[16px] flex gap-[8px]">
                  <Button
                    onClick={() => HandleProfile(item)}
                    text={'Profile'}
                    className={'py-[4px]'}
                  />
                  <Button
                    onClick={() => handleView(item, index)}
                    className={'py-[4px] !bg-transparent secondary-btn border-2 border-[#919EAB33] hover:!bg-[#919EAB33]'}
                    text={'View'}
                  />
                </div>
              </div>
            )
          })}
        </div>


        <Modal
          isOpen={messageOpen}
          //   onAfterOpen={afterMessageOpen}
          onRequestClose={closeMessage}
          className={
            "bg-[#FFFFFF] relative mx-auto  rounded-[16px] sm:p-[24px] p-[16px] w-[90%] max-w-[548px] overflow-y-auto max-h-[86vh]"
          }
          contentLabel="#"
        >
          <button
            onClick={() => setMessageOpen(false)}
            className="absolute sm:right-[24px] right-[10px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          >
            <IoCloseCircleOutline size={26} />
          </button>
          <h3 className="text-[20px] text-center font-medium text-[#212B36] mb-[24px]">Payment Request</h3>
          <div>
            <div className="flex justify-between items-center gap-2 w-full">
              <div className="flex items-center gap-2">
                <img
                  onClick={() => HandleProfile(selectedItem)}
                  src={
                    selectedItem?.requester?.profilePic != ""
                      ? `${import.meta.env.VITE_APP_S3_IMAGE}/${selectedItem?.requester?.profilePic
                      }`
                      : selectedItem?.requester?.gender === "Male"
                        ? "/images/male.png"
                        : "/images/female.png"
                  }
                  alt="profile"
                  className="w-[48px] h-[48px] rounded-full object-cover cursor-pointer"
                />

                <div className="flex flex-col gap-[2px]">
                  <p className="text-[16px] text-[#212B36] font-normal">
                    {selectedItem?.requester?.name}{" "}
                  </p>
                  <p className="text-[14px] text-[#919EAB] font-normal uppercase">
                    {selectedItem?.requester?.vaiID}
                  </p>
                </div>
              </div>
              <div className="flex gap-[4px]">
                <p className="sm:text-[18px] text-sm text-[#212B36] font-semibold">
                  {selectedItem?.requester?.averageRating}
                </p>
                <img src="/images/home/star.svg" alt="rating" />
              </div>
            </div>
            <div className="">
              <div className="flex items-start text-center justify-between gap-2 sm:mt-[24px] mt-[16px]">
                <div>
                  <p className="sm:text-[16px] text-sm font-medium text-[#212B36] opacity-60">
                    Amount Requested
                  </p>
                  <p className="text-[24px] font-medium text-[#212B36] text-left">{`$${selectedItem?.amount}`}</p>
                </div>
                <div>
                  <p className="sm:text-[16px] text-sm font-medium text-[#212B36] opacity-60">
                    Request Type
                  </p>
                  <p className="text-[24px] font-medium text-[#212B36] text-right uppercase">
                    Intial
                  </p>
                </div>
              </div>
              <div className="mt-[16px]">
                <p className="sm:text-[16px] text-sm font-medium text-[#212B36] opacity-60">
                  Comments
                </p>
                <div className="rounded-lg vairipay-comment">
                  <span className="pl-3">{`${selectedItem?.comment}`}</span>
                </div>
              </div>

              <div className="">
                <h5 className="sm:text-[16px] text-sm font-medium text-[#212B36] opacity-60 mt-[24px] mb-2">Choose Options below to pay to view</h5>
                <div className="flex items-center gap-2 flex-wrap">
                  {userVaripays.map((item) => {
                    return (
                      <div onClick={() => openQRCode(item)} className="bg-white rounded-lg w-full border border-[#919EAB29] max-w-[145px] h-[54px] flex items-center justify-center">
                        <img className="max-h-[30px]" src={
                          item?.paymentImage
                            ? import.meta.env
                              .VITE_APP_API_USER_VARIPAY_IMAGE_URL +
                            `/${item?.paymentImage}`
                            : "images/no-wallet-white.png"
                        } alt="icon" />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-center items-center sm:pt-[24px] pt-[16px] w-full sm:gap-[24px] gap-[16px]">
                {/* <div className="my-1 flex justify-center h-[34px] flex justify-center items-center pt-2"> */}
                <Button
                  className={'!bg-[#008F34] secondary-btn'}
                  disabled={isLoading}
                  text={
                    !isLoading ? (
                      "Accept"
                    ) : (
                      <div className="flex items-center	justify-center ">
                        <Loading />
                      </div>
                    )
                  }
                  onClick={(e) => handelUpdateRequest(e, selectedItem?._id)}
                ></Button>
                {/* </div> */}
                {/* <div className="my-1 flex justify-center h-[34px] flex justify-center items-center pt-2"> */}
                <Button
                  disabled={isDenyLoading}
                  text={
                    !isDenyLoading ? (
                      "Deny"
                    ) : (
                      <div className="flex items-center	justify-center ">
                        <Loading />
                      </div>
                    )
                  }
                  onClick={(e) => handleDenyRequest(e, selectedItem?._id)}
                ></Button>
                {/* </div> */}
              </div>

            </div>
          </div>
        </Modal>
        <Modal
          isOpen={qRCode}
          //   onAfterOpen={afterMessageOpen}
          onRequestClose={closeMessage}
          className={
            "bg-[#FFFFFF] relative mx-auto  rounded-[16px] p-[24px] w-[90%] max-w-[548px] overflow-y-auto max-h-[86vh]"
          }
          contentLabel="#"

        >
          <button
            onClick={() => setQRCode(false)}
            className="absolute sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          >
            <IoCloseCircleOutline size={26} />
          </button>
          <h3 className="text-[20px] text-center font-medium text-[#212B36] mb-[24px]">View {selectedVaripayId?.paymentAppName}</h3>
          <p className="text-[16px] font-medium text-[#212B36] opacity-60">
            QR Code
          </p>
          <div className="flex items-center justify-center my-6">
            <img className="w-[200px] h-[200px] object-cover" src={
              selectedVaripayId?.qrCode
                ? import.meta.env
                  .VITE_APP_S3_IMAGE +
                `/${selectedVaripayId?.qrCode}`
                : "images/no-wallet-white.png"
            } alt="icon" />
          </div>
          <div className="flex justify-center items-center pt-[24px] w-full gap-[24px]">
            <Button
              className={'secondary-btn'}
              disabled={isLoading}
              text={
                !isLoading ? (
                  "Download"
                ) : (
                  <div className="flex items-center	justify-center ">
                    <Loading />
                  </div>
                )
              }
              onClick={() => {
                if (!isLoading) {
                  window.open(selectedVaripayId.paymentLink, '_blank');
                }
              }}
            ></Button>
            <Button
              text={"Cancel"}
              onClick={() => setQRCode(false)}
            ></Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}


// <div
//   className="main-container mt-[100px]"
// >
//   <div className="w-full mx-auto flex flex-col justify-center items-center">
//     <div className="w-full mx-auto flex flex-row justify-between items-start mt-4">
//       <div className="flex flex-col items-center justify-center leading-[18px]">
//         <div>
//           <span className="text-[18px] text-[#040C50] font-extrabold font-Roboto-Serif">
//             VAI
//             <span className="text-[18px] text-[#040C50] font-semibold font-Roboto-Serif">
//               RIFY ID
//             </span>
//           </span>
//         </div>
//         <div>
//           <span className="text-[15px] text-[#040C50] font-bold uppercase">
//             {currentRequest?.requester?.vaiID}
//           </span>
//         </div>
//       </div>
//       <div className="w-[120px] relative">
//         <div
//           style={{ left: "10px", bottom: "80px" }}
//           // className="absolute w-full h-full rounded-full"
//           className="absolute flex_ flex-col_ items-center_ justify-center_ w-full h-full mx-auto_ mt-2_"
//         >
//           <img
//             className="w-[120px] h-[120px] bg-[#fff] rounded-full border-2 overflow-hidden"
//             src={
//               currentRequest?.requester?.profilePic != ""
//                 ? `${import.meta.env.VITE_APP_S3_IMAGE}/${currentRequest?.requester?.profilePic
//                 }`
//                 : currentRequest?.requester?.gender === "Male"
//                   ? "/images/male.png"
//                   : "/images/female.png"
//             }
//             // src={
//             //   currentRequest?.requester?.profilePic != ""
//             //     ? `${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${currentRequest?.requester?.profilePic
//             //     }`
//             //     : currentRequest?.requester?.gender === "Male"
//             //       ? "/images/male.png"
//             //       : "/images/female.png"
//             // }
//             alt={currentRequest?.requester?.name}
//           />
//         </div>
//         <div style={{ right: "4px", top: "6px" }} className="absolute">
//           <img
//             src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
//             alt="Sugar Icon Second"
//           />
//         </div>
//       </div>
//       <div className="leading-[18px]">
//         <div>
//           <span className="text-[18px] text-[#040C50] font-bold font-Roboto-Serif">
//             TruRevu
//           </span>
//         </div>

//       </div>
//     </div>
//     <div className="relative flex px-4 flex-col items-center justify-center w-full mx-auto bottom-3">
//       <div className="mt-2">
//         <span className="font-bold text-[24px] ">
//           {currentRequest?.requester?.name}
//         </span>
//       </div>
//       <div className="mt-2">
//         <img
//           src={import.meta.env.BASE_URL + "images/MaskGroup.png"}
//           alt="Mask Group"
//         />
//       </div>
//       <div className="flex pt-4">
//         <button
//           style={{
//             marginRight: "2rem",
//             opacity: currentItemIndex === 0 ? 0.5 : 1,
//           }}
//           onClick={handlePreviousClick}
//         >
//           <img
//             className="w-[19px]"
//             src={import.meta.env.BASE_URL + "images/VectorL.png"}
//             alt="Left Vector Icon"
//           />
//         </button>
//         <button onClick={() => setMessageOpen(true)}>
//           <div className="w-[150px] h-[47px] rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#0C8A02] flex flex-col justify-center items-center">
//             <div className="font-bold text-[10px]">
//               {currentRequest?.requester?.name} has requested
//             </div>
//             <div className="font-bold text-[20px]">
//               ${currentRequest?.amount}.00
//             </div>
//           </div>
//         </button>
//         <button
//           style={{
//             marginLeft: "2rem",
//             opacity: currentItemIndex === state.length - 1 ? 0.5 : 1,
//           }}
//           onClick={handleNextClick}
//         >
//           <img
//             src={"/images/VectorR.png"}
//             className="w-[20px]"
//             alt="Right Navigation"
//           />
//         </button>
//       </div>
//     </div>
//     <div className="inner-content-part-country pb-6 my-vairipay-request-scroll w-auto">
//       <div className="w-[100%] mb-4 max-w-[100vw] mx-auto flex flex-row justify-between items-start mt-8 px-0">
//         <div className="justify-center items-center bg-[#040C50] px-6 shadow-2xl pt-5 pb-3 w-full">
//           <Slider {...settings}>
//             {uniqueApps &&
//               uniqueApps?.map((varipay, index) => (
//                 <a key={varipay._id}>
//                   <div
//                     className="max-w-[90px] h-[80px] mx-auto"
//                     onClick={() => {
//                       if (index === 0) {
//                         navigate("/vairipay/download", {
//                           state: userVaripays,
//                         });
//                       } else {
//                         navigate("/vairipay/user/qr", {
//                           state: {
//                             App: varipay,
//                             UserRequest: currentRequest,
//                           },
//                         });
//                       }
//                     }}
//                   >
//                     <img
//                       className="w-full h-full"
//                       src={
//                         varipay?.status
//                           ? sugar_apps.paymentImage
//                           : import.meta.env
//                             .VITE_APP_API_USER_VARIPAY_IMAGE_URL +
//                           `/${varipay?.paymentImage}`
//                       }
//                       alt={varipay.paymentImage}
//                       width={90}
//                       height={80}
//                       style={
//                         varipay?.status
//                           ? { background: "#405FC4", borderRadius: "10px" }
//                           : {}
//                       }
//                     />
//                     <div
//                       className="flex items-center justify-center text-custom"
//                       style={{ background: "transparent", color: "white" }}
//                     >
//                       <span className="font-bold text-[14px]">
//                         {varipay.paymentAppName}
//                       </span>
//                     </div>
//                   </div>
//                 </a>
//               ))}
//           </Slider>
//         </div>
//       </div>
//       <div className="w-[100%] mb-4 max-w-[400px] mx-auto flex flex-row justify-between items-start mt-8 px-4">
//         {userVaripay.length === 0 ? (
//           <div className="w-full mx-auto flex flex-col justify-center items-center mt-8 bg-[#3760CB] max-w-[350px] h-[98px] rounded-3xl px-10 leading-5 shadow-2xl">
//             <span className="text-center">
//               <span className="font-bold text-[18px] text-white">
//                 Our system has not detected common apps with{" "}
//                 {currentRequest?.requester?.name}. To use
//               </span>
//               <span className="font-extrabold text-[18px] text-white">
//                 VAI
//               </span>
//               <span className="font-light text-[18px] text-white">
//                 RIPAY{" "}
//               </span>
//               <span className="font-bold text-[18px] text-white">
//                 please click an icon above
//               </span>
//             </span>
//           </div>
//         ) : (
//           <div className="w-full mx-auto flex flex-col justify-center items-center mt-8 bg-[#3760CB] max-[350px]:h-fit h-[98px] rounded-3xl px-10 leading-5 shadow-2xl">
//             <span className="text-center">
//               <span className="font-bold text-[18px] text-white">
//                 Our system has detected shared apps with{" "}
//                 {currentRequest?.requester?.name}. To use
//               </span>
//               <span className="font-extrabold text-[18px] text-white">
//                 VAI
//               </span>
//               <span className="font-light text-[18px] text-white">
//                 RIPAY{" "}
//               </span>
//               <span className="font-bold text-[18px] text-white">
//                 please click an icon above
//               </span>
//             </span>
//           </div>
//         )}
//       </div>
//       <div className="w-[100%] mb-4 max-w-[400px] mx-auto flex flex-row justify-between items-start mt-8 px-4">
//         <div className="flex flex-col justify-center items-center w-[48%]">
//           <div className="relative">
//             <img
//               src={import.meta.env.BASE_URL + "images/VAIRIPAYⓒ.png"}
//               alt="Vairipay text"
//               className="w-[100px]"
//             />
//           </div>
//           <div onClick={() => navigate("/vairipay-search")}>
//             <img
//               src={import.meta.env.BASE_URL + "images/Vairipay1.png"}
//               className="w-[148px] h-[123px]"
//               alt="Vairipay First"
//             />
//           </div>
//           <div className="relative pt-2">
//             <span className="text-[18px] font-bold">P2P APPS</span>
//           </div>
//         </div>
//         <div className="flex flex-col justify-center items-center w-[48%]">
//           <div className="relative">
//             <img
//               src={import.meta.env.BASE_URL + "images/VAIRIPAYⓒ.png"}
//               alt="Vairipay text"
//               className="w-[100px]"
//             />
//           </div>
//           <div
//             onClick={() => {
//               navigate("/goldentoken");
//             }}
//           >
//             <img
//               src={import.meta.env.BASE_URL + "images/Vairipay2.png"}
//               alt="Vairipay Second"
//               className="w-[148px] h-[123px]"
//             />
//           </div>
//           <div className="relative pt-2">
//             <span className="text-[18px] font-bold">
//               Golden Rose Tokens
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   <Modal
//     isOpen={messageOpen}
//     //   onAfterOpen={afterMessageOpen}
//     onRequestClose={closeMessage}
//     className={
//       "bg-[#3760CB] border-2 border-[#fff] relative max-w-[600px] top-[50%] translate-y-[-50%] mx-auto py-4 w-[95%] rounded-3xl px-4"
//     }
//     contentLabel="#"
//   >
//     <button
//       onClick={() => setMessageOpen(false)}
//       className="absolute top-2 pb-4 right-2"
//     >
//       <img
//         src="/images/Mask group-close.png"
//         alt=""
//         width="30px"
//         height="30px"
//       />
//     </button>
//     <div className="sm:h-fit pt-[23px] bg-[#3760CBD4] rounded-2xl ">
//       <div className="flex">
//         <div className="flex flex-col justify-between items-center w-[30%]">
//           <img
//             src={
//               currentRequest?.requester?.profilePic != ""
//                 ? `${import.meta.env.VITE_APP_S3_IMAGE}/${currentRequest?.requester?.profilePic
//                 }`
//                 : currentRequest?.requester?.gender === "Male"
//                   ? "/images/male.png"
//                   : "/images/female.png"
//             }
//             // src={
//             //   currentRequest?.requester?.profilePic != ""
//             //     ? `${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${currentRequest?.requester?.profilePic
//             //     }`
//             //     : currentRequest?.requester?.gender === "Male"
//             //       ? "/images/male.png"
//             //       : "/images/female.png"
//             // }
//             alt=""
//             className="w-[74px] h-[72.44px] rounded-full"
//           />
//           <p className="text-[12px] pt-1 text-[#fff] font-bold leading-[10.57px]">
//             TruRevu
//           </p>
//           <p className="text-[12px] text-[#fff] font-bold text-center leading-[17.57px]">
//             {currentRequest?.requester?.name}{" "}
//             <span className="uppercase">
//               {currentRequest?.requester?.vaiID}
//             </span>
//           </p>
//           <div className="flex gap-1 pb-1 items-start">
//             <div className="flex gap-1 mt-1">
//               <div className="flex flex-row justify-center items-center trurevu-star">
//                 <FontAwesomeIcon
//                   icon={faStar}
//                   color={
//                     currentRequest?.requester?.averageRating >= 1
//                       ? "#E1AB3F"
//                       : "#111"
//                   }
//                   className="text-[8px] margin-right-5"
//                 />
//                 <FontAwesomeIcon
//                   icon={faStar}
//                   color={
//                     currentRequest?.requester?.averageRating >= 2
//                       ? "#E1AB3F"
//                       : "#111"
//                   }
//                   className="text-[8px] margin-right-5"
//                 />
//                 <FontAwesomeIcon
//                   icon={faStar}
//                   color={
//                     currentRequest?.requester?.averageRating >= 3
//                       ? "#E1AB3F"
//                       : "#111"
//                   }
//                   className="text-[8px] margin-right-5"
//                 />
//                 <FontAwesomeIcon
//                   icon={faStar}
//                   color={
//                     currentRequest?.requester?.averageRating >= 4
//                       ? "#E1AB3F"
//                       : "#111"
//                   }
//                   className="text-[8px] margin-right-5"
//                 />
//                 <FontAwesomeIcon
//                   icon={faStar}
//                   color={
//                     currentRequest?.requester?.averageRating >= 5
//                       ? "#E1AB3F"
//                       : "#111"
//                   }
//                   className="text-[8px] margin-right-5"
//                 />
//               </div>
//             </div>
//             <span className="text-white block text-center  font-roboto font-bold text-[12px]">
//               {currentRequest?.requester?.averageRating}
//             </span>
//           </div>
//           <p
//             className="text-[14px] text-[#fff] font-bold rounded-2xl border-2 border-[#fff] bg-[#02227E] px-2 py-px text-center h-fit min-h-[33.7px] flex justify-center items-center cursor-pointer"
//             onClick={HandleProfile}
//           >
//             View Profile
//           </p>
//         </div>
//         <div className="w-[74%]">
//           <div className="flex items-start text-center justify-between gap-2">
//             <div>
//               <p className="text-[14px] font-bold text-[#fff] text-center leading-[17.57px]">
//                 Amount Requested
//               </p>
//               <div className="flex justify-center items-center">
//                 <div className="w-[100px] ">
//                   <span className="text-[24px] font-bold text-[#9ca3af] h-[25px]">{`$${currentRequest?.amount}`}</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <p className="text-[14px] font-bold text-[#fff]">
//                 Request Type{" "}
//               </p>
//               <p className="text-[18px] font-bold text-[#fff] uppercase">
//                 Intial
//               </p>
//             </div>
//           </div>
//           <div className="pb-px pt-5">
//             <p className="text-[10px] font-bold text-center text-[#fff]">
//               Comments
//             </p>
//             <div className="pl-7 pr-3">
//               <div className="border-2 rounded-xl border-[#02227E] vairipay-comment">
//                 <span className="pl-3">{`${currentRequest?.comment}`}</span>
//               </div>
//             </div>
//           </div>

//           <div className="pb-px ms-4 flex justify-evenly items-center pt-2">
//             {/* <div className="my-1 flex justify-center h-[34px] flex justify-center items-center pt-2"> */}
//             <Button
//               text={
//                 !isLoading ? (
//                   "Accept"
//                 ) : (
//                   <div className="flex items-center	justify-center ">
//                     <Loading />
//                   </div>
//                 )
//               }
//               onClick={(e) => handelUpdateRequest(e, currentRequest?._id)}
//               className="text-[#FFFFFF] text-[20px] font-bold  rounded-2xl bg-gradient-to-b bg-green-btn max-w-[85px] h-[34px]  text-center"
//             ></Button>
//             {/* </div> */}
//             {/* <div className="my-1 flex justify-center h-[34px] flex justify-center items-center pt-2"> */}
//             <Button
//               text={
//                 !isLoading ? (
//                   "Deny"
//                 ) : (
//                   <div className="flex items-center	justify-center ">
//                     <Loading />
//                   </div>
//                 )
//               }
//               onClick={(e) => handleDenyRequest(e, currentRequest?._id)}
//               className="text-[#FFFFFF] text-[20px] font-bold rounded-2xl bg-gradient-to-b from-[#A30C30] to-[#DB3002] max-w-[85px] h-[34px] text-center"
//             ></Button>
//             {/* </div> */}
//           </div>

//         </div>
//       </div>
//     </div>
//   </Modal>
// </div>