import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faL, faLadderWater, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import moment from "moment";
import PlansServices from "../../../services/PlansServices";
import Loading from "../../../components/Loading/Index";
import Button from "../../../components/Button";

const VairifyMembershipPlans = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vairifyPlansData, setVairifyPlansData] = useState([]);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  console.log("user Details", UserDetails);
  const UserType = UserDetails?.user_type;

  const fetchVairifyPlans = async () => {
    try {
      setLoading(true);
      const result = await PlansServices.getVairifyMembershipPlans(UserType);
      // TODO: fliter out plans having priceId only. To avoid getting error at the time of payment
      setVairifyPlansData(result?.data?.filter(item => item?.priceId));
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVairifyPlans();
  }, []);

  const handleSelectPlan = (selectedPlan) => {
    navigate("/membership-subscription", {
      state: selectedPlan,
    });
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="w-full mx-auto flex flex-col flex-auto items-center ">
        <div className="w-full flex flex-col items-center md:my-[48px] mt-[-30px] mb-[40px]">
          <span className="font-bold sm:text-[26px] text-[18px] text-white">
            VAIRIFY Membership Plans
          </span>
        </div>
        <div className="w-full">
          <div className="w-full ">
            {!vairifyPlansData?.length && (
              <div className="flex items-center justify-center w-full flex-col">
                <img src="/images/home/result-not-found.svg" alt="not found" />
                <div className="w-[100%] text-center text-white pt-14 font-semibold">
                  No results found!
                </div>
              </div>
            )}
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 pt-[35px] p-5 gap-x-[30px] gap-y-3 overflow-hidden overflow-y-auto rounded-xl inner-card-part vairify-plans-cards-main">
              {vairifyPlansData &&
                vairifyPlansData?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col rounded-t-[20px] md:rounded-t-[20px] md:rounded-b-[20px] rounded-b-[20px] cursor-pointer vairify-plans-cards p-[20px]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #004B62, #003234)",
                      }}
                    >

                      <div className="flex md:min-w-[120px] md:max-w-[120px] md:w-[120px] min-w-[100px] max-w-[100px] w-[100px] mb-5">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-[32px] text-white font-bold leading-none">
                            {`${item?.currency}${item?.finalAmount}`}
                          </span>
                          <span className="text-[16px] text-[#ffffff92] leading-none">
                            /per
                          </span>
                          <span className="text-[16px] text-[#ffffff92] leading-none">
                            {item?.title === "Monthly" ? "Month" : item?.title == "Yearly" ? "Year" : "Free"}
                          </span>
                        </div>
                      </div>

                      <div className="varify-card-content text-[14px]">

                        <div
                          className="flex flex-row justify-between items-center mb-1"
                        >
                          <h6 className="font-normal text-[#ffffff92]">
                            Validity
                          </h6>
                          <h6 className="text-white uppercase">
                            {`${item?.days} days`}
                          </h6>
                        </div>
                        <div
                          className="flex flex-row justify-between items-center mb-4"
                        >
                          <h6 className="font-normal text-[#ffffff92]">
                            Discount
                          </h6>
                          <h6 className="text-white uppercase">
                            {`${item?.discountAmount} ${item?.currency}`}
                          </h6>
                        </div>
                      </div>

                      <div className="flex justify-center w-full max-w-[500px] mx-auto">
                        <Button
                          text={"Select Plan"}
                          onClick={() => handleSelectPlan(item)}
                        />
                      </div>

                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VairifyMembershipPlans;
