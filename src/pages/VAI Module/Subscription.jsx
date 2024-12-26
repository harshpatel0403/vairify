import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import PlansServices from "../../services/PlansServices";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Subscription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [plansData, setPlansData] = useState([]);

  const UserType = UserData?.user_type;

  const HandlrCoupon = (selectedItem) => {
    navigate("/discount-coupon", {
      state: selectedItem,
    });
  };
  const HandlrPayment = (selectedItem) => {
    navigate("/migration", {
      state: { ...selectedItem, ...state },
    });
  };

  const fetchPlans = async () => {
    try {
      const result = await PlansServices.getPlansByUserType(UserType);
      setPlansData(result?.data);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="main-container flex flex-col justify-center h-[calc(100vh-150px)] rounded-3xl">
      {plansData &&
        plansData?.map((item, index) => {
          return (
            <div key={index}>
              {/* <div className="grid grid-cols-1 grid-flow-col gap-4">
        <div className="relative flex flex-col justify-start items-center">
          <div className="relative top-6">
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
          </div>
        </div>
      </div> */}

              {/* <div className="pt-4 mx-auto">
        <img
          className="mx-auto"
          src={import.meta.env.BASE_URL + "images/V.A.I..png"}
        />
        <p className="text-xl mt-8 font-semibold">
          Verified Anonymous Identity
        </p>
      </div> */}

              <div className="max-w-[500px] w-full yellowbg_card mb-10 pb-4 px-0 bg-[#ededf7]">
                <div className="relative flex flex-col justify-start items-center">
                  <div className="relative mb-4">
                    <img
                      width={"250px"}
                      src={"/images/chainpass_id_logo.png"}
                      alt="asdf"
                    />
                  </div>
                  <p className="text-[15px] font-semibold">
                    Verified Anonymous Identity
                  </p>
                </div>

                <div className="mt-4 mb-7">
                  <h1 className="font-bold text-3xl py-2 text-[#01195C] w-auto table mx-auto rounded-lg">
                    {`${item?.currency} ${item?.finalAmount + ".00"}`}
                  </h1>
                </div>

                {
                  (state?.AdditionalVerification > 0) &&

                  <>
                    <div className="mt-4 mb-7">
                      <h1 className="font-bold text-3xl py-2 text-[#01195C] w-auto table mx-auto rounded-lg">
                        {`${item?.currency} ${"25" + ".00"} * ${state?.AdditionalVerification} coupons`}
                      </h1>
                    </div>
                    <div className="mt-4 mb-7">
                      <h1 className="font-bold text-3xl py-2 text-[#01195C] w-auto table mx-auto rounded-lg">
                        {`Total ${item?.currency} ${(25 * state?.AdditionalVerification + item?.finalAmount).toFixed(2)}`}
                      </h1>
                    </div>
                  </>

                }
              </div>

              <div className="max-w-[500px] mx-auto">
                <Button
                  className={
                    "mt-7 flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2"
                  }
                  text={"Submit Payment"}
                  size="56px"
                  onClick={() => HandlrPayment(item)}
                />
              </div>

              <div className="pt-5 pb-4 text-bold max-w-[500px] mx-auto">
                <hr className="border-black w-14 inline-block align-middle" />
                <span className="text-black font-bold mx-3 text-sm">OR</span>
                <hr className="border-black w-14 inline-block align-middle" />
              </div>
              <div className="pb-7 max-w-[500px] mx-auto">
                <Button
                  className={
                    "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                  }
                  text={"Enter Coupon Code"}
                  size="56px"
                  onClick={() => HandlrCoupon(item)}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Subscription;
