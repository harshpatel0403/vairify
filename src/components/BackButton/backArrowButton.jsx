import { useLocation, useNavigate } from "react-router-dom";

export default function BackButton({ className = "" }) {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    const goBack = () => {
        // if (path.startsWith("/dateguard/password-input")) {
        //     return navigate("/dateguard/codes", { state: location.state });
        // }
        // if (path.startsWith("/dateguard/codes")) {
        //     return navigate("/dateguard-setup", { state: location.state });
        // }
        // if (path.startsWith("/dateguard/select-group")) {
        //     return navigate("/dateguard-setup", { state: location.state });
        // }
        // if (path.startsWith("/dateguard/set-time-alarm")) {
        //     return navigate("/dateguard-setup", { state: location.state });
        // }
        // if (path.startsWith("/dateguard/edit-group")) {
        //     return navigate("/dateguard/select-group", { state: location.state });
        // }
        // if (path.startsWith("/dateguard/select-appointment")) {
        //     return navigate("/dateguard-setup", { state: location.state });
        // }
        // if (path.startsWith("/marketplace/post/review")) {
        //     return navigate("/my-calendar", { state: location?.state });
        // }

        navigate(-1, { state: location.state });
    };

    if (path === "/login") return null;

    return (
        <div>
            <button onClick={goBack} className={`bg-[#FFFFFF14] sm:w-[40px] sm:h-[40px] w-[30px] h-[30px] rounded-full flex items-center justify-center border-none ${className}`}>
                <img src="/images/signup/left-arrow.svg" className="w-[12px] sm:w-auto" alt="logo" />
            </button>
        </div>
    );
}

