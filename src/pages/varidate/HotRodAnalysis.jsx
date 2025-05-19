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
import Loading from "../../components/Loading/Index";

export default function HotRodAnalysis(props) {
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

  const appointment = props?.state || location.state;

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
    <div className="max-h-[600px]">
      <h3 className="text-[#212B36] text-center font-semibold text-[20px] pb-[24px]">Post Review</h3>
      <div className="flex items-center justify-center mb-[24px] relative w-fit mx-auto">
        <img
          src={
            appointment?.[
              userType === "client-hobbyist" ? "companionId" : "clientId"
            ]?.profilePic
              ?
              import.meta.env.VITE_APP_S3_IMAGE +
              `/${appointment?.[
                userType === "client-hobbyist"
                  ? "companionId"
                  : "clientId"
              ]?.profilePic
              }`
              : appointment?.[
                userType === "client-hobbyist"
                  ? "companionId"
                  : "clientId"
              ]?.gender === "Male"
                ? "/images/male.png"
                : "/images/female.png"
          }
          alt="Hot Rod"
          className="w-[100px] h-[100px] rounded-full overflow-hidden object-cover"
        />
        <div className=" absolute bottom-0 right-0 cursor-pointer" onClick={() => {
          followLoading ? null : handleFollow();
        }}>
          {followLoading ? (
            <div
              className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            ></div>
          ) : (
            <img
              src={"/images/home/profile-plus.svg"}
              alt="Sugar Icon Second"
              className={`${isFollowed(
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

      <div className="flex items-center justify-around gap-2 mb-[24px]">
        <div>
          <h4 className="text-[14px] text-[#212B36] font-normal text-center">
            VAIRIFY ID
          </h4>
          <h4 className="text-[16px] text-[#212B36] font-bold uppercase text-center">
            {
              appointment?.[
                userType === "client-hobbyist" ? "companionId" : "clientId"
              ]?.vaiID
            }
          </h4>
        </div>
        <div>
          <h3 className="text-[14px] text-[#212B36] font-normal text-center">
            Name
          </h3>
          <h4 className="text-[16px] text-[#212B36] font-bold text-center">
            {
              appointment?.[
                userType === "client-hobbyist" ? "companionId" : "clientId"
              ]?.name
            }
          </h4>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-[14px] text-[#212B36] font-normal text-center">
            TruRevu
          </h3>
          <h4 className="flex items-center gap-1 text-[14px] text-[#212B36] font-semibold text-center">  {appointment?.[
            userType === "client-hobbyist" ? "companionId" : "clientId"
          ]?.averageRating} <img src="/images/home/star.svg" alt="icon" /></h4>
        </div>
      </div>
      <div className="bg-[#212B3614] rounded-2xl p-[16px] w-full mb-[24px]">
        <div className="flex justify-between items-center gap-2 w-full mb-[8px]">
          <h4 className="text-[14px] text-[#212B36] font-normal">
            Reviewer
          </h4>
          <h4 className="text-[14px] text-[#212B36] font-semibold">
            {UserDetails?.name}
          </h4>
        </div>
        <div className="flex justify-between items-center gap-2 w-full mb-[8px]">
          <h4 className="text-[14px] text-[#212B36] font-normal">
            Classification
          </h4>
          <h4 className="text-[14px] text-[#212B36] font-semibold">
            {userType}
          </h4>
        </div>

        <div className="flex justify-between items-center gap-2 w-full">
          <h4 className="text-[14px] text-[#212B36] font-normal">
            VAIRIFY ID
          </h4>
          <h4 className="text-[14px] text-[#212B36] font-semibold">
            {UserDetails?.vaiID}
          </h4>
        </div>
      </div>


      <div className="inner-content-part-xlarge_ w-full flex flex-col flex-auto">
        <div
          className={`${userType === "client-hobbyist" ? "gap-[16px]" : "gap-[16px]"
            } flex flex-col py-2 overflow-y-auto flex-auto`}
        >
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div>
              <span className="font-semibold text-[#212B36] text-[16px]">Puncutality</span>
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
                  className={`text-[18px] margin-right-5 ${index === 0 ? "border-red-500" : ""
                    }`}
                  onClick={() => PuncutalityhandleStarClick(index + 1)}
                />
              ))}
            </div>
          </div>
          {userType === "client-hobbyist" ? (
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-semibold text-[#212B36] text-[16px]">
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
                    className={`text-[18px] margin-right-5 ${index === 0 ? "border-red-500" : ""
                      }`}
                    onClick={() => setIncallAtmos(index + 1)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-semibold text-[#212B36] text-[16px]">Etequette</span>
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
                    className={`text-[18px] margin-right-5 ${index === 0 ? "border-red-500" : ""
                      }`}
                    onClick={() => EtequettehandleStarClick(index + 1)}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div>
              <span className="font-semibold text-[#212B36] text-[16px]">Attitude</span>
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
                  className={`text-[18px] margin-right-5 ${index === 0 ? "border-red-500" : ""
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
                  <span className="font-semibold text-[#212B36] text-[16px]">Service</span>
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
                      className={`text-[18px] margin-right-5 ${index === 0 ? "border-red-500" : ""
                        }`}
                      onClick={() => setService(index + 1)}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full mx-auto flex flex-row justify-between items-center">
                <div>
                  <span className="font-semibold text-[#212B36] text-[16px]">Appearence</span>
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
                      className={`text-[18px] margin-right-5 ${index === 0 ? "border-red-500" : ""
                        }`}
                      onClick={() => setAppearence(index + 1)}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full mx-auto flex flex-row justify-between items-center">
                <div>
                  <span className="font-semibold text-[#212B36] text-[16px]">
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
                      className={`text-[18px] margin-right-5 ${index === 0 ? "border-red-500" : ""
                        }`}
                      onClick={() => setCommunication(index + 1)}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full mx-auto flex flex-row justify-between items-center">
                <p className="text-start">
                  <span className="font-semibold text-[#212B36] text-[16px]">
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
                      className="w-4 h-4 accent-[#212B36] text-blue-600 focus:outline-none focus:ring-0 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-radio-1"
                      className="ml-2 text-sm font-medium !text-[#212B36]"
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
                      className="w-4 h-4 accent-[#212B36] text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-radio-2"
                      className="ml-2 text-sm font-medium !text-[#212B36]"
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
                <span className="font-semibold text-[#212B36] text-[16px]">
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
                    className="w-4 h-4 accent-[#212B36] text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ml-2 text-sm font-medium !text-[#212B36]"
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
                    className="w-4 h-4 accent-[#212B36] text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-radio-2"
                    className="ml-2 text-sm font-medium !text-[#212B36]"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>
          )}
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div>
              <span className="font-semibold text-[#212B36] text-[16px]">Overall</span>
            </div>
            <div>
              <span className="font-semibold text-[#212B36] text-[16px]">
                {overallRating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center">
            <div className="w-full mx-auto flex flex-row justify-start items-center">
              <span className="font-semibold text-[#212B36] text-[16px] mb-2">
                {userType === "client-hobbyist"
                  ? "Details"
                  : "Companion Notes"}
              </span>
            </div>
            <div className="w-full mx-auto flex flex-row justify-center items-center">
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-3 w-full text-[16px] text-[#212B36] rounded-md border border-[#919EAB33] focus:ring-[#212B36] dark:placeholder-[#212B36] focus:border-[#212B36] bg-transparent "
                placeholder=""
              ></textarea>
            </div>
          </div>
          <div className="w-full text-center">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="secondary-btn p-[10px] w-full rounded-lg mb-7"
            >
              <span className="font-bold text-[20px] text-[#060b44]">
                {loading ? <Loading /> : "Submit"}
              </span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
