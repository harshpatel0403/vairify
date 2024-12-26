import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import PlansServices from "../../../services/PlansServices";

const VAIMembershipPlans = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vaiPlansData, setVaiPlansData] = useState([]);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const UserType = UserDetails?.user_type;

  const fetchVAIPlans = async () => {
    try {
      setLoading(true);
      const result = await PlansServices.getPlansByUserType(UserType);

      setVaiPlansData(result?.data);
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
    fetchVAIPlans();
  }, []);

  const handleSelectPlan = (selectedPlan) => {
    navigate("/vai-membership-subscription", {
      state: selectedPlan,
    });
  };

  if (loading) {
    return (
      <div className="main-container h-full">
        <div className="h-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="main-container px-0"
      style={{ minHeight: "calc(100vh - 149px)" }}
    >
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full flex flex-col items-center mt-[30px] bg-[#797E9E] py-2 px-[10px]">
          <span className="font-bold text-[26px] text-[#040C50]">
            VAI Membership Plans
          </span>
        </div>
        <div className="w-full">
          <div className="w-full ">
            {/*  */}
            {!vaiPlansData?.length && (
              <div className="w-[100%] text-center pt-14 font-semibold">
                No results found!
              </div>
            )}
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 pt-[35px] p-5 gap-x-[30px] gap-y-3 overflow-hidden overflow-y-auto rounded-xl inner-card-part">
              {vaiPlansData &&
                vaiPlansData?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col  rounded-t-[40px] md:rounded-t-[40px] md:rounded-b-[40px] rounded-b-[40px] p-1 cursor-pointer vairify-plans-cards"
                      style={{
                        backgroundImage:
                          "linear-gradient(to bottom, #141416, #333e44, #4c5e68)",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center mx-auto  md:min-w-[120px] md:max-w-[120px] md:w-[120px] md:h-[120px] min-w-[100px] max-w-[100px] w-[100px] h-[100px]">
                        <div className="flex-row">
                          <span className="text-[55px] text-white font-bold">
                            {`${item?.finalAmount}`}
                          </span>
                          <span className="text-[25px] mt-3 text-white">
                            {item?.currency}
                          </span>
                        </div>

                        <h6
                          className="text-[15px] font-medium text-white  mb-2 "
                          style={{ borderBottom: "1px solid white" }}
                        >
                          Per Year
                        </h6>
                      </div>

                      <div className="varify-card-content mt-[20px] mx-1">
                        <div
                          className="flex flex-row justify-between items-center mb-4"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.3)",
                          }}
                        >
                          <h6 className="text-[15px] font-normal text-white">
                            Plan type
                          </h6>
                          <h6 className="text-[16px] font-bold text-white uppercase">
                            {item?.title}
                          </h6>
                        </div>

                        <div
                          className="flex flex-row justify-between items-center mb-4"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.3)",
                          }}
                        >
                          <h6 className="text-[15px] font-normal text-white mb-[5px]">
                            Validity
                          </h6>
                          <h6 className="text-[16px] font-bold text-white mb-[5px] uppercase">
                            {`${item?.days} days`}
                          </h6>
                        </div>
                        <div
                          className="flex flex-row justify-between items-center mb-4"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.3)",
                          }}
                        >
                          <h6 className="text-[15px] font-normal text-white mb-[5px]">
                            Discount
                          </h6>
                          <h6 className="text-[16px] font-bold text-white mb-[5px] uppercase">
                            {`${item?.discountAmount} ${item?.currency}`}
                          </h6>
                        </div>
                      </div>

                      <div className={`relative h-[30px] my-[40px]`}>
                        <button
                          className="select-plan-button  p-2"
                          onClick={() => handleSelectPlan(item)}
                        >
                          <div className="text-custom f-custom-white">
                            <span
                              className={`w-full relative text-[18px] font-bold uppercase`}
                            >
                              Select Plan
                            </span>
                          </div>
                        </button>
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

export default VAIMembershipPlans;
