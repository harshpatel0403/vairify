import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EscortResults = () => {
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
    <div>
      <div className="pt-2">
        <p className="text-[24px] text-[#02227E] font-bold text-center max-w-none">
          Escort Results
        </p>
        <div className="bg-linear-gradient h-[40px]  mb-3 mt-3"></div>
        <div className="flex flex-wrap justify-center sm:justify-center gap-2 sm:gap-4">
          {ResultsData?.length > 0 ? (
            ResultsData?.filter(
              (item) => item?.profile?.userId?.user_type !== user_type
            )?.map((data, index) => (
              <div
                key={index}
                data-index={index}
                className="rounded-2xl px-4 pt-2 bg-gradient-to-b from-[#0247FF] to-[#fff] mb-4 w-[47%] max-w-[190px]"
              >
                <div
                  className="flex justify-center flex-col"
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
                    className="rounded-2xl"
                  />
                  <div className="text-center">
                    <p className="text-[12px] text-[#000] font-bold">
                    TruRevu<br />{" "}
                      <span className="capitalize">
                        {data?.profile?.userId?.name}
                      </span>{" "}
                      / ID#{" "}
                      <span className="uppercase">{data?.profile?.siteId}</span>
                    </p>
                    {/* TODO: add trurevu rating here */}
                    <div className="flex flex-row-reverse items-center justify-center gap-1">
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
                    </div>
                    <span className="text-[#000] font-bold">
                      {getRate(data).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-[32px] text-[#4b4b4b] font-bold text-center h-[430px] flex flex-col justify-center items-center">
              <div className="image-not">
                <img src="/images/notFound.png" alt="logo" />
              </div>
              Result not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscortResults;
