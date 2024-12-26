import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarBorder } from "@fortawesome/free-regular-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VaridateService from "../../services/VaridateServices";
import { toast } from "react-toastify";
import { HandleUpdateFollowers } from "../../redux/action/Auth";
import MyVairifyService from "../../services/MyVairifyService";

export default function HotRodAnalysis() {
  const [Puncutalityrating, setPuncutalityRating] = useState(0);
  const [Etequetterating, setEtequetteRating] = useState(0);
  const [Attituderating, setAttitudeRating] = useState(0);
  const [incallAtmos, setIncallAtmos] = useState(0);
  const [service, setService] = useState(0);
  const [appearence, setAppearence] = useState(0);
  const [communication, setCommunication] = useState(0);

  const [paid, setPaid] = useState(true);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const appointment = location.state;

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const userType = UserDetails?.user_type; //'companion-provider'

  const PuncutalityhandleStarClick = (Puncutalityrating) => {
    setPuncutalityRating(Puncutalityrating);
  };
  const EtequettehandleStarClick = (Etequetterating) => {
    setEtequetteRating(Etequetterating);
  };
  const AttitudehandleStarClick = (Attituderating) => {
    setAttitudeRating(Attituderating);
  };

  let overallRating =
    userType === "client-hobbyist"
      ? (Puncutalityrating +
          incallAtmos +
          Attituderating +
          service +
          appearence +
          communication) /
        6
      : (Puncutalityrating + Etequetterating + Attituderating) / 3;
  const handleSubmit = async () => {
    if (!Puncutalityrating || !Attituderating || !message) {
      return toast.error("Some required inputs are missing.");
    }

    try {
      setLoading(true);
      await VaridateService.postReview(
        appointment?.[
          userType === "client-hobbyist" ? "companionId" : "clientId"
        ]?._id,
        appointment?._id,
        UserDetails?._id,
        {
          rating: overallRating,
          message,
          puncutality: Puncutalityrating,
          attitude: Attituderating,
          paid,
          ...(userType === "client-hobbyist"
            ? { incallAtmos, service, appearence, communication }
            : { etequette: Etequetterating }),
        }
      );
      navigate("/marketplace");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const [followLoading, setFollowLoading] = useState(false);

  const isFollowed = useCallback(
    (id) => {
      let result = UserDetails?.followers?.find((item) => item?.userId === id);
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    [UserDetails]
  );

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if (
        isFollowed(
          userType === "client-hobbyist"
            ? appointment?.["companionId"]?._id
            : appointment?.["clientId"]?._id
        )
      ) {
        await MyVairifyService.removeFollow(
          userType === "client-hobbyist"
            ? appointment?.["companionId"]?._id
            : appointment?.["clientId"]?._id,
          { userId: UserDetails?._id }
        );
        dispatch(HandleUpdateFollowers(UserDetails?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(
          userType === "client-hobbyist"
            ? appointment?.["companionId"]?._id
            : appointment?.["clientId"]?._id,
          { userId: UserDetails?._id }
        );
        await dispatch(HandleUpdateFollowers(UserDetails?._id));
        toast.success("Successfully followed!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to follow!");
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="main-container " style={{ height: "calc(100vh - 167px)" }}>
      <div className="w-full mx-auto flex flex-col items-center h-full">
        <div className="w-full mx-auto flex flex-row justify-between items-start">
          <div className="flex flex-col items-center justify-center leading-[18px]">
            <div>
              <span className="text-[18px] text-[#040C50] font-extrabold font-Roboto-Serif">
                VAI
                <span className="text-[18px] text-[#040C50] font-semibold font-Roboto-Serif">
                  RIFY ID
                </span>
              </span>
            </div>
            <div>
              <span className="text-[15px] text-[#040C50] font-bold uppercase">
                {
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.vaiID
                }
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "0px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
            >
              <img
                src={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.profilePic
                    ?
                    import.meta.env.VITE_APP_S3_IMAGE +
                    `/${
                      appointment?.[
                        userType === "client-hobbyist"
                          ? "companionId"
                          : "clientId"
                      ]?.profilePic
                    }`
                    //  import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                    //   `/${
                    //     appointment?.[
                    //       userType === "client-hobbyist"
                    //         ? "companionId"
                    //         : "clientId"
                    //     ]?.profilePic
                    //   }`
                    : appointment?.[
                        userType === "client-hobbyist"
                          ? "companionId"
                          : "clientId"
                      ]?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                alt="Hot Rod"
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white object-cover"
              />
            </div>
            <div
              style={{ right: "0px", top: "25px" }}
              className="absolute"
              onClick={() => {
                followLoading ? null : handleFollow();
              }}
            >
              {followLoading ? (
                <div
                  className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                ></div>
              ) : (
                <img
                  src={"/images/SugarIcon2.png"}
                  alt="Sugar Icon Second"
                  className={`${
                    isFollowed(
                      userType === "client-hobbyist"
                        ? appointment?.["companionId"]?._id
                        : appointment?.["clientId"]?._id
                    )
                      ? ""
                      : "grayscale"
                  }`}
                />
              )}
            </div>
          </div>
          <div className="leading-[18px]">
            <div>
              <span className="text-[18px] text-[#040C50] font-bold font-Roboto-Serif">
                TruRevu
              </span>
            </div>
            <div className="flex flex-row justify-center items-center">
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 1
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 2
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 3
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 4
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 5
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
                {(
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating || 0
                ).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-4">
          <span className="font-bold text-[18px]">
            {
              appointment?.[
                userType === "client-hobbyist" ? "companionId" : "clientId"
              ]?.name
            }
          </span>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center">
          <div>
            <span className="text-[28px] text-[#040C50] font-bold">
              TruRevu
            </span>
          </div>
        </div>
        <div className="inner-content-part-xlarge_ w-full flex flex-col flex-auto">
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div>
              <span className="font-bold text-[14.4px] text-[#0247FF]">
                Reviewer
              </span>
            </div>
            <div>
              <span className="font-bold text-[14.4px] text-[#0247FF]">
                Classification
              </span>
            </div>
            <div>
              <span className="font-extrabold text-[14.4px] text-[#0247FF] uppercase">
                VAI<span className="logoSetupweight">RIFY ID</span>
              </span>
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row justify-between items-center ">
            <div>
              <span className="font-extrabold text-[18px] text-[#0247FF]">
                {UserDetails?.name}
              </span>
            </div>
            <div>
              <span className="font-extrabold text-[18px] text-[#0247FF]">
                {userType}
              </span>
            </div>
            <div>
              <span className="font-extrabold text-[18px] text-[#0247FF]">
                {UserDetails?.vaiID}
              </span>
            </div>
          </div>
          <div
            className={`${
              userType === "client-hobbyist" ? "gap-1" : "gap-2"
            } flex flex-col py-2 overflow-y-auto flex-auto`}
          >
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">Puncutality</span>
              </div>
              <div>
                {Array.from({ length: 5 }).map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={index < Puncutalityrating ? faStar : faStarBorder}
                    style={{
                      textShadow:
                        "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                    }}
                    color={index < Puncutalityrating ? "#E1AB3F" : "#444"}
                    className={`text-[18px] margin-right-5 ${
                      index === 0 ? "border-red-500" : ""
                    }`}
                    onClick={() => PuncutalityhandleStarClick(index + 1)}
                  />
                ))}
              </div>
            </div>
            {userType === "client-hobbyist" ? (
              <div className="w-full mx-auto flex flex-row justify-between items-center">
                <div>
                  <span className="font-bold text-[14.4px]">
                    Incall Atmosphere
                  </span>
                </div>
                <div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={index < incallAtmos ? faStar : faStarBorder}
                      style={{
                        textShadow:
                          "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                      }}
                      color={index < incallAtmos ? "#E1AB3F" : "#444"}
                      className={`text-[18px] margin-right-5 ${
                        index === 0 ? "border-red-500" : ""
                      }`}
                      onClick={() => setIncallAtmos(index + 1)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full mx-auto flex flex-row justify-between items-center">
                <div>
                  <span className="font-bold text-[14.4px]">Etequette</span>
                </div>
                <div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={index < Etequetterating ? faStar : faStarBorder}
                      style={{
                        textShadow:
                          "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                      }}
                      color={index < Etequetterating ? "#E1AB3F" : "#444"}
                      className={`text-[18px] margin-right-5 ${
                        index === 0 ? "border-red-500" : ""
                      }`}
                      onClick={() => EtequettehandleStarClick(index + 1)}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">Attitude</span>
              </div>
              <div>
                {Array.from({ length: 5 }).map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={index < Attituderating ? faStar : faStarBorder}
                    style={{
                      textShadow:
                        "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                    }}
                    color={index < Attituderating ? "#E1AB3F" : "#444"}
                    className={`text-[18px] margin-right-5 ${
                      index === 0 ? "border-red-500" : ""
                    }`}
                    onClick={() => AttitudehandleStarClick(index + 1)}
                  />
                ))}
              </div>
            </div>
            {userType === "client-hobbyist" ? (
              <>
                <div className="w-full mx-auto flex flex-row justify-between items-center">
                  <div>
                    <span className="font-bold text-[14.4px]">Service</span>
                  </div>
                  <div>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FontAwesomeIcon
                        key={index}
                        icon={index < service ? faStar : faStarBorder}
                        style={{
                          textShadow:
                            "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                        }}
                        color={index < service ? "#E1AB3F" : "#444"}
                        className={`text-[18px] margin-right-5 ${
                          index === 0 ? "border-red-500" : ""
                        }`}
                        onClick={() => setService(index + 1)}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full mx-auto flex flex-row justify-between items-center">
                  <div>
                    <span className="font-bold text-[14.4px]">Appearence</span>
                  </div>
                  <div>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FontAwesomeIcon
                        key={index}
                        icon={index < appearence ? faStar : faStarBorder}
                        style={{
                          textShadow:
                            "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                        }}
                        color={index < appearence ? "#E1AB3F" : "#444"}
                        className={`text-[18px] margin-right-5 ${
                          index === 0 ? "border-red-500" : ""
                        }`}
                        onClick={() => setAppearence(index + 1)}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full mx-auto flex flex-row justify-between items-center">
                  <div>
                    <span className="font-bold text-[14.4px]">
                      Communication
                    </span>
                  </div>
                  <div>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FontAwesomeIcon
                        key={index}
                        icon={index < communication ? faStar : faStarBorder}
                        style={{
                          textShadow:
                            "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                        }}
                        color={index < communication ? "#E1AB3F" : "#444"}
                        className={`text-[18px] margin-right-5 ${
                          index === 0 ? "border-red-500" : ""
                        }`}
                        onClick={() => setCommunication(index + 1)}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full mx-auto flex flex-row justify-between items-center">
                  <p className="text-start">
                    <span className="font-bold text-[14.4px]">
                      Advertising Photos Match verified photos
                    </span>
                  </p>
                  <div className="flex flex-row justify-center items-center">
                    <div className="flex items-center mr-7">
                      <input
                        onChange={(e) => setPaid(true)}
                        checked={paid}
                        id="default-radio-1"
                        type="radio"
                        value={true}
                        name="default-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="default-radio-1"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        onChange={(e) => setPaid(false)}
                        checked={!paid}
                        id="default-radio-2"
                        type="radio"
                        value={false}
                        name="default-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="default-radio-2"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full mx-auto flex flex-row justify-between items-center">
                <div>
                  <span className="font-bold text-[14.4px]">
                    Paid as agreed
                  </span>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <div className="flex items-center mr-7">
                    <input
                      onChange={(e) => setPaid(true)}
                      checked={paid}
                      id="default-radio-1"
                      type="radio"
                      value={true}
                      name="default-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-radio-1"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      onChange={(e) => setPaid(false)}
                      checked={!paid}
                      id="default-radio-2"
                      type="radio"
                      value={false}
                      name="default-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-radio-2"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      No
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">Overall</span>
              </div>
              <div>
                <span className="font-bold text-[14.4px]">
                  {overallRating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-col justify-center items-center">
              <div className="w-full mx-auto flex flex-row justify-start items-center">
                <span className="font-bold text-[14.4px]">
                  {userType === "client-hobbyist"
                    ? "Details"
                    : "Companion Notes"}
                </span>
              </div>
              <div className="w-full mx-auto flex flex-row justify-center items-center">
                <textarea
                  rows="2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block_ p-2.5 w-full text-[15px] text-gray-900 rounded-md border-0 focus:ring-blue-500 dark:placeholder-gray-400  bg-[#E2E2E2] focus-visible:border-0 "
                  placeholder=""
                ></textarea>
              </div>
            </div>
            <div className="w-full text-center py-2">
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="w-full px-7 rounded-[10px] bg-gradient-to-t from-lime-500 to-emerald-500 border-2 border-solid border-[#707076]"
              >
                <span className="font-bold text-[20px] text-[#060b44]">
                  {loading ? "Loading.." : "Submit"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
