import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PersonalInformationBtn from "../../../components/PersonalInformationBtn";
import Modal from "react-modal";
import InputText from "../../../components/InputText";
import VaripayService from "../../../services/VaripayServices";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Button";
import {
  HandleSaveNotificationCount,
  HandleUpdateUser,
} from "../../../redux/action/Auth";
import VaridateService from "../../../services/VaridateServices";

export default function Marketplace() {
  const { state: userDetails } = useLocation();
  const dispatch = useDispatch();
  console.log("🚀 ~ file: HotRod.jsx:13 ~ HotRod ~ userDetails:", userDetails);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const Auth = useSelector((state) => state?.Auth?.Auth);
  let TargetUserId = userDetails?.item?.userId?._id;
  console.log(TargetUserId);
  const [messageOpen, setMessageOpen] = useState(false);
  const [ammount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  console.log(UserData);
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

  useEffect(() => {
    if (UserData?._id) {
      dispatch(HandleUpdateUser(UserData?._id))
        .then(() => {})
        .catch((err) => console.log(err));
      VaridateService.getAppointmentsCount(UserData?._id)
        .then((response) => {
          setAppointmentsCount(response);
          dispatch(HandleSaveNotificationCount(response?.notifications));
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="main-container ">
      <div
        className="w-full mx-auto flex flex-col justify-center items-center"
        // style={{ marginTop: "4rem" }}
      >
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-4">
          <div className="flex flex-col items-center justify-center leading-[18px]">
            <div>
              <span className="text-[18px] text-[#040C50] font-extrabold">
                VAI
                <span className="text-[18px] text-[#040C50] font-semibold">
                  RIFY ID
                </span>
              </span>
            </div>
            <div>
              <span className="text-[15px] text-[#040C50] font-bold uppercase">
                {userDetails?.item?.userId?.vaiID || UserData?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "0px", bottom: "65px", zIndex: 50 }}
              className="absolute w-full h-full rounded-full"
            >
              {userDetails?.item?.userId?.profilePic || UserData?.profilePic ? (
                <img
                src={
                  import.meta.env.VITE_APP_S3_IMAGE +
                  `/${
                    userDetails?.item?.userId?.profilePic ||
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
                  className="w-[120px] h-[120px] rounded-full"
                  alt="Hot Rod"
                />
              ) : (
                <img
                  className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
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
            {/* <div
              style={{ right: "0px", top: "25px", zIndex: 51 }}
              className="absolute"
            >
              <img
                src={import.meta.env.BASE_URL + "images/HotRodIcon2.png"}
                alt="Hot Rod Icon Second"
              />
            </div> */}
          </div>
          <div className="leading-[18px]">
            <div>
              <span className="text-[18px] text-[#040C50] font-bold">
                TruRevu
              </span>
            </div>
            {/* TODO: make this ratings dynamic once truview is implemented */}
            <div className="flex flex-row justify-center items-center">
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 1 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 2 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 3 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 4 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 5 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <span className="text-[15px] text-[#040C50] font-bold">
                {rate}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
          <span className="font-bold text-[24px] ">
            {userDetails?.item?.userId?.name}
          </span>
        </div>

        <h3 className="font-bold text-[22px] mt-2 capitalize">
          {UserData?.name || "Name"}
        </h3>
        <h1 className="text-[24px] font-bold">Market Place</h1>
        <div className="inner-content-part-country pb-4">
          <div className="w-full max-w-[500px]">
            {user_type === "client-hobbyist" && (
              <div className="w-full mx-auto flex items-center justify-center mt-4">
                <div className={`w-full relative h-[47.7px]`}>
                  <button
                    onClick={() => {
                      navigate("/vairify-search");
                    }}
                    className="w-full personal-information-btn p-2"
                  >
                    <div className="text-custom f-custom-white">
                      <span
                        className={`w-full relative text-[24px] font-bold uppercase`}
                      >
                        Vai<span className="logoSetupweight">rify Now</span>
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {user_type === "client-hobbyist" && (
              <div className="w-full mx-auto flex items-center justify-center mt-4">
                <div className={`w-full relative h-[47.7px]`}>
                  <button
                    onClick={() => {
                      navigate("/marketplace/search-invite");
                    }}
                    className="w-full personal-information-btn p-2"
                  >
                    <div className="text-custom f-custom-white">
                      <span className={`w-full relative text-[24px] font-bold`}>
                        Search/Invite
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div className="w-full mx-auto flex items-center justify-center mt-4">
              <div className={`w-full relative h-[47.7px]`}>
                <button
                  onClick={() => {
                    if (user_type === "client-hobbyist") {
                      navigate("/marketplace/sent-invitations");
                    } else {
                      navigate("/marketplace/invitation");
                    }
                  }}
                  className="w-full personal-information-btn p-2 px-3"
                  px-3
                >
                  {appointmentsCount?.invitation > 0 && (
                    <span className="absolute right-0 top-[-10px]  h-6 w-6 text-xs rounded-full flex items-center justify-center font-bold bg-green-btn">
                      {appointmentsCount?.invitation < 99
                        ? appointmentsCount?.invitation
                        : "99+"}
                    </span>
                  )}
                  <div className="text-custom f-custom-white px-3">
                    <span
                      className={`w-full relative text-[24px] font-bold px-3`}
                    >
                      Pending Invitations
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="w-full mx-auto flex items-center justify-center mt-4">
              <div className={`w-full relative h-[47.7px]`}>
                <button
                  onClick={() => navigate("/varidate/upcoming-appointments")}
                  className="w-full personal-information-btn p-2 relative px-3"
                >
                  {appointmentsCount?.upcoming > 0 && (
                    <span className="absolute right-0 top-[-10px] bg-white h-6 w-6 text-xs rounded-full flex items-center justify-center font-bold bg-green-btn">
                      {appointmentsCount?.upcoming < 99
                        ? appointmentsCount?.upcoming
                        : "99+"}
                    </span>
                  )}
                  <div className="text-custom f-custom-white">
                    <span className={`w-full relative text-[24px] font-bold`}>
                      Upcoming Appointments
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="w-full mx-auto flex items-center justify-center mt-4">
              <div className={`w-full relative h-[47.7px]`}>
                <button
                  onClick={() => navigate("/varidate/invitations-list")}
                  className="w-full personal-information-btn p-2 relative px-3"
                >
                  {appointmentsCount?.pending > 0 && (
                    <span className="absolute right-0 top-[-10px] bg-white h-6 w-6 text-xs rounded-full flex items-center justify-center font-bold bg-green-btn">
                      {appointmentsCount?.pending < 99
                        ? appointmentsCount?.pending
                        : "99+"}
                    </span>
                  )}
                  <div className="text-custom f-custom-white">
                    <span
                      className={`w-full relative text-[24px] font-extrabold uppercase`}
                    >
                      Pending VAI<span className="logoSetupweight">RIDATE</span>
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="w-full mx-auto flex items-center justify-center mt-4">
              <div className={`w-full relative h-[47.7px]`}>
                <button
                  onClick={() => navigate("/varidate/past-appointments")}
                  className="w-full personal-information-btn p-2 relative px-3"
                >
                  {appointmentsCount?.past > 0 && (
                    <span className="absolute right-0 top-[-10px] bg-white h-6 w-6 text-xs rounded-full flex items-center justify-center font-bold bg-green-btn">
                      {appointmentsCount?.past < 99
                        ? appointmentsCount?.past
                        : "99+"}
                    </span>
                  )}
                  <div className="text-custom f-custom-white">
                    <span className={`w-full relative text-[24px] font-bold`}>
                      Appointments History
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="w-full mx-auto flex items-center justify-center mt-4">
              <div className={`w-full relative h-[47.7px]`}>
                <button
                  onClick={() => navigate("/vai-now/list")}
                  className="w-full personal-information-btn p-2 relative px-3"
                >
                  {appointmentsCount?.vairifynow > 0 && (
                    <span className="absolute right-0 top-[-10px] bg-white h-6 w-6 text-xs rounded-full flex items-center justify-center font-bold bg-green-btn">
                      {appointmentsCount?.vairifynow < 99
                        ? appointmentsCount?.vairifynow
                        : "99+"}
                    </span>
                  )}
                  <div className="text-custom f-custom-white">
                    <span
                      className={`w-full relative text-[24px] font-bold uppercase`}
                    >
                      Vai<span className="logoSetupweight">rify Now</span>
                      <span className="capitalize"> Appointments</span>
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="px-6 w-full pt-2.5 pb-3.5 mt-5">
              <button
                onClick={() => navigate("/vai-now")}
                className=" bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
              >
                VAI-CHECK
              </button>
            </div>
          </div>
        </div>
      </div>
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
                  <p className="text-[18px] font-EXTRAbold text-[#fff] uppercase">
                    VAI<span className="logoSetupweight">RIDATE</span>
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
