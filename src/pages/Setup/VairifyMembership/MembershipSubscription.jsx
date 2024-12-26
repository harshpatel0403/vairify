import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../../components/Button";

const MembershipSubscription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  // const HandlrCoupon = (selectedItem) => {
  //   navigate("/discount-coupon", {
  //     state: selectedItem,
  //   });
  // };
  const HandlePayment = () => {
    navigate("/vairify-membership-payment", {
      state: state,
    });
  };

  return (
    <div className="main-container flex flex-col justify-center h-[calc(100vh-150px)] rounded-3xl">
      <div>
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
              {`Vairify ${state?.title} Membership Plan`}
            </p>
          </div>

          <div className="mt-4 mb-7">
            <h1 className="font-bold text-3xl py-2 text-[#01195C] w-auto table mx-auto rounded-lg">
              {`${state.currency} ${state?.finalAmount + ".00"}`}
            </h1>
          </div>
        </div>

        <div className="max-w-[500px] mx-auto">
          <Button
            className={
              "mt-7 flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2"
            }
            text={"Submit Payment"}
            size="56px"
            onClick={HandlePayment}
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
            // onClick={() => HandlrCoupon(item)}
          />
        </div>
      </div>
    </div>
  );
};

export default MembershipSubscription;
