import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FACE_VERIFICATION } from "../config";
import moment from "moment";
import Loading from "./Loading/Index";

export default function ProtectedRoute(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(true);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user) || {};
  const GallaryData = useSelector((state) => state?.Gallary?.userGallary?.images) || [];
  const ServicesData = useSelector((state) => state?.Services?.getservices) || [];
  const SocialData = useSelector((state) => state?.Social) || [];
  const GallaryDataLoading = useSelector((state) => state?.Gallary?.loading)
  const ServicesDataLoading = useSelector((state) => state?.Services?.loading);
  const UserDetailsLoading = useSelector((state) => state?.Auth?.loading);
  const SocialDataLoading = useSelector((state) => state?.Social?.loading);
  const LanguagesData = useSelector((state) => state?.Auth?.language);

  const CurrentUser = sessionStorage.getItem("Current_Profile");

  const protectionLevel = props?.level || ["login"];
  //   HERE ARE DIFFERENT LEVELS
  // login
  // kycMember
  // kycComplete
  // vaiMember
  // tokens

  // here you want to make one function and store this daya in redux stoe state and after check this.
  //check this metho
  const getRemainingDays = (expiryDate) => {
    const today = moment();
    const expiry = moment(expiryDate);
    return expiry.diff(today, "days");
  };

  const isLoading = useMemo(() => {
    return GallaryDataLoading || ServicesDataLoading || UserDetailsLoading || SocialDataLoading;
  }, [GallaryDataLoading, ServicesDataLoading, UserDetailsLoading, SocialDataLoading]);

  const membershipDaysRemaining = useMemo(() => {
    if (!UserDetails?.subscription) return null;
    return UserDetails?.subscription?.reduce((acc, { days, expiryDate }) => {
      if (!acc) return { remainingDays: getRemainingDays(expiryDate), days };
      return { remainingDays: acc?.days || 0 + days };
    }, null)?.remainingDays;
  }, [UserDetails?.subscription]);

  const kycDaysRemaining = useMemo(() => {
    if (!UserDetails?.kyc) return null;
    return UserDetails?.kyc?.reduce((acc, { days, expiryDate }) => {
      if (!acc) return { remainingDays: getRemainingDays(expiryDate), days };
      return { remainingDays: acc?.days || 0 + days };
    }, null)?.remainingDays;
  }, [UserDetails?.kyc]);


  const { HourllyRate, Services } = useMemo(() => {
    let HourllyRate = false;
    let Services = false;

    if (Object.keys(UserDetails).length > 0) {
      if (CurrentUser === "client-hobbyist" || UserDetails?.user_type === "client-hobbyist") {
        HourllyRate = true;
        Services = true;
      } else if (CurrentUser === "agency-business" || UserDetails?.user_type === "agency-business") {
        HourllyRate = ServicesData?.some((item) => item?.businessHourlyRates?.length > 0);
        Services = true;
      } else if (
        CurrentUser === "companion-provider" ||
        CurrentUser === "influencer-affiliate" ||
        UserDetails?.user_type === "companion-provider" ||
        UserDetails?.user_type === "influencer-affiliate"
      ) {
        HourllyRate = ServicesData?.some((item) => item?.hourlyRates?.length > 0);
        Services = ServicesData?.some((item) => item?.services?.length > 0);
      }
    }

    return { HourllyRate, Services };
  }, [UserDetails, ServicesData]);

  // useEffect(() => {
  //   if (Object.keys(UserDetails).length === 0) return;

  //   if (isLoading) return;

  //   if (!UserDetails?.faceVerificationImage || UserDetails?.faceVerificationImage === "") {
  //     if (!props.path0) {
  //       navigate("/setup-face-verification");
  //     }
  //   } else if (!membershipDaysRemaining || !kycDaysRemaining) {
  //     if (!props?.path1) {
  //       navigate("/get-vai");
  //     }
  //   } else if (!UserDetails?.isKycCompleted) {
  //     //Acess payment-success screen
  //     if (!props?.path2) {
  //       navigate("/vai");
  //     }
  //   } else if (props?.path3) {
  //     //Access self-verification-completed screen
  //     navigate("/self-verification-completed");
  //   } else {
  //     //Check Setup required feilds status 
  //     StepWisePagesProtection();
  //   }

  //   setIsMounted(false);
  // }, [
  //   location.pathname,
  //   UserDetails?.faceVerificationImage,
  //   UserDetails?.isKycCompleted,
  //   HourllyRate,
  //   Services,
  //   UserDetails?.gender,
  //   UserDetails?.vaiNowAvailable?.availableFrom,
  //   UserDetails?.profilePic,
  //   UserDetails?.mutualContractSigned,
  //   UserDetails?.varipayActivity,
  //   UserDetails?.incallAddresses?.length > 0,
  //   (GallaryData?.userGallary?.images?.length > 0 || GallaryData?.length > 0),
  //   UserDetails?.dateGuardActivity,
  //   (LanguagesData || UserDetails?.language),
  //   membershipDaysRemaining,
  //   kycDaysRemaining,
  //   ServicesData,
  //   isLoading
  // ]);
  useEffect(() => {
    const delay = setTimeout(() => {
      if (location?.state) {
        setIsMounted(false);
        return;
      }

      if (Object.keys(UserDetails).length === 0) return;

      if (isLoading) return;

      if (!UserDetails?.faceVerificationImage || UserDetails?.faceVerificationImage === "") {
        if (!props.path0) {
          navigate("/setup-face-verification");
        }
      } else if (!membershipDaysRemaining || !kycDaysRemaining) {
        if (!props?.path1) {
          navigate("/get-vai");
        }
      }
      //  else if (!UserDetails?.isKycCompleted) {
      // if (!props?.path2) {
      //   navigate("/vai");
      // }
      // if (FACE_VERIFICATION) {
      //   navigate('/setup')
      // }
      // } 
      else if (props?.path3) {
        navigate("/self-verification-completed");
      } else {
        StepWisePagesProtection();
      }

      setIsMounted(false);
    }, 100); // Optional 100ms delay to ensure redux state is ready

    return () => clearTimeout(delay);
  }, [
    location.pathname,
    location.state,
    UserDetails?.faceVerificationImage,
    UserDetails?.isKycCompleted,
    HourllyRate,
    Services,
    UserDetails?.gender,
    UserDetails?.vaiNowAvailable?.availableFrom,
    UserDetails?.profilePic,
    UserDetails?.mutualContractSigned,
    UserDetails?.varipayActivity,
    UserDetails?.incallAddresses?.length > 0,
    (GallaryData?.userGallary?.images?.length > 0 || GallaryData?.length > 0),
    UserDetails?.dateGuardActivity,
    (LanguagesData || UserDetails?.language),
    membershipDaysRemaining,
    kycDaysRemaining,
    ServicesData,
    isLoading
  ]);


  function StepWisePagesProtection() {
    //prevent back navigation on setup page
    // if (props?.step) {
    //   navigate("/setup");
    //   return;
    // }

    //Access main features like search ,vairidate,vai-now
    if (
      UserDetails?.gender &&
      UserDetails?.vaiNowAvailable?.availableFrom &&
      UserDetails?.profilePic &&
      UserDetails?.mutualContractSigned &&
      UserDetails?.varipayActivity &&
      UserDetails?.incallAddresses?.length > 0 &&
      (HourllyRate && Services) &&
      (GallaryData?.userGallary?.images?.length > 0 || GallaryData?.length > 0) &&
      UserDetails?.dateGuardActivity &&
      (LanguagesData || UserDetails?.language) &&
      !SocialData?.socialData?.find((item) => item)?.message
    ) {
      if (location.pathname === "/marketplace/post/review" && !location.state) {
        navigate('/marketplace/post')
      }
    } else {
      //Access mandatory pages if setup was not completed
      if (!props?.path) {
        navigate("/setup");
      }
    }
    // setIsMounted(false);
  }

  if (isMounted) {
    return <div className="text-white text-center mt-7"><Loading /></div>;
  }

  return props?.children;

}
