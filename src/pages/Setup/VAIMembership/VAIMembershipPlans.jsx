import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import PlansServices from "../../../services/PlansServices";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading/Index";

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
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }


  return (
    <div className="container">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full flex flex-col items-center mt-[30px] py-2 px-[10px]">
          <span className="font-bold text-[26px] text-white">
            VAI Membership Plans
          </span>
        </div>
        <div className="w-full">
          <div className="w-full ">
            {!vaiPlansData?.length && (
              <div className="w-[100%] text-center text-white pt-14 font-semibold">
                No results found!
              </div>
            )}
            <div className="w-full grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 pt-[35px] p-5 gap-x-[30px] gap-y-3 overflow-hidden overflow-y-auto rounded-xl inner-card-part ">
              {vaiPlansData &&
                vaiPlansData?.map((item, index) => {
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
                            {item?.days == "365" ? "Year" : "Month"}
                          </span>
                        </div>
                      </div>



                      <div className="varify-card-content text-[14px]">
                        <div
                          className="flex flex-row justify-between items-center mb-1"
                        >
                          <h6 className="font-normal text-[#ffffff92]">
                            Plan type
                          </h6>
                          <h6 className="text-white uppercase">
                            {item?.title}
                          </h6>
                        </div>

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

export default VAIMembershipPlans;
