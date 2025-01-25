import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FACE_VERIFICATION } from "../config";
import moment from "moment";

export default function ProtectedRoute(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(true);
  const [currentSubscriptionIndex, setCurrentSubscriptionIndex] = useState(0);
  const [memberShipStatus, setMemberShipStatus] = useState(true);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user) || {};
  const UserProfile = useSelector((state) => state?.Profile?.profiledata) || {};
  const CalendarSchedule = useSelector((state) => state?.Calendar?.getschedule?.schedule) || [];
  const GallaryData = useSelector((state) => state?.Gallary?.userGallary?.images) || [];
  const ServicesData = useSelector((state) => state?.Services?.getservices) || [];
  const SocialData = useSelector((state) => state?.Social?.socialData) || [];

  const protectionLevel = props?.level || ["login"];
  //   HERE ARE DIFFERENT LEVELS
  // login
  // kycMember
  // kycComplete
  // vaiMember
  // tokens

  function calculateDays(expiryDate) {
    const updatedExpiryDate = moment(expiryDate);
    const currentDate = moment();
    const daysRemaining = updatedExpiryDate.diff(currentDate, "days");
    return daysRemaining;
  }

  const { HourllyRate, Services } = useMemo(() => {
    let HourllyRate = false;
    let Services = false;

    if (Object.keys(UserDetails).length > 0 && Object.keys(UserProfile).length > 0) {
      if (UserDetails?.user_type === "client-hobbyist") {
        HourllyRate = true;
        Services = true;
      }

      if (UserDetails?.user_type === "agency-business") {
        HourllyRate = true;
        Services = true;
        // HourllyRate = ServicesData?.some((item) => item?.hourlyRates?.length > 0);
        // Services = true;
      }

      if (
        UserDetails?.user_type === "companion-provider" ||
        UserDetails?.user_type === "influencer-affiliate"
      ) {
        HourllyRate = true;
        Services = true;
        // HourllyRate = ServicesData?.some((item) => item?.hourlyRates?.length > 0);
        // Services = ServicesData?.some((item) => item?.services?.length > 0);
      }
    }

    return { HourllyRate, Services };
  }, [UserDetails, ServicesData, UserProfile]);

  useEffect(() => {
    if (protectionLevel.includes("login") && !Object.keys(UserDetails).length > 0) {
      navigate("/login", { state: location.state });
    }

    if (Object.keys(UserDetails).length > 0) {
      const latestMembershipSubscription = UserDetails?.subscription[currentSubscriptionIndex];
      const latestKycSubscription = UserDetails?.kyc[currentSubscriptionIndex];

      if (UserDetails?.faceVerificationImage === "") {
        navigate("/setup-face-verification");
      } else if (!latestMembershipSubscription || !latestKycSubscription) {
        if (!props?.path1) {
          navigate("/get-vai");
        }
      } else if (!UserDetails?.isKycCompleted) {
        if (!props?.path2) {
          navigate("/vai");
        }
      }

      StepWisePagesProtection(props?.step, HourllyRate, Services, latestMembershipSubscription, latestKycSubscription);
      setIsMounted(false);
    }
  }, [location.pathname, UserDetails]);


  function StepWisePagesProtection(Step, HourllyRate, Services, latestMembershipSubscription, latestKycSubscription) {
    switch (Step) {
      case Step = 'Step0':
        //setUp Face Verification
        if (UserDetails?.faceVerificationImage !== "") {
          navigate("/get-vai");
        }
        break;

      case Step = 'Step1':
        if (latestMembershipSubscription && latestMembershipSubscription?.expiryDate && latestKycSubscription && latestKycSubscription?.expiryDate) {

          const membershipDaysRemaining = calculateDays(latestMembershipSubscription?.expiryDate)
          const kycDaysRemaining = calculateDays(latestKycSubscription?.expiryDate)

          if (membershipDaysRemaining && kycDaysRemaining) {
            navigate("/vai");
          }

          if (kycDaysRemaining <= 0 && membershipDaysRemaining <= 0) {
            setCurrentSubscriptionIndex((prevIndex) => prevIndex + 1);
          }
        }
        break;

      //documents and photo kyc 
      case Step = 'Step2':
        if (UserDetails?.isKycCompleted) {
          // if (true) {
          navigate("/self-verification-completed");
        }
        break;

      default:
        const socialdata = !SocialData?.find((item) => item)?.message;

        if (Object.keys(UserDetails).length > 0 &&
          Object.keys(UserProfile).length > 0) {
          if (
            UserProfile?.orientation &&
            UserProfile?.gender &&
            CalendarSchedule.length > 0 &&
            UserDetails?.profilePic &&
            UserDetails?.mutualContractSigned &&
            UserDetails?.varipayActivity &&
            UserDetails?.incallAddresses.length > 0 &&
            (HourllyRate || Services) &&
            GallaryData?.length > 0 &&
            UserDetails?.dateGuardActivity &&
            UserDetails?.language &&
            socialdata
          ) {
            if (location.pathname === "/marketplace/post/review" && !location.state) {
              navigate('/marketplace/post')
            }

            // navigate(location.pathname, { state: location.state });
          } else {
            if (!props?.path) {
              navigate("/setup-face-verification");
            }
          }
        }
    }
  }

  if (isMounted) {
    return <>Please wait..</>;
  }

  return props?.children;

}
