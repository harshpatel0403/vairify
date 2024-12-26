import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserGalleryService from "../../services/UserGalleryService";
import { useState } from "react";
const GalleryDetails = () => {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const navigate = useNavigate();
  let { state } = useLocation();
  const [filteredData, setFilteredData] = useState([]);

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  UserGalleryService.getUserGallery(UserData?._id)
    .then((res) => {
      const updatedData = res?.images?.filter((item) => item?.image === state?.item?.image);
      setFilteredData(updatedData);
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <div
      className="main-container rounded-2xl flex flex-col"
      style={{ height: "calc(100vh - 149px)" }}
    >
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-4">
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
                {state?.user?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "-10px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
            >
              <img
               src={
                state?.user?.profilePic
                  ? import.meta.env.VITE_APP_S3_IMAGE +
                  `/${state?.user?.profilePic}`
                  : state?.user?.gender === "male"
                    ? "/images/male.png"
                    : "/images/female.png"
              }
                // src={
                //   state?.user?.profilePic
                //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //     `/${state?.user?.profilePic}`
                //     : state?.user?.gender === "male"
                //       ? "/images/male.png"
                //       : "/images/female.png"
                // }
                alt="Profile"
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
              />
            </div>
            {state?.user?._id !== UserDetails?._id && (
              <div style={{ right: "15px", top: "25px" }} className="absolute">
                <img src={"/images/profile-icon.png"} alt="Profile" />
              </div>
            )}
          </div>
          <div className="leading-[18px]">
            <div>
              <span className="text-[18px] text-[#040C50] font-bold font-Roboto-Serif">
                TruRevu
              </span>
            </div>
            <div className="flex flex-row justify-center items-center">
              {Array.from(
                {
                  length: state?.user?.averageRating || 0,
                },
                (_, index) => index
              )?.map((rating) => (
                <img
                  key={rating}
                  src="/images/Star.svg"
                  className="drop-shadow-[1px_1px_0px_#111] mr-0.5 w-[10px] h-[10px]"
                  alt=""
                />
              ))}
              {Array.from(
                {
                  length: 5 - Math.floor(state?.user?.averageRating),
                },
                (_, index) => index
              )?.map((rating) => (
                <img
                  key={rating}
                  src="/images/StarUnfilled.svg"
                  className="drop-shadow-[1px_1px_0px_#111] mr-0.5 w-[10px] h-[10px]"
                  alt=""
                />
              ))}
              <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
                {(state?.user?.averageRating || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-5">
          <span className="font-bold text-[24px] capitalize">
            {state?.user?.name}
          </span>
        </div>
      </div>
      <div className="overflow-y-scroll py-5 flex-auto">
        <div className="rounded-[15px] bg-[#040C50]/[70%] max-w-[393px] w-full mx-auto ">
          <img
            src={`${import.meta.env.VITE_APP_S3_IMAGE}/${state?.item?.image
              }`}
            alt={`Image `}
            className="rounded-t-[15px] max-w-[393px] w-full mx-auto "
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
                {/* {state?.item?.comments?.length} */}
                {filteredData[0]?.comments?.length}
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

export default GalleryDetails;
