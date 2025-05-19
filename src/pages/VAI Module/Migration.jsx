import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import PlansServices from "../../services/PlansServices";
import BackButton from "../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";
// import toast from 'react-toastify'

const Migration = () => {
  const { state: PlansData } = useLocation();
  const { t } = useTranslation();
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
    <div className="signup-backgound-design">
      <div className="signup-container container">
        <div className="signup-content relative">
          <div className="backnavigation"><BackButton /></div>
          <div className="logo-img-container">
            <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
            <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
          </div>

          <div className="sm:mt-[64px] mt-[32px] mb-[24px]">
            <div className="flex flex-col items-center justify-center gap-[20px]">
              <img src='/images/face-verification/shope.svg' alt='img' />
              <img src={"/images/face-verification/chainpass.svg"} alt="asdf" />
            </div>


            <h4 className='sm:text-[28px] text-[24px] font-semibold text-white text-center mb-[8px]'>{t("migration.title")}</h4>
            <h5 className='sm:text-[18px] text-[16px] font-normal text-white opacity-70 text-center mb-[8px]'> {t("migration.tagline")}</h5>
            <h4 className='sm:text-[28px] text-[24px] font-semibold text-white text-center mb-[8px]'>{t("migration.offerTitle")}</h4>
            <h5 className='sm:text-[18px] text-[16px] font-normal text-white opacity-70 text-center mb-[8px]'>{t("migration.description1")}</h5>
            <h5 className='sm:text-[18px] text-[16px] font-normal text-white opacity-70 text-center mb-[8px]'> {t("migration.description2")}</h5>
            <h5 className='sm:text-[18px] text-[16px] font-normal text-white opacity-70 text-center mb-[8px]'><span className="line-through">$50.00</span> $25.00</h5>



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
                            <span className="font-bold text-[18px] text-white">
                              {`${item?.currency}${item?.finalAmount}.00`}
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="w-full mx-auto flex flex-row justify-around gap-7 items-center mb-8">
                      <button
                        className="w-full bg-[#E8EBF0] text-[#0247FF] hover:text-white hover:bg-[#0247FF] font-semibold text-[15px] p-[12px] rounded-[8px] transition-all duration-300 ease-in-out"
                        onClick={() => HandleClick(true, item)}
                      >
                        {t("migration.buttonYes")}
                      </button>
                      <button
                        className="w-full bg-[#FFFFFF29] font-semibold text-[15px] text-white hover:bg-[#0247FF] p-[12px] rounded-[8px] transition-all duration-300 ease-in-out"
                        onClick={() => HandleClick(false, item)}
                      >
                        {t("migration.buttonNo")}
                      </button>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Migration;



