import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import Button from "../../components/Button";
import PaySubscriptionServices from "../../services/PaySubscriptionServices";
import { toast } from "react-toastify";
import SettingsService from "../../services/SettingsService";
import Loading from "../../components/Loading/Index";
import { HandleUpdateUser } from "../../redux/action/Auth";
import BottomTabbar from "../../components/BottomTabbar/BottomTabbar";
import PageTitle from "../../components/PageTitle";

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const subscription = UserData?.subscription;
  const KycData = UserData?.kyc;

  const location = useLocation();
  const appointment = location.state;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenVAI, setModalOpenVAI] = useState(false);
  const [currentMembershipIndex, setCurrentMembershipIndex] = useState(0);
  const [currentKycMembershipIndex, setCurrentKycMembershipIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [kycRemainingDays, setKycRemainingDays] = useState(null);
  const [remainingDays, setRemainingDays] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);
  const [pushNotificationLoading, setPushNotificationLoading] = useState(false);


  const closeopen = () => {
    setModalOpen(false);
  };

  const userType = UserData.user_type;

  // const hiddenElement = document.getElementById('hiddenintirepag');

  // if (hiddenElement) {
  //   hiddenElement.style.display = 'none';
  // }

  const vairifyCalendar = () => {
    navigate("/vairify-calendar-setting");
  };

  const toggleOption = () => {
    setIsChecked(!isChecked);
  };

  const toggleStates = (set, value) => {
    set(value);
  };

  const togglePushNotifications = async () => {
    try {
      setPushNotificationLoading(true);
      await SettingsService.updatePushNotification({
        status: !pushNotification,
      });
      dispatch(HandleUpdateUser(UserData?._id));
      setPushNotification(!pushNotification);
      toast.success('Successfully updated push notification');
    } catch (error) {
      console.log(error);
      toast.error("Failed to update push notification");
    } finally {
      setPushNotificationLoading(false);
    }
  };

  const toggleOption1 = () => {
    setIsChecked1(!isChecked2);
  };

  const toggleOption2 = () => {
    setIsChecked2(!isChecked3);
  };

  const toggleOption3 = () => {
    setIsChecked3(!isChecked3);
  };

  const [open, setOpen] = React.useState(1);

  const handleCancelVairifyMemberShip = async () => {
    try {
      if (!UserData?.isMemberShipCancelled) {
        setLoading(true);
        const response = await PaySubscriptionServices.cancelVairifyMemberShip(
          UserData?._id,
          {
            transactionId:
              subscription[currentMembershipIndex]?.transactionId?.transactionId,
          }
        );
        setLoading(false);
        setModalOpen(false);
        toast.success("VAIRIFY Membership Cancelled Successfully");
      } else {
        setLoading(false);
        setModalOpen(false);
        toast.error("VAIRIFY Membership cancelled already");
      }
      await dispatch(HandleUpdateUser(UserData?._id));
    } catch (error) {
      console.log(error);
      toast.error(error);
      setModalOpen(false);
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  //For VAI Kyc Membership Cancellation
  const handleCancelMemberShipVAI = async () => {
    try {
      if (!UserData?.isKycCancelled) {
        setLoading(true);
        const response = await PaySubscriptionServices.cancelVAIMemberShip(
          UserData?._id,
          {
            subscriptionId: KycData[currentKycMembershipIndex]?.subscriptionId,
          }
        );
        setLoading(false);
        setModalOpenVAI(false);
        toast.success("VAI Membership Cancelled Successfully");
      } else {
        setLoading(false);
        setModalOpenVAI(false);
        toast.error("VAI Membership cancelled already");
      }
      await dispatch(HandleUpdateUser(UserData?._id));
    } catch (error) {
      console.log(error);
      toast.error(error);
      setModalOpenVAI(false);
    } finally {
      setLoading(false);
      setModalOpenVAI(false);
    }
  };

  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  const state = {
    parentPage: "Setting",
  };

  useEffect(() => {
    if (subscription && subscription.length > 0) {
      const latestMembership = subscription[currentMembershipIndex];
      if (latestMembership && latestMembership.expiryDate) {
        const expiryDate = moment(latestMembership.expiryDate);
        const currentDate = moment();
        const daysRemaining = expiryDate.diff(currentDate, "days");

        setRemainingDays(daysRemaining);

        if (daysRemaining <= 0) {
          // Current membership has expired, move to the next one
          setCurrentMembershipIndex((prevIndex) => prevIndex + 1);
        }
      }
    }
  }, [subscription, currentMembershipIndex]);

  useEffect(() => {
    if (KycData && KycData?.length > 0) {
      const VairifyMembership = KycData[currentKycMembershipIndex];
      if (VairifyMembership && VairifyMembership.expiryDate) {
        const expiryDate = moment(VairifyMembership.expiryDate);
        const currentDate = moment();
        const daysRemaining = expiryDate.diff(currentDate, "days");

        setKycRemainingDays(daysRemaining);

        if (
          daysRemaining <= 0 &&
          KycData?.length > currentMembershipIndex + 1
        ) {
          setCurrentKycMembershipIndex((prevIndex) => prevIndex + 1);
        }
      }
    }
  }, [KycData, currentKycMembershipIndex]);

  useEffect(() => {
    setPushNotification(UserData?.pushNotification === false ? false : true);
  }, [UserData]);

  if (loading) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <>

      <div className="container">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Settings"} />
        </div>
        <div className="sm:pb-[48px] pb-[24px]">
          <div className="sm:mt-[48px] mt-[24px] grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-[24px]">
            <div className="relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]" onClick={() => navigate('/settings/manage-profile')}>
              <>
                <img src="/images/setup/setup-icon2.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">Manage Profile</span>
                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            <div className="sm:flex relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] hidden items-center sm:justify-center sm:flex-col gap-[12px]"
              onClick={() => navigate('/settings/push-notifications')}>
              <>
                <img src="/images/setup/notification.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">Push Notification</span>

                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            <div className="flex items-center justify-center sm:hidden">
              <div className="flex flex-row justify-between items-center w-full gap-2 py-[14px]">
                <div className="text-[14px] text-normal text-white text-center flex items-center gap-2">
                  <img src="/images/setup/notification.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                  Push notification
                </div>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="notify-post" checked={pushNotification} className="sr-only peer"
                      onChange={togglePushNotifications} disabled={pushNotificationLoading}
                    />
                    <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
                  </label>
                </div>
              </div>
            </div>




            <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
              onClick={() => navigate("/photogallery")}>
              <>
                <img src="/images/setup/setup-icon5.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">Manage Gallery</span>
                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
              onClick={() => navigate("/search-social")}>
              <>
                <img src="/images/setup/setup-icon10.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">Social</span>
                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
              onClick={() => navigate("/my-vairipay")}>
              <>
                <img src="/images/setup/setup-icon4.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">VAIRIPAY Setup</span>
                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            {
              UserData.user_type === "client-hobbyist" ? (
                ""
              ) : (
                <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
                  onClick={() => navigate('/settings/rates-services')}>
                  <>
                    <img src="/images/setup/setup-icon7.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                    <div className="flex items-center">
                      <span className="text-[14px] text-normal text-white text-center">Rates/Services</span>
                    </div>
                    <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
                  </>
                </div>
              )}

            {
              UserData.user_type === "client-hobbyist" ? (
                ""
              ) : (
                <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
                  onClick={() => navigate('/settings/permissions', { state: { userType } })}>
                  <>
                    <img src="/images/setup/profile_permission.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                    <div className="flex items-center">
                      <span className="text-[14px] text-normal text-white text-center">Profile permission</span>
                    </div>
                    <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
                  </>
                </div>
              )}

            <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
              onClick={() => navigate('/settings/manage-vai', { state: { UserData, kycRemainingDays, currentKycMembershipIndex } })}>
              <>
                <img src="/images/setup/manage_vai.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">Manage VAI</span>

                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
              onClick={() => navigate('/settings/manage-membership', { state: { UserData, remainingDays, currentMembershipIndex } })}>
              <>
                <img src="/images/setup/manage_membership.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">Manage Membership</span>
                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
              onClick={() => navigate('/settings/user-payment-history')}>
              <>
                <img src="/images/setup/payment_history.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">Payment History</span>
                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
              onClick={() => navigate('/settings/date-history')}>
              <>
                <img src="/images/setup/date_history.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">View Date History</span>
                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
              onClick={() => navigate('/settings/contracts')}>
              <>
                <img src="/images/setup/contract.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <div className="flex items-center">
                  <span className="text-[14px] text-normal text-white text-center">Contract</span>
                </div>
                <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
              </>
            </div>

            {UserData?.user_type == "agency-business" && (
              <div className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
                onClick={() => navigate('/settings/bussiness-vai-codes')}>
                <>
                  <img src="/images/setup/vai_coupons.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                  <div className="flex items-center">
                    <span className="text-[14px] text-normal text-white text-center">VAI Coupons</span>
                  </div>
                  <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
                </>
              </div>
            )}
          </div>

        </div>
        <div className="sm:pb-0 pb-[80px]"></div>
        <BottomTabbar />
      </div>
      <BottomTabbar />

      {/* <div
        id="settings"
        className="main-container px-0 min-h-[calc(100vh-150px)]"
      >
        <div className="w-full flex flex-col justify-center items-center mt-4 py-2 px-[30px]">
          <span className="font-bold text-[26px] text-[#040C50]">Settings</span>
        </div>
        <div className="accordion-data-part px-4">
          <Accordion open={open === 1}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Manage Profile
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                <div
                  className="link-part relative"
                  onClick={() => navigate("/user/profile")}
                >
                  <p>View Profile</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div
                  className="link-part relative"
                  onClick={() =>
                    navigate("/personal-information", {
                      state,
                    })
                  }
                >
                  <p>Change personal information</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div
                  className="link-part relative"
                  onClick={() => navigate("/language", { state: { from: "/settings" } })}
                >
                  <p>Changing language</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center  bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div
                  className="link-part relative"
                  onClick={() => navigate("/settings/faviourite-locations")}
                >
                  <p>Favorite locations</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div
                  className="link-part relative"
                  onClick={() => navigate("/manage-incall-addresses")}
                >
                  <p>Edit in call/outcall location</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center  bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div
                  className="link-part relative"
                  onClick={() => navigate("/cal-setting")}
                >
                  <p>Change your schedules and availability</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center  bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 2} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(2)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Security
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                <div
                  className="link-part relative"
                  onClick={() => navigate("/change-password")}
                >
                  <p>Change Password</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 3} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(3)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Notification and alerts
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                <div className="link-part relative">
                  <div className="w-full flex flex-row justify-between items-left rounded-[5px]">
                    <span className="w-full relative text-[18px] font-medium text-black">
                      Push Notification
                    </span>
                    {pushNotificationLoading ? (
                      <Loading />
                    ) : (
                      <div className="switch-container">
                        <input
                          type="checkbox"
                          id="yesCheckbox"
                          checked={pushNotification}
                          onChange={togglePushNotifications}
                          className="hidden"
                          disabled={pushNotificationLoading}
                        />
                        <label
                          htmlFor="yesCheckbox"
                          className={`switch-button ${pushNotification ? "active" : ""
                            }`}
                        >
                          Yes
                        </label>
                        <label
                          htmlFor="yesCheckbox"
                          className={`switch-button ${!pushNotification ? "active" : ""
                            }`}
                        >
                          No
                        </label>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 4} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(4)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Manage Gallery{" "}
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                <div
                  className="link-part relative"
                  onClick={() => navigate("/photogallery")}
                >
                  <p>Upload photos</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 5} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(5)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Manage social media{" "}
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                <div
                  className="link-part relative"
                  onClick={() => navigate("/search-social")}
                >
                  <p>Social media setup</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 6} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(6)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Manage{" "}
                <span className="font-extrabold uppercase">
                  VAI<span className="logoSetupweight">ripay</span>
                </span>{" "}
                p2p apps
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                <div
                  className="link-part relative"
                  onClick={() => navigate("/my-vairipay")}
                >
                  <p>
                    <span className="font-extrabold uppercase">
                      VAI<span className="logoSetupweight">ripay</span>
                    </span>{" "}
                    setup
                  </p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 7} className="mt-2">
            {
              UserData.user_type === "client-hobbyist" ? (
                ""
              ) : (
                <>
                  <AccordionHeader
                    onClick={() => handleOpen(7)}
                    className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
                  >
                    <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                      Services and rates
                    </span>
                    <div
                      style={{ top: "2px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
                    >
                      <svg
                        className={`w-8 h-8 fill-white text-blue-500 $`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </AccordionHeader>
                  <AccordionBody>
                    <div className="accordion-body-data">
                      <div
                        className="link-part relative"
                        onClick={() => navigate("/services")}
                      >
                        <p>Edit services</p>
                        <div
                          style={{ top: "0px" }}
                          className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                        >
                          <svg
                            className={`w-6 h-6 fill-black text-blue-500 $`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                      <div
                        className="link-part relative"
                        onClick={() => navigate("/schedule")}
                      >
                        <p>Edit Hours/Calendar</p>
                        <div
                          style={{ top: "0px" }}
                          className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                        >
                          <svg
                            className={`w-6 h-6 fill-black text-blue-500 $`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                      <div
                        className="link-part relative"
                        onClick={() => navigate("/hourly-rates")}
                      >
                        <p>Edit Rates</p>
                        <div
                          style={{ top: "0px" }}
                          className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                        >
                          <svg
                            className={`w-6 h-6 fill-black text-blue-500 $`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </AccordionBody>
                </>
              )
            }
          </Accordion>
          {UserData.user_type === "client-hobbyist" ? (
            ""
          ) : (
            <>
              <Accordion open={open === 8} className="mt-2">
                <AccordionHeader
                  onClick={() => handleOpen(8)}
                  className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
                  style={{ lineHeight: "26px" }}
                >
                  <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                    Role and permissions
                  </span>
                  <div
                    style={{ top: "2px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
                  >
                    <svg
                      className={`w-8 h-8 fill-white text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </AccordionHeader>
                <AccordionBody>
                  <div className="accordion-body-data">
                    {userType === "agency-business" && (
                      <>
                        <div className="link-part relative">
                          <Link to="/service-business/add-staff">
                            <p>Add Staff</p>
                            <div
                              style={{ top: "0px" }}
                              className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                            >
                              <svg
                                className={`w-6 h-6 fill-black text-blue-500 $`}
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                              </svg>
                            </div>
                          </Link>
                        </div>

                        <div className="link-part relative">
                          <Link to="/service-business/user-list">
                            <p>Admin permissions</p>
                            <div
                              style={{ top: "0px" }}
                              className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                            >
                              <svg
                                className={`w-6 h-6 fill-black text-blue-500 $`}
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                              </svg>
                            </div>
                          </Link>
                        </div>

                        <div className="link-part relative">
                          <Link to="/service-business/user-list">
                            <p>Staff permission</p>
                            <div
                              style={{ top: "0px" }}
                              className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                            >
                              <svg
                                className={`w-6 h-6 fill-black text-blue-500 $`}
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                              </svg>
                            </div>
                          </Link>
                        </div>
                      </>
                    )}
                    <div className="link-part relative">
                      <Link to="/profile-permissions">
                        <p>Profile permissions</p>
                        <div
                          style={{ top: "0px" }}
                          className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                        >
                          <svg
                            className={`w-6 h-6 fill-black text-blue-500 $`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </Link>
                    </div>

                  </div>
                </AccordionBody>
              </Accordion>
            </>)}
          {UserData?.user_type == "agency-business" && (
            <Accordion open={open === 9} className="mt-2">
              <AccordionHeader
                onClick={() => handleOpen(9)}
                className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
                style={{ lineHeight: "26px" }}
              >
                <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                  VAI coupons
                </span>
                <div
                  style={{ top: "2px" }}
                  className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
                >
                  <svg
                    className={`w-8 h-8 fill-white text-blue-500 $`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </AccordionHeader>
              <AccordionBody>
                <div className="accordion-body-data">
                  <div className="link-part relative">
                    <Link to="/bussiness-vai-codes">
                      <p>VAI coupons</p>
                      <div
                        style={{ top: "0px" }}
                        className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                      >
                        <svg
                          className={`w-6 h-6 fill-black text-blue-500 $`}
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              </AccordionBody>
            </Accordion>
          )}
          <Accordion open={open === 10} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(10)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Manage VAI
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                {UserData?.isKycCompleted || UserData?.isKycCompleted === true ? (
                  <div className="link-part relative">
                    <p>V.A.I</p>
                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent`}
                    >
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="w-5 h-5 fill-black text-[#0CA36C]"
                      />
                    </div>
                  </div>
                ) : (
                  kycRemainingDays > 0 ? (
                    <div className="link-part relative opacity-25">
                      <p>V.A.I</p>
                      <div
                        style={{ top: "0px" }}
                        className={`border-[#CFCFCF] b  order-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                      >
                        <svg
                          className={`w-6 h-6 fill-black text-blue-500 $`}
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                        </svg>
                      </div>
                    </div>
                  ) : (<>
                    < div className="link-part relative">
                      <Link
                        to={{
                          pathname: "/vai",
                          state: { isSetting: true },
                        }}
                      >
                        <p>V.A.I</p>
                        <div
                          style={{ top: "0px" }}
                          className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                        >
                          <svg
                            className={`w-6 h-6 fill-black text-blue-500 $`}
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                          </svg>
                        </div>
                      </Link>
                    </div>
                  </>)
                )}
                <div className="link-part relative">
                  <Link to="#">
                    <p>Status</p>
                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent`}
                    >
                      {kycRemainingDays === null ? (
                        <p>Inactive</p>
                      ) : UserData.isKycCancelled === true ? <p>Active/Cancel</p> : kycRemainingDays <= 0 ? (
                        <p>Inactive</p>
                      ) : (
                        <p>Active</p>
                      )}
                    </div>
                  </Link>
                </div>
                <div className="link-part relative">
                  <Link to="/kyc-membership-history">
                    <p>History</p>
                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                    >
                      <svg
                        className={`w-6 h-6 fill-black text-blue-500 $`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </Link>
                </div>
                <div className="link-part relative">
                  <p>Days Remaining</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent`}
                  >
                    {kycRemainingDays === null ? (
                      <p>0 days</p>
                    ) : (
                      <p>{`${kycRemainingDays} days`}</p>
                    )}
                  </div>
                </div>
                {!UserData?.isKycCancelled && kycRemainingDays > 0 ? (
                  <div
                    className="link-part relative"
                    onClick={() => setModalOpenVAI(!modalOpenVAI)}
                  >
                    <p>Cancel Membership</p>

                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                    >
                      <svg
                        className={`w-6 h-6 fill-black text-blue-500 $`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </div>
                ) : kycRemainingDays <= 0 ? (
                  <div className="link-part relative">
                    <Link to="/vai-membership-plans">
                      <p>
                        {UserData?.kyc?.length > 0 ? "Renew " : "Purchase "}
                        <span className="font-extrabold">VAI</span> Membership
                      </p>
                      <div
                        style={{ top: "0px" }}
                        className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                      >
                        <svg
                          className={`w-6 h-6 fill-black text-blue-500 $`}
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="link-part relative opacity-25">
                    <p>
                      Renew
                      <span className="font-extrabold">VAI</span> Membership
                    </p>
                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                    >
                      <svg
                        className={`w-6 h-6 fill-black text-blue-500 $`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 11} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(11)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Manage Membership
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                <div className="link-part relative">
                  <Link to="#">
                    <p>Status</p>
                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent`}
                    >
                      {remainingDays === null ?
                        (
                          <p>Inactive</p>
                        ) : UserData.isMemberShipCancelled === true ? <p>Active/Cancel</p> : remainingDays <= 0 ? (
                          <p>Inactive</p>
                        ) : (
                          <p>Active</p>
                        )}
                    </div>
                  </Link>
                </div>
                <div className="link-part relative">
                  <Link to="/vairify-membership-history">
                    <p>History</p>
                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                    >
                      <svg
                        className={`w-6 h-6 fill-black text-blue-500 $`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </Link>
                </div>
                <div className="link-part relative">
                  <p>Days Remaining</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent`}
                  >
                    {remainingDays === null ? (
                      <p>0 days</p>
                    ) : (
                      <p>{`${remainingDays} days`}</p>
                    )}
                  </div>
                </div>
                {remainingDays > 0 ? (
                  <div className='link-part relative opacity-25'>
                    <p className="font-extrabold">
                      VAI<span className="logoSetupweight">RIFY</span>
                    </p>
                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                    >
                      <svg
                        className={`w-6 h-6 fill-black text-blue-500 $`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </div>
                ) : (

                  <div className='link-part relative'>
                    <Link to="/vairify-membership-plans">
                      <p className="font-extrabold">
                        VAI<span className="logoSetupweight">RIFY</span>
                      </p>
                      <div
                        style={{ top: "0px" }}
                        className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                      >
                        <svg
                          className={`w-6 h-6 fill-black text-blue-500 $`}
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                )}
                {!UserData?.isMemberShipCancelled && remainingDays > 0 ? (
                  <div
                    className="link-part relative"
                    onClick={() => setModalOpen(!modalOpen)}
                  >
                    <p>Cancel Membership</p>

                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                    >
                      <svg
                        className={`w-6 h-6 fill-black text-blue-500 $`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </div>
                ) : remainingDays <= 0 ? (
                  <div className="link-part relative">
                    <Link to="/vairify-membership-plans">
                      <p>
                        {UserData?.subscription?.length > 0
                          ? "Renew "
                          : "Purchase "}
                        <span className="font-extrabold">
                          VAI<span className="logoSetupweight">RIFY</span>
                        </span>{" "}
                        Membership
                      </p>
                      <div
                        style={{ top: "0px" }}
                        className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                      >
                        <svg
                          className={`w-6 h-6 fill-black text-blue-500 $`}
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="link-part relative opacity-25">
                    <p>
                      Renew{" "}
                      <span className="font-extrabold">
                        VAI<span className="logoSetupweight">RIFY</span>
                      </span>{" "}
                      Membership
                    </p>
                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                    >
                      <svg
                        className={`w-6 h-6 fill-black text-blue-500 $`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </AccordionBody>
          </Accordion>

          <Modal
            isOpen={modalOpen}
            onRequestClose={closeopen}
            className=" w-[360px] h-[210px] bg-[#3760CB] relative center-modal rounded-2xl px-4"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2"
            >
              <img
                src="/images/Mask group-close.png"
                alt=""
                width="30px"
                height="30px"
              />
            </button>
            <div className="pt-8">
              <p className="text-[24px] font-bold text-center text-[#fff] leading-8">
                Are you sure you want to cancel your{" "}
                <span className="font-extrabold">
                  VAI<span className="logoSetupweight">RIFY</span>
                </span>{" "}
                membership?
              </p>
              <div className="flex justify-around items-center w-full pt-2">
                <div className="w-[40%]">
                  <Button
                    className={
                      "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
                    }
                    text={"Yes"}
                    size="45px"
                    onClick={handleCancelVairifyMemberShip}
                  />
                </div>
                <div className="w-[40%]">
                  <Button
                    className={
                      "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
                    }
                    text={"No"}
                    size="45px"
                    onClick={() => setModalOpen(false)}
                  />
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={modalOpenVAI}
            onRequestClose={() => setModalOpenVAI(false)}
            className=" w-[360px] h-[180px] bg-[#3760CB] relative center-modal rounded-2xl px-4"
          >
            <button
              onClick={() => setModalOpenVAI(false)}
              className="absolute top-2 right-2"
            >
              <img
                src="/images/Mask group-close.png"
                alt=""
                width="30px"
                height="30px"
              />
            </button>
            <div className="pt-8">
              <p className="text-[24px] font-bold text-center text-[#fff] leading-8">
                Are you sure you want to cancel your VAI membership?
              </p>
              <div className="flex justify-around items-center w-full pt-2">
                <div className="w-[40%]">
                  <Button
                    className={
                      "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
                    }
                    text={"Yes"}
                    size="45px"
                    onClick={handleCancelMemberShipVAI}
                  />
                </div>
                <div className="w-[40%]">
                  <Button
                    className={
                      "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
                    }
                    text={"No"}
                    size="45px"
                    onClick={() => setModalOpenVAI(false)}
                  />
                </div>
              </div>
            </div>
          </Modal>
          <Accordion open={open === 12} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(12)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Manage payments
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                <div className="link-part relative">
                  <Link to="/user-payment-history">
                    <p>Payment history</p>
                    <div
                      style={{ top: "0px" }}
                      className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                    >
                      <svg
                        className={`w-6 h-6 fill-black text-blue-500 $`}
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 13} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(13)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                View date history
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div
                className="accordion-body-data"
                onClick={() => navigate("/settings/date-history")}
              >
                <div className="link-part relative">
                  <p>Show date history, with mutual contract</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AccordionBody>
          </Accordion>
          {UserData.user_type !== "influencer-affiliate" ? ("") : (
            <>
              <Accordion open={open === 14} className="mt-2">
                <AccordionHeader
                  onClick={() => handleOpen(14)}
                  className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative"
                >
                  <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                    Revunue payment history
                  </span>
                  <div
                    style={{ top: "2px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
                  >
                    <svg
                      className={`w-8 h-8 fill-white text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </AccordionHeader>
                <AccordionBody>
                  <div className="accordion-body-data">
                    <div className="link-part relative">
                      <p>Revenue affiliate history</p>
                      <div
                        style={{ top: "0px" }}
                        className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                      >
                        <svg
                          className={`w-6 h-6 fill-black text-blue-500 $`}
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </AccordionBody>
              </Accordion>
            </>)}

          <Accordion open={open === 15} className="mt-2">
            <AccordionHeader
              onClick={() => handleOpen(15)}
              className="w-full flex flex-row justify-between items-left personal-information-btn h-[40px] leading-[34px] rounded-[5px] mb-2 relative accordian-header-last"
            >
              <span className="w-full relative text-[20px] font-semibold text-white text-left px-3">
                Contracts disclosures and terms and conditions, privacy policy
              </span>
              <div
                style={{ top: "2px" }}
                className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent `}
              >
                <svg
                  className={`w-8 h-8 fill-white text-blue-500 $`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="accordion-body-data">
                <div className="link-part relative" onClick={() => navigate('/mutalconsent')}>
                  <p>Consent contract</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div className="link-part relative" onClick={() => navigate('/disclosure')}>
                  <p>Law enforcement disclosure</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div className="link-part relative" onClick={() => navigate('/privacy-policy')}>
                  <p>Privacy policy</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div className="link-part relative">
                  <p>Cookie policy</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div className="link-part relative" onClick={() => navigate('/terms-and-conditions')}>
                  <p>Term and conditions</p>
                  <div
                    style={{ top: "0px" }}
                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent left-icon-part`}
                  >
                    <svg
                      className={`w-6 h-6 fill-black text-blue-500 $`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AccordionBody>
          </Accordion>
        </div>
      </div> */}
    </>
  );
}
