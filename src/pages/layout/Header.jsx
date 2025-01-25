/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import IconButton from "../../components/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
import { HandleUser } from "../../redux/action/Auth";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../services/userServices";
export default function Header({ onClick, bgColor }) {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [tokens, setTokens] = useState(0);
  const goBack = () => {
    if (path.startsWith("/dateguard/password-input")) {
      return navigate("/dateguard/codes");
    }
    if (path.startsWith("/dateguard/codes")) {
      return navigate("/dateguard-setup");
    }
    if (path.startsWith("/dateguard/select-group")) {
      return navigate("/dateguard-setup");
    }
    if (path.startsWith("/dateguard/set-time-alarm")) {
      return navigate("/dateguard-setup");
    }
    if (path.startsWith("/dateguard/edit-group")) {
      return navigate("/dateguard/select-group");
    }
    if (path.startsWith("/dateguard/select-appointment")) {
      return navigate("/dateguard-setup");
    }
    if (path.startsWith('/marketplace/post/review')) {
      return navigate('/my-calendar', { state: location?.state })
    }

    navigate(-1, { state: location.state });
  };
  useEffect(() => {
    if (path.includes("/post") && UserDetails) {
      dispatch(HandleUser(UserDetails?._id));
    }
  }, []);

  useEffect(() => {
    if (UserDetails?._id) {
      getTokens()
    }
  }, [UserDetails?._id]);

  const getTokens = () => {
    UserService.getUserTokens(UserDetails?._id)
      .then((res) => {
        setTokens(res.tokens);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const pageWithHiddenLogo = [
    "/vairipay-request",
    "/service-business/add-staff",
  ];

  return (
    <div
      className={`header-part w-full flex flex-col justify-center items-start px-2 left-0 fixed  bg-[${bgColor}] z-50 ${path === "/profile-permissions" ? "header-part-profile-permission" : ""
        }`}
    >
      <div className="w-full mx-auto flex flex-row justify-between items-center mt-5">
        <div className="flex-1">
          {path != "/login" && (
            <IconButton
              onClick={() => goBack()}
              icon={<img src={"/images/leftVector.png"} alt="Left Icon" />}
            />
          )}
        </div>
        {pageWithHiddenLogo.includes(location.pathname)
          ? null
          : // logo will not visible on the screens having something similar path in url
          (!(
            (
              path.includes("vairify-schedule") ||
              path.includes("/user") ||
              path.includes("/varidate") ||
              path.includes("/date-guard") ||
              path.includes("/post") ||
              path === "/vai-now" ||
              path.includes("/marketplace/active/invitation") ||
              path === "/marketplace" ||
              path === "/vairipay-options" ||
              path.includes("/vai-now/accept") ||
              path === "/my-vairify-details" ||
              path === "/profile-permissions" ||
              path === "/settings/about-me" ||
              path.includes("/public/profile")
            )
            // add paths here if you want to hide the logo
          ) ||
            // logo will appear on screens having these urls
            path.includes("varidate/past-appointments") ||
            path === "/login" ||
            path === "/varidate/verification" ||
            path === "/settings" ||
            path === "/vairify-advance-search" ||
            path === "/varidate/appointment-review" ||
            path === "/varidate/face-verification" ||
            path === "/varidate/upcoming-appointments" ||
            path === "/varidate/invitations-list" ||
            path === "/varidate/verification-manual" ||
            path === "/user-payment-history" ||
            path.includes("/vairify-results")) && (
            // ADD paths here if you want to show the logo
            <div
              id="hiddenintirepag"
              className="flex flex-col justify-center items-center relative bottom-3"
            >
              <div>
                <img
                  src={"/images/varify_logo.svg"}
                  alt="Varify Logo"
                  className="mt-5"
                />
              </div>
            </div>
          )}
        {path.includes("/post") === true &&
          !path.includes("/varidate/post/review") && (
            <div className="flex bg-[#D5D6E0] mb-[-1px] items-center justify-center px-2 rounded-t-md flex-1 w-[100px] mt-[13px]">
              <div className="flex items-center">
                <img src="/images/tokens.png" />
                <span className="text-[26px] font-[700] pl-1">
                  {tokens}
                </span>
              </div>
            </div>
          )}
        <div className="flex-1 flex justify-end">
          <button onClick={onClick} className="p-4">
            <img src={"/images/burgerVector.png"} alt="Burger Vector Icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
