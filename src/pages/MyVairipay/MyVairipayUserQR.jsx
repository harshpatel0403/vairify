import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MyVairipayUserQR() {
  const { t } = useTranslation();
  const { state } = useLocation();
  console.log("babu: ", state);
  const handleSubmit = () => {
    // navigate("/my-vairipay-request-confirm");
  };
  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex flex-row justify-between items-start">
          <div className="flex flex-col items-center justify-center">
            <div>
              <span className="text-[18px] text-[#040C50] font-extrabold font-Roboto-Serif">
                {t("vairipayuserqr.verifyIdLabel")}
              </span>
            </div>
            <div>
              <span className="text-[15px] text-[#040C50] font-bold uppercase">
                {state?.UserRequest?.requester?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "0px", bottom: "80px" }}
              className="absolute w-full h-full rounded-full"
            >
              <img
                className="w-[120px] h-[120px] bg-[#fff] rounded-full border-2 overflow-hidden"
                rc={
                  state?.UserRequest?.requester?.profilePic !== ""
                    ? `${import.meta.env.VITE_APP_S3_IMAGE}/${
                        state?.UserRequest?.requester?.profilePic
                      }`
                    : state?.UserRequest?.requester?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                alt={state?.UserRequest?.requester?.name}
              />
            </div>
            <div style={{ right: "4px", top: "6px" }} className="absolute">
              <img
                src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                alt="Sugar Icon Second"
              />
            </div>
          </div>
          <div>
            <div>
              <span className="text-[18px] text-[#040C50] font-bold font-Roboto-Serif">
                {t("vairipayuserqr.revuTitle")}
              </span>
            </div>
            <div className="flex flex-row justify-center items-center trurevu-star">
              <FontAwesomeIcon
                icon={faStar}
                color={
                  state?.UserRequest?.requester?.averageRating >= 1
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  state?.UserRequest?.requester?.averageRating >= 2
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  state?.UserRequest?.requester?.averageRating >= 3
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  state?.UserRequest?.requester?.averageRating >= 4
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  state?.UserRequest?.requester?.averageRating >= 5
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <span className="text-[15px] text-[#040C50] font-bold">
                {state?.UserRequest?.requester?.averageRating}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center relative bottom-2">
          <div>
            <span className="font-bold text-[24px]">
              {state?.UserRequest?.requester?.name}
            </span>
          </div>
        </div>
        <div className="inner-content-part-medium flex flex-col mx-auto w-full service-rates-user-profile">
          <div className="w-full mx-auto flex flex-col justify-center items-center pt-1">
            <div className="w-full mx-auto flex items-center justify-center">
              <img
                width={90}
                src={import.meta.env.BASE_URL + "images/VairipayAddLogo.png"}
                alt="Vairipay Add Logo"
              />
            </div>
            <div className="w-full mx-auto flex flex-col justify-center items-center mt-3 bg-[#3760CB] rounded-[100px] px-10 py-2 shadow-2xl border-2 border-black">
              <span className="text-center">
                <span className="font-semibold text-[18px] text-white leading-6">
                  {/* You have selected {state?.App?.paymentAppName} Touch the QR
                  code to Open the app to {state?.UserRequest?.requester?.name}{" "}
                  account. */}
                  {t("vairipayuserqr.qrInstruction", {
                    app: state?.App?.paymentAppName,
                    user: state?.UserRequest?.requester?.name,
                  })}
                </span>
              </span>
            </div>
            <button className="w-full mx-auto" onClick={() => handleSubmit()}>
              <div className="w-full mx-auto flex flex-col justify-center items-center mb-5 py-4 bg-[#3760CB] rounded-[30px] mt-10">
                {/* <div>
                <img
                  src={
                    import.meta.env.VITE_APP_API_VARIPAY_IMAGE_URL +
                    `/${state?.App?.paymentImage}`
                  }
                  alt="Vairipay QR Apple Logo"
                />
              </div> */}
                {/* <div>
                <span className="text-white text-[27px] font-bold">
                  {state?.UserRequest?.requester?.name}
                </span>
              </div> */}
                <div>
                  <span className="text-white text-[16px] font-medium">
                    {t("vairipayuserqr.paymentId")}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-white text-[24px] font-bold ml-2">
                    {state?.UserRequest?.requester?.vaiID}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-white text-[16px] font-medium">
                    {t("vairipayuserqr.qrCode")}
                  </span>
                </div>
                <div>
                  <img
                    className="w-[126px] h-[129px] pt-1"
                    src={`${import.meta.env.VITE_APP_S3_IMAGE}/${
                      state?.App?.qrCode
                    }`}
                    alt="Vairipay Request QR Logo"
                    onError={(e) => {
                      console.error("Error loading image:", e);
                    }}
                    // src={`${import.meta.env.VITE_APP_API_USER_VARIPAYS_IMAGE_URL
                    //   }/${state?.App?.qrCode}`}
                    // alt="Vairipay Request QR Logo"
                    // onError={(e) => {
                    //   console.error("Error loading image:", e);
                    // }}
                  />
                </div>
                <div className="mt-3">
                  <span className="text-white text-[16px] font-medium">
                    {t("vairipayuserqr.requestedAmount")}
                  </span>
                </div>
                <div>
                  <span className="text-white text-[32px] font-bold">
                    ${state?.UserRequest?.amount}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
