import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import PlansServices from "../../services/PlansServices";
// import toast from 'react-toastify'

const Migration = () => {
  const { state: PlansData } = useLocation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const UserType = UserData?.user_type;
  const [migrationData, setMigrationData] = useState([]);

  const [state, setState] = useState({
    totalAmount: `${PlansData?.finalAmount}`,
    migration: 0,
    planId: PlansData?._id,
    days: PlansData?.days,
    type: PlansData?.type,
    isCouponApplied: PlansData?.isCouponApplied || false,
    subscriptionAmount: PlansData?.finalAmount,
    currency: PlansData?.currency,
    migrationId: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const HandleClick = (applyOffer, item) => {
    let amount = parseFloat(state?.totalAmount || "0");

    if (applyOffer) {
      // Apply the offer when "Yes" button is clicked
      state.migration = item?.finalAmount;
      state.totalAmount = amount + item?.finalAmount;
      state.migrationId = item?._id;
    } else {
      // Remove the offer when "No" button is clicked
      state.totalAmount = amount; // Set totalAmount without the offer
      state.migration = 0; // Reset migration value
    }

    // Update the state
    setState({ ...state });

    if (UserData?.user_type === "agency-business") {
      // Navigate to the payment page with the updated state
      navigate("/payment", {
        state: { ...PlansData, ...state },
      });
    } else {
      // Navigate to the payment page with the updated state
      navigate("/payment", {
        state: state,
      });
    }
  };

  const fetchMigration = async () => {
    try {
      const result = await PlansServices.getMigrationByUserType(UserType);
      setMigrationData(result?.data);
    } catch (error) {
      console.log(error);
      // toast.error(error);
    }
  };

  useEffect(() => {
    fetchMigration();
  }, []);

  // const HandleClick = () => {
  //   let amount = parseFloat(state.totalAmount);
  //   if (isChecked && !state.migration) {
  //     state.migration = 25;
  //     state.totalAmount = amount + 25;
  //     navigate("/payment", {
  //       state: state,
  //     });
  //   } else if (state.migration) {
  //     state.totalAmount = amount - 25;
  //     navigate("/payment", {
  //       state: state,
  //     });
  //   }
  //   console.log(state, "State");
  // };

  // const HandleOnClick = () => {
  //   let amount = parseFloat(state.totalAmount);
  //   if (state?.migration) {
  //     state.totalAmount = amount - 25;
  //   }
  //   navigate("/payment", {
  //     state: state,
  //   });
  //   console.log(state, "State");
  // };

  return (
    <div className="w-full mx-auto bg-[#B9BBCB] flex justify-center items-center rounded-3xl mx-auto">
      <div className="flex flex-col justify-center max-w-[420px]">
        <div className="grid grid-cols-1 grid-flow-col gap-4">
          <div className="relative flex flex-col justify-start items-center">
            {/* <div className="relative top-6">
            <img
              src={import.meta.env.BASE_URL + "images/VectorLogo1.png"}
              alt="Vector Logo 1"
            />
          </div>
          <div className="relative bottom-2 left-4">
            <img
              src={import.meta.env.BASE_URL + "images/VectorLogo2.png"}
              alt="Vector Logo 2"
            />
          </div> */}

            <div className="relative flex flex-col justify-start items-center my-7">
              <div className="relative">
                <img
                  width={"250px"}
                  src={"/images/chainpass_id_logo.png"}
                  alt="asdf"
                />
              </div>
            </div>

            <div className="relative mb-3">
              <span className="font-black text-[21.6px] text-[#4E4B95]">
                Migration Special
              </span>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
          <span className="font-medium text-[22.5px] leading-6 text-[#000000]">
          Exclusive limited-time offer: Unlock the TruRevu special at sign-up – one-time eligibility only!
          </span>
        </div>

        <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
          <span className="text-[28.8px] text-[#0261FF] leading-7 pt-2 pb-2 font-bold">
            50% off TruRevu Migration
            Special
          </span>
        </div>

        <div className="mx-auto flex flex-col justify-center max-w-[340px] items-center mt-2 text-left text-justify-width">
          <span className="text-[16px] text-center text-[#000000]">
            We will assign an agent to gather your reviews on the web and assign
            them to your TruRevu. This
            grand opening special will only be available 60 days from our
            opening
          </span>
        </div>

        <div className="mx-auto max-w-[340px] mt-5 mb-5 flex flex-col justify-start items-center  text-justify-width">
          <span className="text-[16px] text-center text-[#000000]">
            “Its your reputation{" "}
            <span className="text-[20px] font-bold text-left">TruRevu</span> will help you
            take control of it”
          </span>
        </div>

        {migrationData &&
          migrationData?.map((item, index) => {
            return (
              <>
                <div className="flex items-center justify-center mb-4">
                  <label className="ml-4 block text-gray-700 font-medium text-sm text-left">
                    <div className="flex flex-row justify-center items-center">
                      <div className="w-[70px] h-[60px] p-0 m-0 relative flex items-center justify-center">
                        <span className="font-bold text-[18px] text-[#000000]">
                          {`${item?.currency}${item?.amount}.00`}
                        </span>
                        <div
                          className="w-[70px] h-[42px] discounted-value absolute"
                          style={{ borderBottom: "1px solid black" }}
                        ></div>
                      </div>
                      <div className="w-[90px] h-[50px] p-0 m-0 flex items-center justify-center">
                        <span className="font-bold text-[18px] text-[#000000]">
                          {`${item?.currency}${item?.finalAmount}.00`}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="w-full mx-auto flex flex-row justify-around gap-7 items-center mb-5">
                  <button
                    className="w-full rounded-[12px] flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] max-w-[120px]"
                    onClick={() => HandleClick(true, item)}
                  >
                    Yes
                  </button>
                  <button
                    className="w-full rounded-[12px] flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] max-w-[120px]"
                    onClick={() => HandleClick(false, item)}
                  >
                    No
                  </button>
                  {/* <Button
          className={
            "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] max-w-[120px] "
          }
          text={"Yes"}
          size="45px"
          onClick={HandleClick}
        />
        <Button
          className={
            "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] max-w-[120px] "
          }
          text={"No"}
          size="45px"
          onClick={HandleOnClick}
        /> */}
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default Migration;
