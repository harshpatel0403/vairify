import { checkWebSocketsSupport } from "detectrtc";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import VaridateService from "../services/VaridateServices";
import { FACE_VERIFICATION } from "../config";
export default function ProtectedRoute(props) {
  // const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [currentSubscriptionIndex, setCurrentSubscriptionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const Auth = useSelector((state) => state?.Auth?.Auth?.status);
  let UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  // useEffect(()=>{
  //   dispatch(HandleGetProfile(UserDetails._id));
  // },[]);

  const UserProfile = useSelector((state) => state?.Profile);
  const KycUserPlan = useSelector((state) => state?.Vai?.kycuserPlan?.data);
  const MembershipUserPlan = useSelector((state) => state?.Vai?.membershipUserPlan?.data);
  const CalendarSchedule = useSelector((state) => state?.Calendar?.getschedule);
  const GallaryData = useSelector((state) => state?.Gallary);
  const ServicesData = useSelector((state) => state?.Services?.getservices);
  const SocialData = useSelector((state) => state?.Social);
  const LanguagesData = useSelector((state) => state?.Auth?.language);
  const navigate = useNavigate();
  const location = useLocation();

  const protectionLevel = props?.level || ["login"];
  //   HERE ARE DIFFERENT LEVELS
  // login
  // kycMember
  // kycComplete
  // vaiMember
  // tokens

  useEffect(() => {
    const fetchUserDetails = async () => {
      UserDetails = await VaridateService?.fetchUserDetails(UserDetails?._id)
    }
    fetchUserDetails();
    if (protectionLevel.includes("login") && !UserDetails) {
      navigate("/login", { state: location.state });
    }

    if (SocialData?.loading && GallaryData?.loading && UserProfile?.loading && UserProfile?.profiledata) {
      setIsMounted(false);
      // console.log(SocialData?.socialData, GallaryData?.userGallary?.images, UserProfile?.profiledata, "data12")

      let HourllyRate;
      let Services;

      if (UserDetails?.user_type == "client-hobbyist") {
        HourllyRate = true;
        Services = true;
      } else if (UserDetails?.user_type == "agency-business") {
        HourllyRate = ServicesData?.find((item) => item)?.hourlyRates?.length > 0;
        Services = true;
      } else if (UserDetails?.user_type == "companion-provider") {
        HourllyRate = ServicesData?.find((item) => item)?.hourlyRates?.length > 0;
        Services = ServicesData?.find((item) => item)?.services?.length > 0;
      } else if (UserDetails?.user_type == "influencer-affiliate") {
        HourllyRate = ServicesData?.find((item) => item)?.hourlyRates?.length > 0;
        Services = ServicesData?.find((item) => item)?.services?.length > 0;
      }

      // const FlagStatus = localStorage.getItem('Flag');
      StepWisePagesProtection(props?.step, HourllyRate, Services);
      setIsLoading(false);
      setIsMounted(true);
    } else {
      setIsMounted(true);
    }
  }, [location.pathname, SocialData, GallaryData, UserProfile, UserDetails]);

  function calculateDays(expiryDate) {
    const updatedExpiryDate = moment(expiryDate);
    const currentDate = moment();
    const daysRemaining = updatedExpiryDate.diff(currentDate, "days");
    return daysRemaining;
  }

  function StepWisePagesProtection(Step, HourllyRate, Services) {
    switch (Step) {
      case Step = 'Step1':
        const membershipSubscription = UserDetails?.subscription;
        const kycSubscription = UserDetails?.kyc;

        let facevarification = false;

        if (UserDetails?.faceVerificationImage !== "") {
          if (props.path) {
            // navigate(props.path1);
          } else {
            navigate("/get-vai");
            facevarification = true;
          }
        }
        if (UserDetails?.faceVerificationImage === "") {
          navigate('/setup-face-verification')
        }

        // if membership not founds 

        // if (membershipSubscription?.length <= 0) {
        //   if (props.path1) {
        //     // navigate(props.path2);
        //   } else {
        //     navigate("/get-vai");
        //   }
        // }

        // if (kycSubscription?.length <= 0) {
        //   if (props.path1) {
        //     // navigate(props.pat1);
        //   } else {
        //     navigate("/get-vai");
        //   }
        // }

        //if membershi founds so we exicute next step
        if (membershipSubscription && membershipSubscription?.length > 0 && kycSubscription && kycSubscription?.length > 0) {

          const latestMembershipSubscription = membershipSubscription[currentSubscriptionIndex];
          const latestKycSubscription = kycSubscription[currentSubscriptionIndex];

          if (latestMembershipSubscription && latestMembershipSubscription?.expiryDate && latestKycSubscription && latestKycSubscription?.expiryDate) {

            const membershipDaysRemaining = calculateDays(latestMembershipSubscription?.expiryDate)
            const kycDaysRemaining = calculateDays(latestKycSubscription?.expiryDate)

            let membership
            if (membershipDaysRemaining && kycDaysRemaining && facevarification) {
              // if (props.path5) {
              // }
              if (props.path2) {
                navigate(props.path2);
              } else {
                navigate("/payment-success");
                membership = true
              }
            }

            if (kycDaysRemaining <= 0 && membershipDaysRemaining <= 0) {
              setCurrentSubscriptionIndex((prevIndex) => prevIndex + 1);
            }
          }
        } else {
          //******************************* Flag For Skipp Kyc **************************************/
          // if (props.path1) {
          //   // navigate(props.pat1);
          // } else {
          //   navigate("/get-vai");
          // }
          //******************************* Flag For Skipp Kyc **************************************/
        }


        // it checks kyc documents and photo uploaded or not 
        let kyc;
        if (UserDetails?.isKycCompleted && membership) {
          // navigate("/kyc-success");
          navigate("/self-verification-completed");
          kyc = true
        }

        //******************************* Flag For Skipp Kyc **************************************/
        // if (kyc) {
        if (FACE_VERIFICATION && facevarification) {
          navigate("/setup");
        }
        //******************************* Flag For Skipp Kyc **************************************/


        // const KycSubscriptionStatus = KycUserPlan.some((item) => item?.slug == "paid");
        // const MembershipSubscriptionStatus = MembershipUserPlan.some((item) => item?.slug == "paid");

        // console.log(MembershipSubscriptionStatus, props.path2, KycSubscriptionStatus && props.path, "kyc and membership")
        // // if (FlagStatus === "VAI") {
        // if (MembershipSubscriptionStatus && props.path1) {
        //   navigate("/payment-success");
        //   // navigate("/setup")
        // }
        // if (KycSubscriptionStatus && props.path2) {
        //   navigate("/setup")
        // }
        // } else if (FlagStatus === "WithoutVAI") {
        //   navigate("/self-verification-completed")
        //   // navigate("/setup")
        // }
        //  else {
        //   navigate("/get-vai")
        // }
        break;

      default:
        // setup flag
        if (
          UserProfile?.profiledata?.orientation &&
          UserProfile?.profiledata?.gender &&
          CalendarSchedule?.schedule.length > 0 &&
          UserDetails?.profilePic &&
          UserDetails?.mutualContractSigned &&
          UserDetails?.varipayActivity &&
          UserDetails?.incallAddresses.length > 0 &&
          (HourllyRate || Services) &&
          GallaryData?.userGallary?.images?.length > 0 &&
          UserDetails?.dateGuardActivity &&
          // LanguagesData &&
          UserDetails?.language &&
          !SocialData?.socialData?.find((item) => item)?.message
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

  if (!isMounted) {
    return <>Please wait..</>;
  }
  if (isLoading) {
    return <>Loading..</>;
  }

  return props?.children;

}
