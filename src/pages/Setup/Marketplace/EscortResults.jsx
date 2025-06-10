import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { GoPerson } from "react-icons/go";
import PageTitle from "../../../components/PageTitle";

const EscortResults = () => {
  const { t } = useTranslation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const user_type = UserData?.user_type;

  const escort_results = [
    {
      img: "/images/Escort-1.png",
    },
    {
      img: "/images/Escort-2.png",
    },
    {
      img: "/images/Escort-3.png",
    },
    {
      img: "/images/Escort-4.png",
    },
    {
      img: "/images/Escort-5.png",
    },
    {
      img: "/images/Escort-6.png",
    },
    {
      img: "/images/Escort-7.png",
    },
    {
      img: "/images/Escort-8.png",
    },
  ];
  const navigate = useNavigate();
  const ResultsData = useSelector((state) => state?.Market?.results?.result);
  console.log(
    "🚀 ~ file: EscortResults.jsx:34 ~ EscortResults ~ ResultsData:",
    ResultsData
  );
  const getRate = (data) =>
    (data?.profile?.userId?.reviews || []).reduce(
      (total, item) => total + item.rating,
      0
    ) / ((data?.profile?.userId?.reviews || []).length || 1);

  return (
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={t("escortResults.pageTitle")} />
      </div>
      <div>
        <div className={`sm:grid-cols-2 grid grid-cols-1 gap-[24px] w-full`}>
          {ResultsData?.length > 0 &&
            ResultsData?.filter(
              (item) => item?.profile?.userId?.user_type !== user_type
            )?.map((data, index) => (
              <div
                key={index}
                data-index={index}
                className="w-full bg-[#919EAB33] rounded-[16px] p-[16px]"
              >
                <div className="flex justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      // TODO: add base url if needed for the profile pic image path
                      src={
                        data?.profile?.userId?.profilePic
                          ? import.meta.env.VITE_APP_S3_IMAGE +
                            "/" +
                            data?.profile?.userId?.profilePic
                          : "/images/female.png"
                      }
                      // src={
                      //   data?.profile?.userId?.profilePic
                      //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                      //       "/" +
                      //       data?.profile?.userId?.profilePic
                      //     : "/images/female.png"
                      // }
                      alt=""
                      className=" rounded-full w-[48px] h-[48px]"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-[16px] text-white font-normal">
                        {data?.profile?.userId?.name}
                      </p>
                      <p className="text-[14px] text-[#919EAB] font-normal">
                        {data?.profile?.siteId}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    {/* TODO: add trurevu rating here */}
                    {/* <div className="flex flex-row-reverse items-center justify-center gap-1">
                      <FontAwesomeIcon
                        icon={faStar}
                        color={getRate(data) >= 5 ? "#E1AB3F" : "#111"}
                        className="text-[10px] margin-right-5"
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        color={getRate(data) >= 4 ? "#E1AB3F" : "#111"}
                        className="text-[10px] margin-right-5"
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        color={getRate(data) >= 3 ? "#E1AB3F" : "#111"}
                        className="text-[10px] margin-right-5"
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        color={getRate(data) >= 2 ? "#E1AB3F" : "#111"}
                        className="text-[10px] margin-right-5"
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        color={getRate(data) >= 1 ? "#E1AB3F" : "#111"}
                        className="text-[10px]"
                      />
                    </div> */}
                    <h5 className="text-white font-medium text-[18px] flex items-center gap-1">
                      {getRate(data).toFixed(1)}
                      <img src="/images/home/star.svg" alt="icon" />
                    </h5>
                  </div>
                </div>
                <button
                  className="flex items-center justify-center gap-1 bg-white text-[#060C4D] rounded-[8px] py-[7px] px-4 w-full mt-[24px] hover:scale-[0.98] transition-all duration-200"
                  onClick={() =>
                    navigate("/user/profile", {
                      state: {
                        item: data?.profile,
                        market: true,
                        service_type: "escort",
                      },
                    })
                  }
                >
                  <GoPerson />
                  {t("escortResults.profileButton")}
                </button>
              </div>
            ))}
        </div>

        {!ResultsData?.length > 0 && (
          <div className="text-[20px] text-white font-medium text-center flex flex-col justify-center items-center w-full mb-[48px] h-full">
            <div>
              <img src="/images/home/notfound.svg" alt="logo" />
            </div>
            {t("escortResults.resultNotFound")}
          </div>
        )}
      </div>
    </div>
  );
};

export default EscortResults;
