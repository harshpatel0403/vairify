import { useSelector } from "react-redux";
import Button from "../../components/Button";
import TextContainer from "../../components/TextContainer";
import { useEffect, useState } from "react";
import UserService from "../../services/userServices";
import Loading from "../../components/Loading/Index";
import { useTranslation } from "react-i18next";

const VaiCodes = () => {
  const { t } = useTranslation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    setLoading(true);
    UserService.getUserCoupons(UserData?._id)
      .then((res) => {
        setCodes(res?.coupons);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center align-center items-center pt-[48px] h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mb-[48px]">
      <div className="flex flex-col items-center max-w-[450px] mx-auto">
        <div className="flex-1 mt-8 mb-3">
          <div className="flex items-center justify-center text-[28px] text-white">
            <span>{t("vaiCodes.title")}</span>
          </div>
          <div className="flex items-center justify-center font-bold text-[90px] text-white">
            <span>{t("vaiCodes.header")}</span>
          </div>
          <div className="flex items-center justify-center text-[24px] text-white">
            <span>{t("vaiCodes.subtitle")}</span>
          </div>
        </div>
        <div className="w-full mt-[5%]">
          {codes && codes.length > 0 ? (
            codes?.map((coupon) => (
              <div key={coupon._id} className="flex-1 w-full sm:mb-[24px] mb-[16px] border-[1px] border-[#919EAB33] rounded-[5px] text-white">
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
              <h2 className="text-[20px] text-white">
                {t("vaiCodes.noCodesMessage")} <b>{t("vaiCodes.noCodesHighlight")}</b> {t("vaiCodes.noCodesSuffix")}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaiCodes;
