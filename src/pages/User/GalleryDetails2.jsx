import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isMobileDevice } from "detectrtc";
import ProfileTile from "../layout/ProfileTile";

const GalleryDetails2 = () => {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div
      className="main-container rounded-2xl flex flex-col p-0"
      style={{ height: "calc(100vh - 149px)" }}
    >
      <ProfileTile userDetails={state} currentUserDetails={UserDetails} />
      <div className="overflow-y-scroll py-5 flex-auto no-scrollbar">
        <div
          className={`bg-[#040C50]/[70%] w-full mx-auto ${
            isMobileDevice ? "" : "max-w-[425px]"
          }`}
        >
          <img
            src={`${import.meta.env.VITE_APP_S3_IMAGE}/${
              state?.item?.image
            }`}
            // src={`${import.meta.env.VITE_APP_API_USERGALLERY_IMAGE_URL}/${
            //   state?.item?.image
            // }`}
            alt={`Image `}
            className={`w-full mx-auto ${
              isMobileDevice ? "" : "max-w-[425px]"
            }`}
          />
          <div className="flex items-center justify-center py-3">
            <div
              className="flex items-center gap-1"
              onClick={() =>
                navigate("/user/gallerycomment", {
                  state,
                })
              }
            >
              <span className={"text-[14px] text-white font-bold font-roboto"}>
                {state?.item?.comments?.length}
              </span>
              <span className={"text-[14px] text-white font-bold font-roboto"}>
                {`Comment${state?.item?.comments?.length > 1 ? "s" : ""}`}
              </span>
              <img src="/images/Vector.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetails2;
