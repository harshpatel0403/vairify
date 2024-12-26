import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ProfilePermissionsServices from "../../../services/ProfilePermissionsServices";
import { HandleUpdateUser } from "../../../redux/action/Auth";

const ProfilePermissions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState(false);
  const [selectedGalleryAccess, setSelectedGalleryAccess] = useState(false);
  const [selectedRates, setSelectedRates] = useState(false);

  const fetchProfilePermissions = async () => {
    setLoading(true);
    if (UserDetails?._id) {
      setSelectedServices(UserDetails?.allowUserToAccessServices);
      setSelectedGalleryAccess(UserDetails?.allowUserToAccessGallery);
      setSelectedRates(UserDetails?.allowUserCanRates);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleServicesAccess = async () => {
    try {
      await ProfilePermissionsServices.updateProfilePermissions(
        UserDetails?._id,
        {
          allowUserToAccessServices: !selectedServices,
        }
      );
      setSelectedServices(!selectedServices);
      await dispatch(HandleUpdateUser(UserDetails?._id));

      toast.success("Sucessfully update permissions!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to allow services access!");
    }
  };

  const handleGalleryAccess = async () => {
    try {
      await ProfilePermissionsServices.updateProfilePermissions(
        UserDetails?._id,
        {
          allowUserToAccessGallery: !selectedGalleryAccess,
        }
      );
      setSelectedGalleryAccess(!selectedGalleryAccess);
      await dispatch(HandleUpdateUser(UserDetails?._id));

      toast.success("Sucessfully update permissions!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to allow gallery access!");
    }
  };

  const handleRatesAccess = async () => {
    try {
      await ProfilePermissionsServices.updateProfilePermissions(
        UserDetails?._id,
        {
          allowUserCanRates: !selectedRates,
        }
      );
      setSelectedRates(!selectedRates);
      await dispatch(HandleUpdateUser(UserDetails?._id));

      toast.success("Sucessfully update permissions!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to allow gallery access!");
    }
  };

  useEffect(() => {
    fetchProfilePermissions();
  }, []);

  if (loading) {
    return (
      <div className="main-container h-full">
        <div className="h-full flex justify-center items-center">
          <p className="text-[22px] font-bold mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container h-full rounded-2xl ">
      <div className="w-full mx-auto flex flex-row justify-between items-start relative social-heading pt-[20px]">
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
              {UserDetails?.vaiID ? (
                <>{UserDetails?.vaiID}</>
              ) : (
                <>{UserDetails?.vaiID}</>
              )}
            </span>
          </div>
        </div>

        <div className="w-[120px] relative">
          <div
            style={{ left: "-5px", bottom: "65px" }}
            className="absolute w-full h-full rounded-full"
          >
            {/* <img
              className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
              src={"/images/male.png"}
              alt="Hot Rod"
            /> */}
            {UserDetails?.profilePic ? (
              <img
              src={
                import.meta.env.VITE_APP_S3_IMAGE +
                `/${UserDetails.profilePic}`
              }
                // src={
                //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //   `/${UserDetails.profilePic}`
                // }
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                alt="Hot Rod"
              />
            ) : (
              <img
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                src={
                  UserDetails.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                alt="Hot Rod"
              />
            )}
          </div>

          <div
            style={{ right: "22px", top: "1rem", zIndex: 51 }}
            className="absolute"
          >
            {UserDetails.user_type === "client-hobbyist" ? (
              <img
                src={import.meta.env.BASE_URL + "images/HotRodIcon2.png"}
                alt="Sugar Icon"
              />
            ) : null}
            {UserDetails.user_type === "companion-provider" ? (
              <img
                src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                alt="Intimate Message Icon"
              />
            ) : null}
            {UserDetails.user_type === "agency-business" ||
            UserDetails.user_type === "super" ? (
              <img
                src={
                  import.meta.env.BASE_URL + "images/IntimateMassageIcon2.png"
                }
                alt="Hod Rod Icon"
              />
            ) : null}
          </div>
        </div>

        <div className="leading-[18px]">
          <div>
            <span className="text-[18px] text-[#040C50] font-bold font-Roboto-Serif">
              TruRevu
            </span>
          </div>
          <div className="flex justify-center items-center">
            <FontAwesomeIcon
              icon={faStar}
              color={UserDetails.averageRating >= 1 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={UserDetails.averageRating >= 2 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={UserDetails.averageRating >= 3 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={UserDetails.averageRating >= 4 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={UserDetails.averageRating >= 5 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
              {UserDetails.averageRating === 0
                ? UserDetails.averageRating
                : UserDetails.averageRating?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="text-[24px] font-extrabold capitalize">
        {UserDetails.name}
      </div>

      <div className="mx-5">
        <div className="text-[22px] font-bold text-left mt-8 mb-5">
          Profile Permissions
        </div>
        <div className="flex flex-row justify-between items-center social-border fav-follow">
          <div className="text-[18px] opacity-70 font-semibold text-left  mt-[2px] mb-[12px] sub-title-class">
            Allow users to access services
          </div>
          <div className="switch-container mb-[10px]">
            <input
              type="checkbox"
              id="yesCheckbox1"
              checked={selectedServices}
              onChange={handleServicesAccess}
              className="hidden"
            />
            <label
              htmlFor="yesCheckbox1"
              className={`border-[#4CAF50] switch-button ${
                selectedServices ? "active" : "text-black"
              }`}
            >
              Yes
            </label>
            <label
              htmlFor="yesCheckbox1"
              className={`border-[#4CAF50] switch-button ${
                !selectedServices ? "active" : "text-black"
              }`}
            >
              No
            </label>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center social-border fav-follow">
          <div className="text-[18px] opacity-70 font-semibold text-left mt-[2px] mb-[12px] sub-title-class">
            Allow users to access gallery
          </div>
          <div className="switch-container mb-[10px]">
            <input
              type="checkbox"
              id="yesCheckbox2"
              checked={selectedGalleryAccess}
              onChange={handleGalleryAccess}
              className="hidden"
            />
            <label
              htmlFor="yesCheckbox2"
              className={`border-[#4CAF50] switch-button ${
                selectedGalleryAccess ? "active" : "text-black"
              }`}
            >
              Yes
            </label>
            <label
              htmlFor="yesCheckbox2"
              className={`border-[#4CAF50] switch-button ${
                !selectedGalleryAccess ? "active" : "text-black"
              }`}
            >
              No
            </label>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center social-border fav-follow">
          <div className="text-[18px] opacity-70 font-semibold text-left mt-[2px] mb-[12px] sub-title-class">
            Allow users can TruRevu
          </div>
          <div className="switch-container mb-[10px]">
            <input
              type="checkbox"
              id="yesCheckbox3"
              checked={selectedRates}
              onChange={handleRatesAccess}
              className="hidden"
            />
            <label
              htmlFor="yesCheckbox3"
              className={`border-[#4CAF50] switch-button ${
                selectedRates ? "active" : "text-black"
              }`}
            >
              Yes
            </label>
            <label
              htmlFor="yesCheckbox3"
              className={`border-[#4CAF50] switch-button ${
                !selectedRates ? "active" : "text-black"
              }`}
            >
              No
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePermissions;
