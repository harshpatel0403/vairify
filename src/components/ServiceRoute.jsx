import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

function ServiceRoute(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMounted, setIsMounted] = useState(false);
  const [currentMembershipIndex, setCurrentMembershipIndex] = useState(0);

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const subscription = UserData?.subscription;
  // const MembershipUserPlan = useSelector((state) => state?.Vai?.membershipUserPlan?.data);

  useEffect(() => {
    //**************************************** membership flag ****************************************************
    // if (subscription && subscription.length > 0) {
    if (true) {
      const latestMembership = subscription[currentMembershipIndex];
      if (latestMembership && latestMembership.expiryDate) {
        const expiryDate = moment(latestMembership.expiryDate);
        const currentDate = moment();

        const daysRemaining = expiryDate.diff(currentDate, "days");
        console.log(daysRemaining, "days")

        //**************************************** membership flag ****************************************************
        // if (!daysRemaining) {
        if (false) {
          navigate("/get-vai");
        }

        if (daysRemaining <= 0) {
          setCurrentMembershipIndex((prevIndex) => prevIndex + 1);
        }
      }
    } else {
      navigate("/get-vai");
    }
    setIsMounted(true);
  }, [subscription, currentMembershipIndex, location.pathname]);


  // useEffect(() => {
  //   const MembershipSubscriptionStatus = MembershipUserPlan
  //   const FlagStatus = localStorage.getItem('Flag2');
  //   console.log(MembershipUserPlan, "membership");

  //   if (FlagStatus === "WithoutMemberShip") {
  //   if (MembershipSubscriptionStatus !== "paid") {
  //     navigate("/get-vai");
  //   }
  //   } else {
  //     navigate("/get-vai");
  //   }

  //   setIsMounted(true);
  // }, [location?.pathname]);

  if (!isMounted) {
    return <>Please wait..</>
  }

  return props?.children;
}

export default ServiceRoute