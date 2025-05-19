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
import BottomTabbar from "../../../components/BottomTabbar/BottomTabbar";
import Loading from "../../../components/Loading/Index";
import { Spinner } from "@material-tailwind/react";

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    if (UserData?._id) {
      dispatch(HandleUpdateUser(UserData?._id))
        .then(() => { })
        .catch((err) => console.log(err));
      VaridateService.getAppointmentsCount(UserData?._id)
        .then((response) => {
          setAppointmentsCount(response);
          dispatch(HandleSaveNotificationCount(response?.notifications));
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <>
      <div className="md:hidden block fixed top-0 sm:h-[80px] h-[70px] w-full bg-[#060C4D] z-50"></div>
      <div className="container ">
        <div
          className="w-full"
        >

          <div className="w-full flex flex-row sm:justify-around justify-between items-end mt-[102px] sm:p-[16px] sm:bg-[#FFFFFF0A] rounded-[16px]">
            <div className="flex flex-col items-center justify-center sm:min-w-[120px] min-w-[80px]">
              <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                VAIRIFY ID
              </div>
              <div className="font-bold sm:text-lg text-base text-white uppercase">
                {userDetails?.item?.userId?.vaiID || UserData?.vaiID}
              </div>
            </div>
            <div className=" relative">
              <div
                className="sm:h-[120px] h-[80px] sm:w-[120px] w-[80px] rounded-full mt-[-74px] relative flex justify-center"
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
                    className="sm:w-[100px] w-[80px] sm:h-[100px] h-[80px] rounded-full  border-2 border-white object-cover"
                    alt="Hot Rod"
                  />
                ) : (
                  <img
                    className="sm:w-[100px] w-[80px] sm:h-[100px] h-[80px] rounded-full  border-2 border-white"
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
              <div className="flex-col flex justify-center items-center mt-[24px]">
                <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                  Name
                </div>
                <span className="font-bold sm:text-lg text-base text-white">
                  {UserData?.name || "Name"}
                </span>
              </div>
            </div>
            <div className="leading-[18px] sm:min-w-[120px] min-w-[80px] flex flex-col justify-center items-center">
              <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                TruRevu
              </div>
              <div className="flex justify-center items-center gap-1">
                <div className="sm:text-lg text-base text-white font-bold ">
                  {rate}
                </div>
                <img src="/images/home/star.svg" alt="star" />
              </div>
            </div>
          </div>

          <div className="sm:my-[48px] my-[24px]">
            <div className="w-full max-w-[500px] mx-auto flex flex-col sm:gap-[24px] gap-[16px]">
              {user_type === "client-hobbyist" && (
                <div className={`w-full relative`}>
                  <Button
                    onClick={() => {
                      navigate("/vairify-search");
                    }}
                    className="w-full secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF40]"
                    size={'48px'}
                    text={'Vairify Now'}
                  />
                </div>
              )}

              {user_type === "client-hobbyist" && (
                <div className={`w-full relative`}>
                  <Button
                    onClick={() => {
                      navigate("/marketplace/search-invite");
                    }}
                    className="w-full secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF40]"
                    text={'Search/Invite'}
                    size={'48px'}
                  />
                </div>
              )}

              <div className={`w-full relative`}>
                <Button
                  onClick={() => {
                    if (user_type === "client-hobbyist") {
                      navigate("/marketplace/sent-invitations");
                    } else {
                      navigate("/marketplace/invitation");
                    }
                  }}
                  className="w-full secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF40]"
                  size={'48px'}
                  text={'Pending Invitations'}
                />
                {loading ? (
                  <div className="absolute right-[14px] top-[14px] h-[20px] w-[20px] animate-spin rounded-full border-2 bg-none border-[#CED4DA] border-t-[#FFFFFF29]"></div>
                ) : (appointmentsCount?.invitation > 0 && (
                  <span className="absolute right-[14px] top-[14px] h-[20px] w-[20px] text-xs rounded-full flex items-center justify-center font-normal bg-[#FFFFFF3D] text-white">
                    {appointmentsCount?.invitation < 99
                      ? appointmentsCount?.invitation
                      : "99+"}
                  </span>
                ))}
              </div>

              <div className={`w-full relative`}>
                <Button
                  onClick={() => navigate("/varidate/upcoming-appointments")}
                  className="w-full secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF40]"
                  size={'48px'}
                  text={'Upcoming Appointments'}
                />
                {loading ? (
                  <div className="absolute right-[14px] top-[14px] h-[20px] w-[20px] animate-spin rounded-full border-2 bg-none border-[#CED4DA] border-t-[#FFFFFF29]"></div>
                ) : (appointmentsCount?.upcoming > 0 && (
                  <span className="absolute right-[14px] top-[14px] h-[20px] w-[20px] text-xs rounded-full flex items-center justify-center font-normal bg-[#FFFFFF3D] text-white">
                    {appointmentsCount?.upcoming < 99
                      ? appointmentsCount?.upcoming
                      : "99+"}
                  </span>
                ))}
              </div>

              <div className={`w-full relative`}>
                <Button
                  onClick={() => navigate("/varidate/invitations-list")}
                  className="w-full secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF40]"
                  size={'48px'}
                  text={'Pending VAIRIDATE'}
                />
                {loading ? (
                  <div className="absolute right-[14px] top-[14px] h-[20px] w-[20px] animate-spin rounded-full border-2 bg-none border-[#CED4DA] border-t-[#FFFFFF29]"></div>
                ) : (appointmentsCount?.pending > 0 && (
                  <span className="absolute right-[14px] top-[14px] h-[20px] w-[20px] text-xs rounded-full flex items-center justify-center font-normal bg-[#FFFFFF3D] text-white">
                    {appointmentsCount?.pending < 99
                      ? appointmentsCount?.pending
                      : "99+"}
                  </span>
                ))}
              </div>

              <div className={`w-full relative`}>
                <Button
                  onClick={() => navigate("/varidate/past-appointments")}
                  className="w-full secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF40]"
                  size={'48px'}
                  text={'Appointments History'}
                />
                {loading ? (
                  <div className="absolute right-[14px] top-[14px] h-[20px] w-[20px] animate-spin rounded-full border-2 bg-none border-[#CED4DA] border-t-[#FFFFFF29]"></div>
                ) : (appointmentsCount?.past > 0 && (
                  <span className="absolute right-[14px] top-[14px] h-[20px] w-[20px] text-xs rounded-full flex items-center justify-center font-normal bg-[#FFFFFF3D] text-white">
                    {appointmentsCount?.past < 99
                      ? appointmentsCount?.past
                      : "99+"}
                  </span>
                ))}
              </div>

              <div className={`w-full relative`}>
                <Button
                  onClick={() => navigate("/vai-now/list")}
                  className="w-full secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF40]"
                  size={'48px'}
                  text={'VAIRIFY NOW Appointments'}
                />
                {loading ? (
                  <div className="absolute right-[14px] top-[14px] h-[20px] w-[20px] animate-spin rounded-full border-2 bg-none border-[#CED4DA] border-t-[#FFFFFF29]"></div>
                ) : (appointmentsCount?.vairifynow > 0 && (
                  <span className="absolute right-[14px] top-[14px] h-[20px] w-[20px] text-xs rounded-full flex items-center justify-center font-normal bg-[#FFFFFF3D] text-white">
                    {appointmentsCount?.vairifynow < 99
                      ? appointmentsCount?.vairifynow
                      : "99+"}
                  </span>
                ))}
              </div>

              <div className="w-full">
                <Button
                  onClick={() => navigate("/vai-now")}
                  className="w-full secondary-btn !bg-[#008F34] hover:!bg-[#1ba44d]"
                  size={'48px'}
                  text={'VAI-CHECK'}
                />
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
        <div className="sm:pb-0 pb-[80px]"></div>
        <BottomTabbar />
      </div>
    </>
  );
}
