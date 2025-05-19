import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import InputText from "../../../components/InputText";
import VaripayService from "../../../services/VaripayServices";
import { useSelector } from "react-redux";
import VaiCheckList from "./pendingVaiCheckList";
import Button from "../../../components/Button";
import QRCode from "react-qr-code";
import PageTitle from "../../../components/PageTitle";

export default function VaiNow() {
  const { state: userDetails } = useLocation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const [messageOpen, setMessageOpen] = useState(false);
  const [ammount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [qrOpen, setQrOpen] = useState(false);

  const handelUserRequest = () => {
    let body = {
      requester: UserData._id, // or yahan jo request kar raha ha wo
      targetUser: TargetUserId, // jis saye pasey chayen
      amount: ammount,
      comment: message,
    };
    VaripayService.createUserVaripayRequest(body)
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeMessage = () => {
    setMessageOpen(false);
  };

  const navigate = useNavigate();
  const navigateToAboutMe = () => {
    navigate("/about-me");
  };

  const user_type = UserData?.user_type;
  const rate = (
    (UserData?.profileReviews || []).reduce(
      (total, item) => total + item.rating,
      0
    ) / ((UserData?.profileReviews || []).length || 1)
  )?.toFixed(1);

  return (
    <div className="container mb-[48px]">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"VAI - CHECK"} />
      </div>
      <div className="flex gap-[24px] items-start lg:flex-nowrap flex-wrap">

        <div
          className=" sm:bg-[#FFFFFF0A] sm:p-[16px] rounded-[16px] w-full max-w-[350px] lg:mx-0 mx-auto"
        >
          <div
            // style={{ left: "0px", bottom: "65px", zIndex: 50 }}
            className="flex justify-center items-center"
          >
            {userDetails?.item?.userId?.profilePic || UserData?.profilePic ? (
              <img
                src={
                  import.meta.env.VITE_APP_S3_IMAGE +
                  `/${userDetails?.item?.userId?.profilePic ||
                  UserData?.profilePic
                  }`
                }
                // src={
                //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //   `/${
                //     userDetails?.item?.userId?.profilePic ||
                //     UserData?.profilePic
                //   }`
                // }
                className="w-[100px] h-[100px] rounded-full object-cover"
                alt="Hot Rod"
              />
            ) : (
              <img
                className="w-[100px] h-[100px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                src={
                  (userDetails?.item?.userId?.gender || UserData?.gender) ===
                    "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                alt="Hot Rod"
              />
            )}
          </div>
          <div className="w-full mx-auto flex flex-row justify-around items-start mt-[24px] gap-[24px]">

            <div className="flex flex-col items-center justify-center  w-full ">
              <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                VAIRIFY ID
              </div>
              <div className="text-base text-white font-semibold  whitespace-nowrap">
                {userDetails?.item?.userId?.vaiID || UserData?.vaiID}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center  w-full">
              <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                Name
              </div>
              <div className="text-base text-white font-semibold whitespace-nowrap">
                {UserData?.name || "Name"}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center  w-full ">
              <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                TruRevu
              </div>
              <div className="flex gap-1 items-center">
                <p className="text-[18px] text-white font-bold m-0">
                  {rate}
                </p>
                <img src="/images/home/star.svg" alt="star" />
              </div>
            </div>
          </div>
          {/* <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
            <span className="font-bold text-[24px]">
              {userDetails?.item?.userId?.name}
            </span>
          </div> */}
          {/* <h1>Vai Now</h1> */}
          <div className="mt-[24px]">
            {user_type === "client-hobbyist" && (
              <Button
                onClick={() => navigate("/vai-now/scan-qr")}
                text={"Scan QR"}
                size={'36px'}
                className={'py-[4px] sm:!bg-white !bg-[#283B7B] hover:!bg-[#3660cb]'}
                textClass={'!text-white sm:!text-[#060C4D]'}
              />
            )}
            {!(user_type === "client-hobbyist") && (
              <Button
                onClick={() => setQrOpen(true)}
                text="Show QR"
                className={'py-[4px] sm:!bg-white !bg-[#283B7B] hover:!bg-[#3660cb]'}
                textClass={'!text-white sm:!text-[#060C4D]'}
                size={'36px'}
              />

            )}

            <div className="mt-[16px]">
              <Button
                onClick={() => navigate("/vai-check/list")}
                text={'List'}
                className={'py-[4px] lg:hidden block secondary-btn sm:!bg-[#FFFFFF29] !bg-[#283B7B]'}
                size={'36px'}
              />
            </div>
          </div>
        </div>

        <div className="lg:block hidden w-full">
          <VaiCheckList />
        </div>
      </div>

      <Modal
        isOpen={qrOpen}
        //   onAfterOpen={afterMessageOpen}
        onRequestClose={() => setQrOpen(false)}
        className={
          "bg-white relative max-w-[500px] mx-auto w-[90%] rounded-[16px]"
        }
        contentLabel="#"
      >
        <div className="p-[24px] rounded-[16px]">
          <div className="flex flex-col pb-2">
            <div className="flex relative justify-center mb-3">
              <button
                onClick={() => setQrOpen(false)}
                className="mt-1 absolute top-0 right-0"
              >
                <img
                  src="/images/home/close.svg"
                  alt=""
                  width="24px"
                  height="24px"
                />
              </button>
              <p className="text-xl font-semibold text-center text-[#212B36]">
                QR Code
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center sm:my-[24px] my-[10px]">
              <QRCode
                value={`${import.meta.env.VITE_APP_PUBLIC_URL}/public/profile/${userDetails?.market || userDetails?.vairipay
                  ? userDetails?.item?.userId?.vaiID ||
                  userDetails?.item?.vaiID
                  : UserData?.vaiID
                  }`}
                height={400}
                width={400}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={messageOpen}
        //   onAfterOpen={afterMessageOpen}
        onRequestClose={closeMessage}
        className={
          "bg-[#3760CB] relative top-[50%] translate-y-[-50%] max-w-[450px] mx-auto py-4 w-[95%] rounded-3xl border-2 border-[#fff] px-4"
        }
        contentLabel="#"
      >
        <div className=" sm:h-fit bg-[#3760CBD4]">
          <div className="flex">
            <div className="flex flex-col justify-between items-center w-[30%]">
              <img
                src={
                  userDetails?.item?.userId?.profilePic
                    ? import.meta.env.VITE_APP_S3_IMAGE +
                    `/${userDetails?.item?.userId?.profilePic}`
                    : "/images/gallery-peofile.png"
                }
                // src={
                //   userDetails?.item?.userId?.profilePic
                //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //       `/${userDetails?.item?.userId?.profilePic}`
                //     : "/images/gallery-peofile.png"
                // }
                alt=""
                className="w-[74px] sm:w-[84px] h-[72.44px] rounded-full sm:h-[84px]"
              />
              <p className="text-[12px] mt-1 text-[#fff] font-bold pt-px leading-[10.57px]">
                TruRevu
              </p>
              <p className="text-[12px] text-[#fff] pb-1 font-bold text-center leading-[17.57px]">
                {userDetails?.item?.userId?.name}{" "}
                {userDetails?.item?.userId?.vaiID}
              </p>
              <div className="flex gap-1 pb-1 items-start">
                <div className="flex gap-1 mt-1">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <img
                      src="/images/Star.svg"
                      className="w-[10px]  h-[10px]"
                      alt=""
                    />
                  ))}
                </div>
                <span className="text-white block text-center  font-roboto font-bold text-[15px]">
                  5.0
                </span>
              </div>
              <p className="text-[14px] text-[#fff] font-bold rounded-2xl border-2 border-[#fff] bg-[#02227E] px-2 py-px text-center h-fit min-h-[33.7px] flex justify-center items-center">
                View Profile
              </p>
            </div>
            <div className="w-[74%]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[14px] font-bold text-[#fff] text-center leading-[17.57px]">
                    Amount Requested
                  </p>
                  <div className="flex justify-center items-center">
                    <div className="w-[100px]">
                      <InputText
                        value={ammount}
                        onChange={(e) => setAmount(e.target.value)}
                        size="25px"
                        className="text-[24px] font-bold text-[#01195C] h-[25px]"
                        placeholder={"$500"}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#fff]">
                    Request Type{" "}
                  </p>
                  <p className="text-[18px] font-extrabold text-[#fff] uppercase">
                    VAI<span className='logoSetupweight'>RIDATE</span>
                  </p>
                </div>
              </div>
              <div className="pb-px pt-5">
                <p className="text-[10px] font-bold text-center text-[#fff]">
                  Comments
                </p>
                <div className="px-7">
                  <InputText
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    size="59px"
                    bgColor="[#D9D9D97D]"
                    border="#02227E"
                    className="border-2 rounded-2xl"
                  />
                </div>
              </div>
              <div className="my-1 flex justify-center h-[34px] flex justify-center items-center pt-2">
                <p
                  onClick={handelUserRequest}
                  className="text-[#FFFFFF] text-[20px] font-bold mt-2 px-7 py-2 rounded-2xl bg-gradient-to-b from-[#A30C30] to-[#DB3002] max-w-[150px] text-center"
                >
                  Send
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
