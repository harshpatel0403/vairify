import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

const hourLabels = {
  0.5: "0.5 Hour",
  1: "1 Hour",
  2: "2 Hours",
  3: "3 Hours",
  6: "6 Hours",
  12: "12 Hours",
  24: "24 Hours",
  48: "48 Hours",
  244: "Another 24th",
};

const ServiceRates = () => {
  const { state: userDetails } = useLocation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const updatedServices = useSelector((state) => state?.Services?.getservices);
  const groupedServices = _.groupBy(updatedServices[0]?.services, "service");
  const [handelChangeTab, setHandelChangeTab] = useState(false);

  const userType = userDetails?.market
    ? userDetails?.item?.userId?.user_type ||
      userDetails?.item?.user_type ||
      userDetails?.item?.userType
    : UserData.user_type;
  const rate = userDetails?.market
    ? userDetails?.item?.userId?.averageRating ||
      userDetails?.item?.averageRating
    : UserData?.averageRating;

  const isFollowed = useCallback(
    (id) => {
      let result = UserData?.followers?.find(
        (item) => item?.userId === id || item?._id === id
      );
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    [UserData]
  );

  return (
    <div className="main-container usergreydisabled pb-1 py-1">
      <div className="w-full mx-auto flex flex-row justify-between items-start mt-4">
        <div className="flex flex-col items-center justify-center leading-[18px]">
          <div>
            <span className="text-[18px] text-[#040C50] font-extrabold">
              VAI
              <span className="text-[18px] text-[#040C50] font-semibold">
                RIFY ID
              </span>
            </span>
          </div>
          <div>
            <span className="text-[15px] text-[#040C50] font-bold">
              {userDetails?.market ? (
                <>
                  {userDetails?.item?.userId?.vaiID || userDetails?.item?.vaiID}
                </>
              ) : (
                <>{UserData?.vaiID}</>
              )}
            </span>
          </div>
        </div>
        <div className="w-[120px] relative">
          <div
            style={{ left: "0px", bottom: "65px" }}
            className="absolute w-full h-full rounded-full"
          >
            {(
              userDetails?.market
                ? userDetails?.item?.userId?.profilePic ||
                  userDetails?.item?.profilePic
                : UserData?.profilePic
            ) ? (
              <img
              src={
                import.meta.env.VITE_APP_S3_IMAGE +
                `/${
                  userDetails?.market
                    ? userDetails?.item?.userId?.profilePic ||
                      userDetails?.item?.profilePic
                    : UserData?.profilePic
                }`
              }
                // src={
                //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //   `/${
                //     userDetails?.market
                //       ? userDetails?.item?.userId?.profilePic ||
                //         userDetails?.item?.profilePic
                //       : UserData?.profilePic
                //   }`
                // }
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                alt="Hot Rod"
              />
            ) : (
              <img
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                src={
                  (userDetails?.market
                    ? userDetails?.item?.userId?.gender ||
                      userDetails?.item?.gender
                    : UserData?.gender) === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                alt="Hot Rod"
              />
            )}
          </div>
          {userDetails?.market && (
            <div
              onClick={() => {
                followLoading ? null : handleFollow();
              }}
              style={{ right: "0px", top: "25px" }}
              className="absolute"
            >
              {userType === "client-hobbyist" ? (
                <img
                  src={import.meta.env.BASE_URL + "images/HotRodIcon2.png"}
                  alt="Hot Rod Icon Second"
                  className={`${
                    isFollowed(
                      userDetails?.item?.userId?._id || userDetails?.item?._id
                    )
                      ? ""
                      : "grayscale"
                  }`}
                />
              ) : null}
              {userType === "companion-provider" ? (
                <img
                  src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                  alt="Sugar Icon Second"
                  className={`${
                    isFollowed(
                      userDetails?.item?.userId?._id || userDetails?.item?._id
                    )
                      ? ""
                      : "grayscale"
                  }`}
                />
              ) : null}
              {userType === "agency-business" || userType === "super" ? (
                <img
                  src={
                    import.meta.env.BASE_URL + "images/IntimateMassageIcon2.png"
                  }
                  alt="Sugar Icon Second"
                  className={`${
                    isFollowed(
                      userDetails?.item?.userId?._id || userDetails?.item?._id
                    )
                      ? ""
                      : "grayscale"
                  }`}
                />
              ) : null}
            </div>
          )}
        </div>
        <div className="leading-[18px]">
          <div>
            <span className="text-[18px] text-[#040C50] font-bold">
              TruRevu
            </span>
          </div>

          <div className="flex justify-center items-center">
            <FontAwesomeIcon
              icon={faStar}
              color={rate >= 1 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={rate >= 2 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={rate >= 3 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={rate >= 4 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={rate >= 5 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
              {/* {rate?.toFixed(1)} */}
              {rate === 0 ? rate : rate?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
        <span className="font-bold text-[24px] capitalize">
          {userDetails?.market ? (
            <>{userDetails?.item?.userId?.name || userDetails?.item?.name}</>
          ) : (
            <>{UserData?.name}</>
          )}
        </span>
      </div>
      <>
        <div className="inner-content-part-medium flex flex-col mx-auto w-full service-rates-user-profile">
          <h1 className="text-[32px] text-[#02227E] font-bold text-center font-roboto-serif py-2">
            Services and Rates
          </h1>

          <div className="flex flex-row border-b-2 border-gray-700 justify-evenly mt-4 cursor-pointer">
            <div
              style={{
                backgroundColor: !handelChangeTab
                  ? "rgba(55,96,203,0.2)"
                  : "rgba(0,0,0,0)",
              }}
              className="w-1/2 px-4 rounded-t-lg"
              onClick={() => setHandelChangeTab(false)}
            >
              <span className="text-2xl font-bold text-[#01195C]">
                Services
              </span>
            </div>
            <div
              style={{
                backgroundColor: handelChangeTab
                  ? "rgba(55,96,203,0.2)"
                  : "rgba(0,0,0,0)",
              }}
              className="w-1/2 px-4 rounded-t-lg"
              onClick={() => setHandelChangeTab(true)}
            >
              <span className="text-2xl font-bold text-[#01195C]">Rates</span>
            </div>
          </div>

          {handelChangeTab ? (
            <div className="rates-tab">
              <div className="grid items-center grid-cols-4 py-4">
                <span className="font-bold text-[#0247FF]">Time</span>
                <span className="font-bold text-[#0247FF]">Incall</span>
                <span className="font-bold text-[#0247FF]">Outcall</span>
                <span className="font-bold text-[#0247FF]">Currency</span>
              </div>

              {updatedServices[0]?.hourlyRates?.map((item) => (
                <div
                  key={item._id}
                  className="grid items-center grid-cols-4 m-4 my-8 mx-2"
                >
                  <div className="flex flex-row p-1 w-full min-w-[105px] max-w-[130px] mx-auto rounded-full justify-center items-center bg-gradient-to-b from-[#02227E] to-[#0247FF]">
                    <p className="px-1 font-bold text-white whitespace-nowrap">
                      {hourLabels[item.time]}
                    </p>
                  </div>
                  <span className="px-2 font-bold text-black">
                    {item.incall}
                  </span>
                  <span className="px-2 font-bold text-black">
                    {item.outcall}
                  </span>
                  <span className="px-2 font-bold text-[#02227E]">
                    {item?.currency}
                  </span>
                </div>
              ))}
            </div>
          ) : updatedServices[0]?.services?.length > 0 ? (
            <div className="services-tab py-5">
              {groupedServices?.Included?.length > 0 && (
                <div>
                  <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] text-white p-1 tracking-widest">
                    <h1 className="text-3xl font-black">Included</h1>
                  </div>
                  <div className="grid min-[400px]:grid-cols-2 grid-cols-1 gap-4 py-4">
                    {groupedServices?.Included?.map(({ servicesName }) => (
                      <div
                        key={servicesName}
                        className="sm:w-[100%] max-w-[440px] bg-[#3760CB]  py-[12px] rounded-[20px] border border-gray-100 h-[auto] text-white font-roboto "
                      >
                        <p className="text-lg font-medium">{servicesName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {groupedServices?.Extra.length > 0 && (
                <div className="py-10">
                  <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] text-white p-1 tracking-widest">
                    <h1 className="text-3xl font-black">Extra</h1>
                  </div>
                  <div className="grid min-[400px]:grid-cols-2 grid-cols-1 gap-4 py-4">
                    {groupedServices?.Extra?.map(
                      ({ servicesName, service, amount, currency }) => (
                        <div
                          key={servicesName}
                          className="sm:w-[100%] max-w-[440px] bg-[#3760CB]  py-[12px] rounded-[20px] border border-gray-100 h-[auto] text-white font-roboto "
                        >
                          <p className="text-xl font-semibold">
                            {servicesName}
                          </p>
                          <p className="text-base">
                            Amount:{" "}
                            {Number(amount) === 0
                              ? service
                              : `${amount} ${currency}`}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>No Services</p>
          )}
        </div>
      </>
    </div>
  );
};

export default ServiceRates;
