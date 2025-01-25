import "./App.css";
import "./assets/css/custom.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import LoginPage from "./pages/Auth/Login/LoginPage";
import Signup from "./pages/Auth/SignUp";
import SelectCategory from "./pages/Auth/SelectCategory/SelectCategory";
import OTPVerificationPage from "./pages/Auth/OTPVerification/OTPVerificationPage";
import CongratulationsPage from "./pages/Auth/CongratulationsPage/CongratulationsPage";

import ResetPasswordPage from "./pages/Auth/Reset/ResetPasswordPage";
import ResetPasswordConfirmPage from "./pages/Auth/Reset/ResetPasswordConfirmPage";
import ResetPasswordOTPPage from "./pages/Auth/Reset/ResetPasswordOTPPage";
import GetVai from "./pages/VAI Module/GetVai";
import Terms from "./pages/VAI Module/Terms";
import Subscription from "./pages/VAI Module/Subscription";
import DiscountCoupon from "./pages/VAI Module/DiscountCoupon";
import Payment from "./pages/VAI Module/Payment";
import PaymentSuccess from "./pages/VAI Module/PaymentSuccess";
import Migration from "./pages/VAI Module/Migration";
import BussinessVai from "./pages/VAI Module/BussinessVai";
import VaiCodes from "./pages/VAI Module/VaiCodes";
import AgencyBusiness from "./pages/Auth/BusinessService/AgencyBusiness";
import MyVairipay from "./pages/MyVairipay/MyVairipay";
import MyVairipayAdd from "./pages/MyVairipay/MyVairipayAdd";
import BusinessProfileQRCode from "./pages/MyVairipay/MyVairipayQR";
import MyVairipayRequest from "./pages/MyVairipay/MyVairipayRequest";
import MyVairipayRequestSecond from "./pages/MyVairipay/MyVairipayRequestSecond";
import MyVairipayAppleRequestQR from "./pages/MyVairipay/MyVairipayUserQR";
import MyVairipayRequestConfirm from "./pages/MyVairipay/MyVairipayRequestConfirm";
import MyVairipaySearch from "./pages/MyVairipay/MyVairipaySearch";
import MyVairipayCountrySearch from "./pages/MyVairipay/MyVairipayCountrySearch";
import Language from "./pages/Setup/Language";
import GoldenToken from "./pages/Setup/Varipay/GoldenToken";
import TokenCheckout from "./pages/Setup/Varipay/TokenCheckout";
import TokenCongratulation from "./pages/Setup/Varipay/TokenCongratulation";
import PersonalInformationOrientation from "./pages/PersonalInformationOrientation/PersonalInformationOrientation";
import Services from "./pages/Setup/Services/Home";
import Massage from "./components/Services/Massage";
import Varipay from "./pages/Setup/Varipay/Varipay";
import ServiceExtra from "./pages/Setup/Services/ServiceExtra";
import HourlyRates from "./pages/Setup/Services/HourlyRates";
import SetupProfile from "./pages/Setup/SetupProfile";
import Gallery from "./pages/Setup/Gallery";
import DateGuardSetup from "./pages/Setup/Dateguard/DateGuardSetup";
import Codes from "./pages/Setup/Dateguard/Codes";
import Groups from "./pages/Setup/Dateguard/Groups";
import DateGuardSelectGroup from "./pages/Setup/Dateguard/DateGuardSelectGroup";
import DateGuardEditGroup from "./pages/Setup/Dateguard/DateGuardEditGroup";
import DateGuardAddMember from "./pages/Setup/Dateguard/DateGuardAddMember";
import InviteMemberToGroup from "./pages/Setup/Dateguard/InviteMemberToGroup";
import DateGuardPasswordInput from "./pages/Setup/Dateguard/DateGuardPasswordInput";
import PasswordSuccessChanged from "./pages/Setup/Dateguard/PasswordSuccessChanged";
import DateGuardInvitedMembers from "./pages/Setup/Dateguard/InviteMemberToGroup";
import DateGuardCountUp from "./pages/Setup/Dateguard/DateGuardCountUp";
import DateGuardPhotoTake from "./pages/Setup/Dateguard/DateGuardPhotoTake";
import DateGuardSendMessage from "./pages/Setup/Dateguard/DateGuardSendMessage";
import DateGuardAlarm from "./pages/Setup/Dateguard/DateGuardAlarm";
import SuccessChangedCode from "./pages/Setup/Dateguard/SuccessChangedCode";
import DateGuardSetTimeAlarm from "./pages/Setup/Dateguard/DateGuardSetTimeAlarm";
import JoinMemberToGroup from "./pages/Setup/Dateguard/JoinMemberToGroup";
import SocialSearch from "./pages/Setup/Social/SocialSearch";
import AddSocial from "./pages/Setup/Social/AddSocial";
import UploadProfile from "./pages/Setup/UploadProfile";
import UserGallery from "./pages/User/UserGallery";
import GalleryComment from "./pages/User/GalleryComment";
import SetupFacial from "./pages/Setup/InAppFacialRec/SetupFacial";
import UploadFacial from "./pages/Setup/InAppFacialRec/UploadFacial";
import ActiveInvitation from "./pages/Setup/Marketplace/ActiveInvitations";
import PostReview from "./pages/Setup/Marketplace/PostReview";
import PostAnnouncement from "./pages/Setup/Marketplace/PostAnnouncement";
import MarketplacePosts from "./pages/Setup/Marketplace/MarketplacePosts";
import SetDateGuardDisarmDecoyCode from "./pages/Setup/Dateguard/SetDateGuardDisarmDecoyCode";
import MyCalendar from "./pages/Setup/Marketplace/MyCalendar";
import CalendarSchedules from "./pages/Setup/Calendar/Calendar";
import Schedule from "./pages/Setup/Calendar/Schedule";
import SetSchedule from "./pages/Setup/Calendar/SetSchedule";
import SetRules from "./pages/Setup/Calendar/SetRules";
import CalendarSetting from "./pages/Setup/Calendar/CalendarSetting";
import SyncCalendar from "./pages/Setup/Calendar/SyncCalendar";
import EscortType from "./pages/Setup/Marketplace/EscortType";
import EscortResults from "./pages/Setup/Marketplace/EscortResults";
import AdvancedSearch from "./pages/Setup/Marketplace/AdvancedSearch";
import VerifyMarketplace from "./pages/Setup/Marketplace/VerifyMarketplace";
import Invite from "./pages/Setup/Marketplace/Invite";
import Invitations from "./pages/Setup/Marketplace/Invitations";
import Featured from "./pages/Setup/Home/Featured";
import Comments from "./pages/Setup/Home/Comments";
import PostDetails from "./pages/Setup/Home/PostDetails";
import BusinessHours from "./pages/Setup/Services/business/BusinessHours";
import BusinessServices from "./pages/Setup/Services/business/BusinessServices";
import Community from "./pages/Auth/Community";
import Tellus from "./pages/Auth/Tellus";
import MyVairipayOption from "./pages/MyVairipay/MyVairipayOptions";
import DateGuardAddGroup from "./pages/Setup/Dateguard/DateGuardAddGroup";
import DateGuardSelectAppointment from "./pages/Setup/Dateguard/DateGuardSelectAppointment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleUserCurrentLocation } from "./redux/action/UserCurrentLocation";
import Profile from "./pages/User/Profile";
import JoinMemberToGroupSuccess from "./pages/Setup/Dateguard/JoinMemberToGroupSuccess";
import DateGuardEmergencyContacts from "./pages/Setup/Dateguard/DateGuardEmergencyContacts";
import MyVarify from "./pages/User/MyVarify";

import SelectDate from "./pages/varidate/SelectDate";
import SelectTime from "./pages/varidate/SelectTime";
import Verification from "./pages/varidate/Verification";
import InvitationsList from "./pages/varidate/InvitationsList";
import BookingDetails from "./pages/varidate/BookingDetails";
import ESignAndSend from "./pages/varidate/ESignAndSend";
import SugarCongratulations from "./pages/varidate/SugarCongratulations";
import UpcomingAppointments from "./pages/varidate/UpcomingAppointments";
import HotRodAnalysis from "./pages/varidate/HotRodAnalysis";
import SugarAnalysis from "./pages/varidate/SugarAnalysis";
import Marketplace from "./pages/Setup/Marketplace/Marketplace";
import VaridateHome from "./pages/varidate/VaridateHome";
import AddStaff from "./pages/Setup/ServiceBusiness/AddStaff";
import StaffSettings from "./pages/Setup/ServiceBusiness/StaffSettings";
import BusinessRateServices from "./pages/Setup/ServiceBusiness/BusinessRateServices";
import UserList from "./pages/Setup/ServiceBusiness/UserList";
import Reviews from "./pages/varidate/Reviews";
import AppointmentReview from "./pages/varidate/AppointmentReview";
import VerificationManual from "./pages/varidate/VerificationManual";
import InvitationsCompanion from "./pages/varidate/InvitationsListCompanion";
import SelfVerificationProcess from "./pages/User/SelfVerificationProcess";
import SelfVerificationCompleted from "./pages/User/SelfVerificationCompleted";
import VairifySendCode from "./pages/User/VairifySendCode";
import SetupVairify from "./pages/User/SetupVairify";
import ChatLogs from "./pages/User/ChatLogs";
import ChatScreen from "./pages/User/ChatScreen";
import Notifications from "./pages/Setup/Home/Notifications";
import FaceVerification from "./pages/varidate/FaceVerification";
import ChangeAppointmentDate from "./pages/varidate/ChangeAppointmentDate";
import ChangeAppointmentTime from "./pages/varidate/ChangeAppointmentTime";
import UpcomingAppointmentsList from "./pages/varidate/UpcomingAppointmentsList";
import VaiNow from "./pages/Setup/VaiNow/VaiNow";
import ScanQR from "./pages/Setup/VaiNow/ScanQR";
import VaiNowList from "./pages/Setup/VaiNow/PendingVaiNowList";
import Accept from "./pages/Setup/VaiNow/Accept";
import ShowQR from "./pages/Setup/VaiNow/ShowQR";
import PastInvitations from "./pages/varidate/pastAppointmentsList";
import AppointmentDetails from "./pages/varidate/AppointmentDetails";
import Kyc from "./pages/KYC/Kyc";
import SearchScanQR from "./pages/Setup/Marketplace/ScanQr";
// import Accept from "./pages/Setup/VaiNow/Accept";
import SetVairifySchedule from "./pages/Setup/VairifyNow/SetVairifySchedule";
import VairifySearch from "./pages/Setup/VairifyNow/VairifySearch";
import VairifyVaiNow from "./pages/Setup/VairifyNow/VaiNow";
import VairifyCalendarSetting from "./pages/Setup/VairifyNow/VairifyCalendarSetting";
import VairifyMap from "./pages/Setup/VairifyNow/VairifyMap";
import Settings from "./pages/Setup/Settings";
import GalleryDetails from "./pages/User/GalleryDetails";
import IncallManage from "./pages/InCallAddresses";
import VairifySearchNew from "./pages/Setup/VaiNow/2.0/Search";
import AdvancedSearch2 from "./pages/Setup/VaiNow/2.0/AdvanceSearch";
import LocationRequests from "./pages/Setup/VairifyNow/LocationRequests";
import MyVairifyCards from "./pages/MyVairify/MyVairifyCards";
import { subscribeUser } from "./subscription";
import ProfilePermissions from "./pages/Setup/ProfilePermissions/ProfilePermissions";
import DateHistory from "./pages/Setup/DateHistory";
import MyFavLocations from "./pages/Settings/MyFavLocations";
import KycMembershipHistory from "./pages/Setup/History/KycMembershipHistory";
import VairifyMembershipHistory from "./pages/Setup/History/VairifyMembershipHistory";
import VairifyMembershipPlans from "./pages/Setup/VairifyMembership/VairifyMembershipPlans";
import MembershipSubscription from "./pages/Setup/VairifyMembership/MembershipSubscription";
import VairifyMembershipPayment from "./pages/Setup/VairifyMembership/VairifyMembershipPayment";
import MembershipPaymentSuccess from "./pages/Setup/VairifyMembership/MembershipiPaymentSuccess";
import PaymentHistory from "./pages/Setup/History/PaymentHistory";
import VAIMembershipPlans from "./pages/Setup/VAIMembership/VAIMembershipPlans";
import VAIMembershipSubscription from "./pages/Setup/VAIMembership/VAIMembershipSubscription";
import VAIMembershipPayment from "./pages/Setup/VAIMembership/VAIMembershipPayment";
import KycSuccess from "./pages/KYC/Includes/KycSuccess";
import VaiCheckList from "./pages/Setup/VaiNow/pendingVaiCheckList";
import Disclosure from "./pages/disclosure";
import SocialDone from "./pages/Setup/Social/DoneSocial";
import SocialLinks from "./pages/socialLinks";
import AboutMe from "./pages/Settings/AboutMe";
import ChangePasswordPage from "./pages/Auth/ChangePasswordPage";
import ServiceRates from "./pages/User/ServicesRates";
import VaridateService from "./services/VaridateServices";
import { HandleLanguage, HandleSaveNotificationCount } from "./redux/action/Auth";
import PublicProfile from "./pages/User/PublicProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import UserGallery2 from "./pages/User/UserGallery2";
import GalleryDetails2 from "./pages/User/GalleryDetails2";
import TermsCondition from "./pages/term-and-condition";
import PublicRoute from "./components/PublicRoute";
import { HandleGetProfile } from "./redux/action/Profile";
import { HandleGetCalendarSchedule } from "./redux/action/CalendarSchedule";
import PlansServices from "./services/PlansServices";
import { HandlegetKycUserPlan, HandlegetVairifyMembershipPlans } from "./redux/action/VAI";
import { HandleGallaryData } from "./redux/action/Gallary";
import { HandleGetServices } from "./redux/action/Services";
import { HandlegetUserSocial } from "./redux/action/Social";
import ServiceRoute from "./components/ServiceRoute";
import PrivacyPolicy from "./pages/privacyPolicy";
import MutalConsent from "./pages/Setup/MutalConsent";
import SetupFaceVerification from "./pages/FaceVerification/SetupFaceVerification";
// import PrivacyPolicy from "./pages/privacyPolicy";
function App() {
  const stripePromise = loadStripe(
    `${import.meta.env.VITE_APP_STRIPE_CLIENT_KEY}`
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (UserData?._id) {
      dispatch(HandleUserCurrentLocation());
    }
  }, []);

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const UserType = UserData?.user_type;

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log({ latitude, longitude });
        },
        (err) => {
          console.log(err.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (UserData?._id) {
      subscribeUser();
      VaridateService.getAppointmentsCount(UserData?._id)
        .then((response) => {
          dispatch(HandleSaveNotificationCount(response?.notifications));
        })
        .catch((err) => console.log(err));
    }
  }, [UserData?._id]);
  const ServicesData = useSelector((state) => state?.Services?.getservices);
  useEffect(() => {
    if (UserData?._id) {
      dispatch(HandleGetProfile(UserData._id));
      dispatch(HandleGetCalendarSchedule(UserData._id));
      dispatch(HandlegetKycUserPlan(UserType));
      dispatch(HandlegetVairifyMembershipPlans(UserType));
      dispatch(HandleGetServices(UserData?._id, UserData?.user_type));
      dispatch(HandleGallaryData(UserData._id));
      dispatch(HandlegetUserSocial(UserData?._id));
    }
  }, [UserData]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}></Route>
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }></Route>
        <Route path="/selectcategory" element={
          <PublicRoute path="/selectcategory">
            <SelectCategory />
          </PublicRoute>
        }></Route>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              {/* <ProtectedRoute step={"Step2"} path="/signup"> */}
              <Signup />
              {/* </ProtectedRoute> */}
            </PublicRoute>
          }></Route>
        <Route
          path="/otp-verification"
          element={
            <PublicRoute>
              <OTPVerificationPage />
            </PublicRoute>
          }
        ></Route>
        <Route
          path="/otp-congratulations"
          element={
            <PublicRoute>
              <CongratulationsPage />
            </PublicRoute>
          }
        ></Route>
        <Route path="/change-password" element={
          // <PublicRoute>
          <ChangePasswordPage />
          // </PublicRoute>
        }></Route>
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }></Route>
        <Route
          path="/reset-password-otp"
          element={
            <PublicRoute>
              <ResetPasswordOTPPage />
            </PublicRoute>
          }></Route>
        <Route
          path="/confirm/password"
          element={
            <PublicRoute>
              <ResetPasswordConfirmPage />
            </PublicRoute>
          }></Route>
        <Route
          path="/agencybusiness"
          element={
            <PublicRoute>
              {/* <ProtectedRoute step={"Step2"} path="/agencybusiness" > */}
              <AgencyBusiness />
              {/* </ProtectedRoute>  */}
            </PublicRoute>
          }></Route>
        <Route path="/business/community" element={
          // <ProtectedRoute step={"Step2"} path="/business/community">
          <PublicRoute path="/business/community">
            <Community />
          </PublicRoute>
          // </ProtectedRoute>
        }></Route>
        <Route path="/business/tellus" element={
          <PublicRoute>
            <Tellus />
          </PublicRoute>
        }></Route>

        {/* FACE VERIFICATION MODULE STATRS HERE */}
        <Route
          path="/setup-face-verification"
          element={
            <ProtectedRoute level={["login"]}
              step="Step1" path="/setup-face-verification"
            >
              <SetupFaceVerification />
            </ProtectedRoute>
          }
        ></Route>

        {/* VAI MODULE STATRS HERE */}
        <Route
          path="/vai"
          element={
            <ProtectedRoute level={["login"]} step="Step2" path2="/vai">
              <Kyc />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/kyc-success"
          element={
            <ProtectedRoute level={["login"]} step="Step2" path="/kyc-success">
              <KycSuccess />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/get-vai"
          element={
            <ProtectedRoute level={["login"]} step="Step1" path="/get-vai">
              <GetVai />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/terms"
          element={
            <ProtectedRoute level={["login"]} step="Step1" path1="/terms">
              <Terms />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/subscription"
          element={
            <ProtectedRoute level={["login"]} step="Step1" path1="/subscription">
              <Subscription />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/discount-coupon"
          element={
            <ProtectedRoute level={["login"]} step="Step1" path1="/discount-coupon">
              <DiscountCoupon />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/migration"
          element={
            <ProtectedRoute level={["login"]} step="Step1" path1="/migration">
              <Migration />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/payment"
          element={
            <ProtectedRoute level={["login"]} step="Step1" path1="/payment">
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute level={["login"]} step="Step1" path1="/payment-success">
              <PaymentSuccess />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/self-verification-process"
          element={
            <ProtectedRoute level={["login"]} step="Step2" path2="/self-verification-process">
              <SelfVerificationProcess />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/self-verification-completed"
          element={
            <ProtectedRoute level={["login"]} step="Step2" path="/self-verification-completed">
              <SelfVerificationCompleted />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/Setup-Vairify"
          element={
            <ProtectedRoute level={["login"]}>
              <SetupVairify />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairify-sendcode"
          element={
            <ProtectedRoute level={["login"]}>
              <VairifySendCode />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/chat-logs"
          element={
            <ProtectedRoute level={["login"]}>
              <ChatLogs />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/bussiness-vai"
          element={
            <ProtectedRoute level={["login"]} step="Step1" path1="/bussiness-vai">
              <BussinessVai />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/bussiness-vai-codes"
          element={
            <ProtectedRoute level={["login"]} path="/bussiness-vai-codes">
              <VaiCodes />
            </ProtectedRoute>
          }
        ></Route>
        {/* VAI MODULE ENDS HERE */}
        {/*Vairipay*/}
        <Route
          path="/my-vairipay"
          element={
            <ProtectedRoute level={["login"]} path="/my-vairipay">
              <MyVairipay />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairipay-add"
          element={
            <ProtectedRoute level={["login"]} path="/vairipay-add">
              <MyVairipayAdd />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairipay-qr"
          element={
            <ProtectedRoute level={["login"]} path="/vairipay-qr">
              <BusinessProfileQRCode />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairipay-request"
          element={
            <ProtectedRoute level={["login"]}>
              <MyVairipayRequest />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/my-vairipay-request-second"
          element={
            <ProtectedRoute level={["login"]}>
              <MyVairipayRequestSecond />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairipay/user/qr"
          element={
            <ProtectedRoute level={["login"]}>
              <MyVairipayAppleRequestQR />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/my-vairipay-request-confirm"
          element={
            <ProtectedRoute level={["login"]}>
              <MyVairipayRequestConfirm />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairipay-options"
          element={
            <ProtectedRoute level={["login"]}>
              <MyVairipayRequestSecond />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairipay-search"
          element={
            <ProtectedRoute level={["login"]} path="/vairipay-search">
              <MyVairipaySearch />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/my-vairipay-country-search"
          element={
            <ProtectedRoute level={["login"]}>
              <MyVairipayCountrySearch />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairipay/download"
          element={
            <ProtectedRoute level={["login"]}>
              <MyVairipayOption />
            </ProtectedRoute>
          }
        ></Route>
        {/*Vairipay Ends*/}
        {/* Varify start */}
        <Route
          path="/my-vairify"
          element={
            <ProtectedRoute level={["login"]}>
              <MyVarify />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/my-vairify-details"
          element={
            <ProtectedRoute level={["login"]}>
              <MyVairifyCards />
            </ProtectedRoute>
          }
        ></Route>
        {/* Varify end */}
        {/* setup starts from here */}

        <Route
          path="/setup"
          element={
            <ProtectedRoute level={["login"]} path="/setup">
              <SetupProfile />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/manage-incall-addresses"
          element={
            <ProtectedRoute level={["login"]} path="/manage-incall-addresses">
              <IncallManage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/language"
          element={
            // <PublicRoute>
            <Language />
            // </PublicRoute>
          }
        ></Route>
        <Route
          path="/goldentoken"
          element={
            <ProtectedRoute level={["login"]} path="/goldentoken">
              <GoldenToken />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/grt-checkout"
          element={
            <ProtectedRoute level={["login"]} path="/grt-checkout">
              <Elements stripe={stripePromise}>
                <TokenCheckout />
              </Elements>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/grt-congratulation"
          element={
            <ProtectedRoute level={["login"]} path="/grt-congratulation">
              <TokenCongratulation />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/personal-information"
          element={
            <ProtectedRoute level={["login"]} path="/personal-information">
              <PersonalInformationOrientation />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/mutalconsent"
          element={
            <ProtectedRoute level={["login"]} path="/mutalconsent">
              <MutalConsent />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/photogallery"
          element={
            <ProtectedRoute level={["login"]} path="/photogallery">
              <Gallery />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/uploadProfile"
          element={
            <ProtectedRoute level={["login"]} path="/uploadProfile">
              <UploadProfile />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/search-social"
          element={
            <ProtectedRoute level={["login"]} path="/search-social">
              <SocialSearch />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/add-social"
          element={
            <ProtectedRoute level={["login"]} path="/add-social">
              <AddSocial />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/social-done"
          element={
            <ProtectedRoute level={["login"]} path="/social-done">
              <SocialDone />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/setup-facial"
          element={
            <ProtectedRoute level={["login"]} path="/setup-facial">
              <SetupFacial />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/facial-recognition"
          element={
            <ProtectedRoute level={["login"]}>
              <UploadFacial />
            </ProtectedRoute>
          }
        ></Route>
        {/* services */}
        <Route
          path="/services"
          element={
            <ProtectedRoute level={["login"]} path="/services">
              <Services />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/services/massage"
          element={
            <ProtectedRoute level={["login"]}>
              <Massage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/service/extras"
          element={
            <ProtectedRoute level={["login"]} path="/service/extras">
              <ServiceExtra />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/hourly-rates"
          element={
            <ProtectedRoute level={["login"]} path="/hourly-rates">
              <HourlyRates />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/business-hours"
          element={
            <ProtectedRoute level={["login"]} path="/business-hours">
              <BusinessHours />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/business-services"
          element={
            <ProtectedRoute level={["login"]}>
              <BusinessServices />
            </ProtectedRoute>
          }
        ></Route>
        {/* VAI NOW */}
        <Route
          path="/vai-now"
          element={
            <ServiceRoute>
              <ProtectedRoute level={["login"]} path="/vai-now">
                <VaiNow />
              </ProtectedRoute>
            </ServiceRoute>
          }
        ></Route>
        <Route
          path="/vai-now/scan-qr"
          element={
            <ProtectedRoute level={["login"]}>
              <ScanQR />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vai-now/show-qr"
          element={
            <ProtectedRoute level={["login"]} path="/vai-now/show-qr">
              <ShowQR />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vai-now/list"
          element={
            <ServiceRoute>
              <ProtectedRoute level={["login"]} path="/vai-now/list">
                <VaiNowList />
              </ProtectedRoute>
            </ServiceRoute>
          }
        ></Route>
        <Route
          path="/vai-check/list"
          element={
            <ProtectedRoute level={["login"]} path="/vai-check/list">
              <VaiCheckList />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vai-now/accept"
          element={
            <ProtectedRoute level={["login"]}>
              <Accept />
            </ProtectedRoute>
          }
        ></Route>
        {/* Market */}
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute level={["login"]} path="/marketplace">
              <Marketplace />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/marketplace/search-invite"
          element={
            <ServiceRoute>
              <ProtectedRoute level={["login"]}>
                <VerifyMarketplace />
              </ProtectedRoute>
            </ServiceRoute>
          }
        ></Route>
        <Route
          path="/marketplace/sent-invitations"
          element={
            <ServiceRoute>
              <ProtectedRoute level={["login"]}>
                <Invitations />
              </ProtectedRoute>
            </ServiceRoute>
          }
        ></Route>
        <Route
          path="/escort-type"
          element={
            <ProtectedRoute level={["login"]}>
              <EscortType />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/results"
          element={
            <ProtectedRoute level={["login"]}>
              <EscortResults />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/search/scan-qr"
          element={
            <ProtectedRoute level={["login"]}>
              <SearchScanQR />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/advance/search"
          element={
            <ProtectedRoute level={["login"]}>
              <AdvancedSearch />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/invitations"
          element={
            <ProtectedRoute level={["login"]}>
              <Invitations />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/marketplace/active/invitation"
          element={
            <ProtectedRoute level={["login"]}>
              <ActiveInvitation />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/marketplace/invitation"
          element={
            <ServiceRoute>
              <ProtectedRoute level={["login"]} path="/marketplace/invitation">
                <Invite />
              </ProtectedRoute>
            </ServiceRoute>
          }
        ></Route>
        <Route
          path="/marketplace/post"
          element={
            <ProtectedRoute level={["login"]}>
              <PostAnnouncement />
            </ProtectedRoute>
          }
        ></Route>
        {/* <Route path="/marketplace-post" element={<MarketplacePosts />}></Route> */}
        <Route
          path="/marketplace/post/review"
          element={
            <ProtectedRoute level={["login"]}>
              <PostReview />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/my-calendar"
          element={
            <ProtectedRoute level={["login"]}>
              <MyCalendar />
            </ProtectedRoute>
          }
        ></Route>
        {/* Home page */}
        <Route
          path="/featured"
          element={
            <ProtectedRoute level={["login"]} >
              <Featured />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/details"
          element={
            <ProtectedRoute level={["login"]}>
              <PostDetails />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/comments"
          element={
            <ProtectedRoute level={["login"]}>
              <Comments />
            </ProtectedRoute>
          }
        ></Route>
        {/*calendar*/}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute level={["login"]} path="/calendar">
              <CalendarSchedules />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/schedule"
          element={
            <ProtectedRoute level={["login"]} path="/schedule">
              <Schedule />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/set-schedule"
          element={
            <ProtectedRoute level={["login"]} path="/set-schedule">
              <SetSchedule />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/set-rules"
          element={
            <ProtectedRoute level={["login"]} path="/set-rules">
              <SetRules />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/sync-calendar"
          element={
            <ProtectedRoute level={["login"]} path="/sync-calendar">
              <SyncCalendar />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/cal-setting"
          element={
            <ProtectedRoute level={["login"]} path="/cal-setting">
              <CalendarSetting />
            </ProtectedRoute>
          }
        ></Route>
        {/*Profile Request*/}
        <Route
          path="/setup-varipay"
          element={
            <ProtectedRoute level={["login"]} path="/setup-varipay">
              <Varipay />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute level={["login"]} path="/user/profile">
              <Profile />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/public/profile/:vaiId"
          element={
            // <ProtectedRoute level={["login"]}>
            <PublicProfile />
            // </ProtectedRoute>
          }
        ></Route>
        {/* User */}
        <Route
          path="/user/gallery"
          element={
            // <ProtectedRoute level={["login"]}>
            <UserGallery />
            // </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/gallery/2"
          element={
            <ProtectedRoute level={["login"]}>
              <UserGallery2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/gallery-details"
          element={
            // <ProtectedRoute level={["login"]}>
            <GalleryDetails />
            // </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/gallery-details/2"
          element={
            <ProtectedRoute level={["login"]}>
              <GalleryDetails2 />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/gallerycomment"
          element={
            // <ProtectedRoute level={["login"]}>
            <GalleryComment />
            // </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/chat-screen"
          element={
            <ProtectedRoute level={["login"]}>
              <ChatScreen />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user/services-rates"
          element={
            <ProtectedRoute level={["login"]}>
              <ServiceRates />
            </ProtectedRoute>
          }
        />
        {/*dateguard*/}
        <Route
          path="/dateguard-setup"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard-setup">
              <DateGuardSetup />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/codes"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard/codes">
              <Codes />
            </ProtectedRoute>
          }
        ></Route>
        {/* <Route path="/dateguard/groups" element={
          <ProtectedRoute level={["login"]}>
          </ProtectedRoute>
        }></Route> */}
        {/* <Groups /> */}
        {/* <Route
          path="/dateguard/set-code"
          element={<SetDateGuardDisarmDecoyCode />}
        ></Route> */}
        <Route
          path="/dateguard/face-match"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard/face-match">
              <SuccessChangedCode />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/password-input"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard/password-input">
              <DateGuardPasswordInput />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/password-success-changed"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard/password-success-changed">
              <PasswordSuccessChanged />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/select-group"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard/select-group">
              <DateGuardSelectGroup />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/pick-group/:appointmentId"
          element={
            <ProtectedRoute level={["login"]}>
              <DateGuardSelectGroup />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/select-appointment"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard/select-appointment">
              <DateGuardSelectAppointment />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/create-group"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard/create-group">
              <DateGuardAddGroup />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/edit-group/:groupId"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard/edit-group/:groupId">
              <DateGuardEditGroup />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/add-member/:groupId"
          element={
            <ProtectedRoute level={["login"]} path="/dateguard/add-member/:groupId">
              <DateGuardAddMember />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/add-member/:groupId/select-member"
          element={
            <ProtectedRoute level={["login"]}>
              <InviteMemberToGroup />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/join-member-to-group/:guardianId/:groupId"
          element={
            <ProtectedRoute level={["login"]}>
              <JoinMemberToGroup />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/join-member-to-group/success"
          element={
            <ProtectedRoute level={["login"]}>
              <JoinMemberToGroupSuccess />
            </ProtectedRoute>
          }
        ></Route>
        {/* <Route
          path="/dateguard/invited-members"
          element={
            <ProtectedRoute level={["login"]}>
            </ProtectedRoute>
          }
            <DateGuardInvitedMembers />
        ></Route> */}
        <Route
          path="/dateguard/set-time-alarm/:appointmentId/:groupId"
          element={
            <ProtectedRoute level={["login"]}>
              <DateGuardSetTimeAlarm />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/count-up/:appointmentId/:groupId"
          element={
            <ProtectedRoute level={["login"]}>
              <DateGuardCountUp />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/dateguard/take-photo/:appointmentId/:groupId"
          element={
            <ProtectedRoute level={["login"]}>
              <DateGuardPhotoTake />
            </ProtectedRoute>
          }
        ></Route>
        {/* <Route
          path="/dateguard/send-message"
          element={<DateGuardSendMessage />}
        ></Route> */}
        {/* <Route path="/dateguard/alarm" element={<DateGuardAlarm />}></Route> */}
        <Route
          path="/dateguard/emergency-contacts/:alarmId/:memberId"
          element={
            <ProtectedRoute level={["login"]}>
              <DateGuardEmergencyContacts />
            </ProtectedRoute>
          }
        />
        {/* schedule */}
        <Route
          path="/varidate/change-appointment-date/:appointmentId"
          element={
            <ProtectedRoute level={["login"]}>
              <ChangeAppointmentDate />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/change-appointment-time/:appointmentId"
          element={
            <ProtectedRoute level={["login"]}>
              <ChangeAppointmentTime />
            </ProtectedRoute>
          }
        ></Route>
        {/* /varidate/change-appointment-time/ */}
        <Route
          path="/varidate/select-date/:userId"
          element={
            <ProtectedRoute level={["login"]}>
              <SelectDate />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/select-time/:userId"
          element={
            <ProtectedRoute level={["login"]}>
              <SelectTime />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/verification"
          element={
            <ProtectedRoute level={["login"]}>
              <Verification />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/invitations-list"
          element={
            <ServiceRoute>
              <ProtectedRoute level={["login"]} path="/varidate/invitations-list">
                <InvitationsList />
              </ProtectedRoute>
            </ServiceRoute>
          }
        ></Route>
        <Route
          path="/varidate/past-appointments"
          element={
            <ServiceRoute>
              <ProtectedRoute level={["login"]} path="/varidate/past-appointments">
                <PastInvitations />
              </ProtectedRoute>
            </ServiceRoute>
          }
        ></Route>
        <Route
          path="/varidate/booking-details"
          element={
            <ProtectedRoute level={["login"]}>
              <BookingDetails />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/appointment-details"
          element={
            <ProtectedRoute level={["login"]}>
              <AppointmentDetails />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/esign-send"
          element={
            <ProtectedRoute level={["login"]}>
              <ESignAndSend />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/sugar-congratulations"
          element={
            <ProtectedRoute level={["login"]}>
              <SugarCongratulations />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/upcoming-appointments"
          element={
            <ServiceRoute>
              <ProtectedRoute level={["login"]} path="/varidate/upcoming-appointments">
                <UpcomingAppointmentsList />
              </ProtectedRoute>
            </ServiceRoute>
          }
        ></Route>
        <Route
          path="/varidate/last-mile-instruction"
          element={
            <ProtectedRoute level={["login"]}>
              <UpcomingAppointments />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/post/review"
          element={
            <ProtectedRoute level={["login"]}>
              <HotRodAnalysis />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/services-rates"
          element={
            <ProtectedRoute level={["login"]} >
              <VaridateHome />
            </ProtectedRoute>
          }
        ></Route>
        {/* new screens starts from here */}
        {/* <Route
          path="/varidate/invitations-list-companion"
          element={
            <ProtectedRoute level={["login"]}>
            </ProtectedRoute>
          }
            <InvitationsCompanion />
        ></Route> */}
        <Route
          path="/varidate/verification-manual"
          element={
            <ProtectedRoute level={["login"]}>
              <VerificationManual />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/reviews"
          element={
            <ProtectedRoute level={["login"]} path="/varidate/reviews">
              <Reviews />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/appointment-review"
          element={
            <ProtectedRoute level={["login"]}>
              <AppointmentReview />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/varidate/face-verification"
          element={
            <ProtectedRoute level={["login"]}>
              <FaceVerification />
            </ProtectedRoute>
          }
        />
        {/* new screens ends from here */}
        {/* Service Business */}
        <Route
          path="/service-business/add-staff"
          element={
            <ProtectedRoute level={["login"]} path="/service-business/add-staff">
              <AddStaff />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/service-business/staff-settings/:staffid"
          element={
            <ProtectedRoute level={["login"]}>
              <StaffSettings />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/service-business/business-rate-services"
          element={
            <ProtectedRoute level={["login"]}>
              <BusinessRateServices />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/service-business/user-list"
          element={
            <ProtectedRoute level={["login"]} path="/service-business/user-list">
              <UserList />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/notifications"
          element={
            <ProtectedRoute level={["login"]} path="/notifications">
              <Notifications />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/chat-log"
          element={
            <ProtectedRoute level={["login"]} path="/chat-log">
              <ChatLogs />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/chat/:receiverId"
          element={
            <ProtectedRoute level={["login"]}>
              <ChatScreen />
            </ProtectedRoute>
          }
        ></Route>
        {/* VAIRIFY-NOW */}
        <Route
          path="/location-requests"
          element={
            <ProtectedRoute level={["login"]} path="/location-requests">
              <LocationRequests />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairify-schedule"
          element={
            <ProtectedRoute level={["login"]}>
              <SetVairifySchedule />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairify-search"
          element={
            <ServiceRoute>
              <ProtectedRoute level={["login"]}>
                <VairifySearchNew />
              </ProtectedRoute>
            </ServiceRoute>
          }
        ></Route>
        <Route
          path="/vairify-advance-search"
          element={
            <ProtectedRoute level={["login"]}>
              <AdvancedSearch2 />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairify/vainow"
          element={
            <ProtectedRoute level={["login"]}>
              <VairifyVaiNow />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairify-calendar-setting"
          element={
            <ProtectedRoute level={["login"]}>
              <VairifyCalendarSetting />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairify-results"
          element={
            <ProtectedRoute level={["login"]}>
              <VairifyMap />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/settings"
          element={
            <ProtectedRoute level={["login"]} path="/settings">
              <Settings />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile-permissions"
          element={
            <ProtectedRoute level={["login"]} path="/profile-permissions">
              <ProfilePermissions />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/kyc-membership-history"
          element={
            <ProtectedRoute level={["login"]} path="/kyc-membership-history">
              <KycMembershipHistory />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairify-membership-history"
          element={
            <ProtectedRoute level={["login"]} path="/vairify-membership-history">
              <VairifyMembershipHistory />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairify-membership-plans"
          element={
            <ProtectedRoute level={["login"]} path="/vairify-membership-plans"  >
              <VairifyMembershipPlans />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/membership-subscription"
          element={
            <ProtectedRoute level={["login"]}>
              <MembershipSubscription />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vairify-membership-payment"
          element={
            <ProtectedRoute level={["login"]}>
              <Elements stripe={stripePromise}>
                <VairifyMembershipPayment />
              </Elements>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/membership-payment-success"
          element={
            <ProtectedRoute level={["login"]}>
              <MembershipPaymentSuccess />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vai-membership-plans"
          element={
            <ProtectedRoute level={["login"]}>
              <VAIMembershipPlans />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user-payment-history"
          element={
            <ProtectedRoute level={["login"]} path="/user-payment-history">
              <PaymentHistory />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vai-membership-subscription"
          element={
            <ProtectedRoute level={["login"]}>
              <VAIMembershipSubscription />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/vai-membership-payment"
          element={
            <ProtectedRoute level={["login"]}>
              <Elements stripe={stripePromise}>
                <VAIMembershipPayment />
              </Elements>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/settings/date-history"
          element={
            <ProtectedRoute level={["login"]} path="/settings/date-history">
              <DateHistory />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/settings/about-me"
          element={
            <ProtectedRoute level={["login"]} path="/settings/about-me">
              <AboutMe />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/settings/faviourite-locations"
          element={
            <ProtectedRoute level={["login"]} path="/settings/faviourite-locations">
              <MyFavLocations />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/disclosure"
          element={
            <ProtectedRoute level={["login"]} path="/disclosure">
              <Disclosure />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/social-links"
          element={
            <ProtectedRoute level={["login"]} path="/social-links">
              <SocialLinks />
            </ProtectedRoute>
          }
        ></Route>

        {/* public routes */}
        <Route path="/privacy-policy" element={
          <ProtectedRoute level={["login"]} path="/privacy-policy">
            <PrivacyPolicy />
          </ProtectedRoute>
        }></Route>
        <Route path="/disclosure" element={
          <ProtectedRoute level={["login"]} path="/disclosure">
            <Disclosure />
          </ProtectedRoute>
        }></Route>
        <Route
          path="/terms-and-conditions"
          element={
            <ProtectedRoute level={["login"]} path="/terms-and-conditions">
              <TermsCondition />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
