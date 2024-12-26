import Button from "../../components/Button";
// import Carousel from "../../components/Carousel";
import { useNavigate, useLocation } from "react-router-dom";
import VaripayService from "../../services/VaripayServices";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import CarouselPrevArrow from "../../components/CarouselPrevArrow";
import CarouselNextArrow from "../../components/CarouselNextArrow";

export default function MyVairipay() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const targetUserId = state === null ? UserData?._id : state?._id;

  const [varipayRequest, setVaripayRequest] = useState([]);
  const [unpaidRequests, setUnPaidRequeste] = useState([]);

  console.log(
    "🚀 ~ file: MyVairipay.jsx:29 ~ MyVairipay ~ unpaid Vairipay Requests :",
    unpaidRequests
  );

  const [userVaripays, setUserVaripays] = useState([]);
  console.log(
    "🚀 ~ file: MyVairipay.jsx:15 ~ MyVairipay ~ userVaripays:",
    userVaripays
  );
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    loop: true,
    arrow: true,
    slidesToShow: Math.min(6, userVaripays?.length),
    slidesToScroll: 1,
    cssEase: "linear",
    prevArrow: <CarouselPrevArrow />,
    nextArrow: <CarouselNextArrow />,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(4, userVaripays?.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(2, userVaripays?.length),
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

  const getUseraripays = () => {
    VaripayService.getUserVariapys(targetUserId)
      .then((res) => {
        console.log(res);

        setUserVaripays(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserVaripayRequests = () => {
    VaripayService.userVariapayRequests(targetUserId)
      .then((res) => {
        setVaripayRequest(res);
        console.log("res: ", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // let currentRequest = useMemo(() => {
  //   const Req = state.filter((item, index) => {
  //     return item.slug != "paid"
  //   })
  //   setUnpaidRequest(Req);
  //    return Req[currentItemIndex] 
  // }, [state,currentItemIndex])

  console.log(unpaidRequests, "requests")
  useEffect(() => {
    getUseraripays();
    getUserVaripayRequests();
  }, []);

  useEffect(() => {
    const Req = varipayRequest.filter((item, index) => {
      return item.slug != "paid"
    })
    setUnPaidRequeste(Req);
  }, [varipayRequest])

  // hear we need to call get user reques api second time 
  const handelNavigate = () => {
    navigate("/vairipay-request", {
      state: unpaidRequests,
    });
  };

  return (
    <div
      className="main-container px-0"
      style={{ maxHeight: "calc(100vh - 149px)" }}
    >
      <div className="w-full mx-auto flex flex-col items-center inner-content-part-large">
        <div className="w-full max-w-[190px] mx-auto flex flex-row justify-center items-center">
          {/* <div className="mr-2 relative bottom-2">
            <span className="text-[55px] text-[#040B47] font-bold">My</span>
          </div> */}
          <div className="my-4">
            <img src={"/images/my-pay.png"} alt="Vairipay Logo" />
          </div>
        </div>
        <div className="flex flex-col w-full justsify-center items-center mt-2 bg-[#040C50] px-4 shadow-2xl">
          <div className="justify-center items-center bg-[#040C50] px-6 shadow-2xl pt-5 pb-3 w-full">
            <Slider {...settings}>
              {userVaripays?.length > 0 ? (
                userVaripays?.map((varipay, ind) => (
                  <a key={ind} className="">
                    <div
                      className={`mx-auto grid place-content-center ${varipay?.paymentAppName
                        ? "h-[90px] grid-rows-3"
                        : "grid-rows-2"
                        }${varipay?.paymentAppName === "Sugar Apps"
                          ? "max-w-[130px]"
                          : ""
                        }`}
                    >
                      <img
                        className={`row-span-2 ${varipay?.paymentImage ? "h-full" : ""
                          }`}
                        src={
                          varipay?.paymentImage
                            ? import.meta.env
                              .VITE_APP_API_USER_VARIPAY_IMAGE_URL +
                            `/${varipay?.paymentImage}`
                            : "images/no-wallet-white.png"
                        }
                        alt={varipay?.paymentImage || "Default Image"}
                        //width={ varipay?.paymentAppName === "Sugar Apps" ? 90 : 100%}
                        // height={90}
                        style={
                          varipay?.paymentAppName === "Sugar Apps"
                            ? { background: "#405FC4", borderRadius: "10px" }
                            : {}
                        }
                      />
                      {varipay?.paymentAppName && (
                        <div
                          className="flex items-center justify-center text-custom"
                          style={{ background: "transparent", color: "white" }}
                        >
                          <span className="font-bold text-[14px]">
                            {varipay.paymentAppName}
                          </span>
                        </div>
                      )}
                    </div>
                  </a>
                ))
              ) : (
                <img
                  className="w-full"
                  src="images/no-wallet-white.png"
                  alt="No Wallet"
                />
              )}
            </Slider>
          </div>
        </div>
        <div className="form-field-container">
          <div className="w-full px-4">
            <div className="w-full mx-auto flex flex-col justify-center items-center mt-10 py-2 border-2 border-[#000] bg-[#3760CB] max-[350px]:h-[120px] h-[105px] rounded-[20px] max-[350px]:px-10 px-10 shadow-2xl leading-6">
              <span className="text-center pt-2">
                <span className="font-bold text-[22px] text-white">
                  You Have{" "}
                  <span
                    className="w-[30px] h-[30px] text-[20px] text-[#01195C] inline-flex items-center justify-center bg-yellow-400 rounded-full text-lg"
                    style={{ fontWeight: "bold" }}
                  >
                    {unpaidRequests && unpaidRequests.length}
                  </span>{" "}
                  Request
                </span>
              </span>
              <div className="mt-2 mb-1">
                <Button
                  disabled={unpaidRequests.length === 0}
                  onClick={handelNavigate}
                  className={
                    "flex items-center px-[30px] py-2 my-2 max-w-[118px] justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] py-2"
                  }
                  text={"View"}
                  size="36px"
                />
              </div>
            </div>
          </div>

          <div className="w-[100%] pb-5 max-w-[400px] mx-auto flex flex-row justify-between items-start mt-10 px-4">
            <div className="flex flex-col justify-center items-center w-[48%]">
              <div className="relative">
                <img
                  src={import.meta.env.BASE_URL + "images/VAIRIPAYⓒ.png"}
                  alt="Vairipay text"
                  className="w-[100px]"
                />
              </div>
              <div onClick={() => navigate("/vairipay-search")}>
                <img
                  src={import.meta.env.BASE_URL + "images/Vairipay11.png"}
                  className="w-[218px]"
                  alt="Vairipay First"
                />
              </div>
              <div className="relative pt-0">
                <span className="text-[18px] font-bold mt-[-15px] table">
                  P2P APPS
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center w-[48%]">
              <div className="relative">
                <img
                  src={import.meta.env.BASE_URL + "images/VAIRIPAYⓒ.png"}
                  alt="Vairipay text"
                  className="w-[100px]"
                />
              </div>
              <div
                onClick={() => {
                  navigate("/goldentoken");
                }}
              >
                <img
                  src={import.meta.env.BASE_URL + "images/Vairipay22.png"}
                  alt="Vairipay Second"
                  className="w-[218px]"
                />
              </div>
              <div className="relative pt-0">
                <span className="text-[18px] font-bold mt-[-15px] table">
                  Golden Rose Tokens
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
