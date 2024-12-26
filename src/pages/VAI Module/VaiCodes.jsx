import { useSelector } from "react-redux";
import Button from "../../components/Button";
import TextContainer from "../../components/TextContainer";
import { useEffect, useState } from "react";
import UserService from "../../services/userServices";

const VaiCodes = () => {
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    setLoading(true);
    UserService.getUserCoupons(UserData?._id)
      .then((res) => {
        setCodes(res?.coupons);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

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
      className="main-container"
      style={{ maxHeight: "calc(100vh - 149px)" }}
    >
      <div className="flex flex-col items-center max-w-[450px] mx-auto inner-content-part-large">
        <div className="grid grid-cols-1 grid-flow-col gap-4">
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
            <div className="relative top-2">
              <img
                src={import.meta.env.BASE_URL + "images/V.A.I.(small).png"}
                alt="VAI Small"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 mt-8 mb-3">
          <div className="flex items-center justify-center text-black font-extrabold text-[16.2px]">
            <span>V.A.I. Codes</span>
          </div>
        </div>
        <div className="w-full">
          {codes && codes.length > 0 ? (
            codes?.map((coupon) => (
              <div key={coupon._id} className="flex-1 w-full mb-6">
                <TextContainer text={coupon?.code} />
              </div>
            ))
          ) : (
            <div className="flex-1 w-full mb-6 text-center">
              <img
                src={"/images/no-coupon.png"}
                alt="No Code"
                className="my-2 mx-auto"
                style={{ width: "70%" }}
              />
              <h2 className="text-[20px]">
                You have no <b>V.A.I.</b> coupon code{" "}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaiCodes;
