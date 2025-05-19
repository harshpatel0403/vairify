import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserGalleryService from "../../services/UserGalleryService";
import { useEffect, useState } from "react";
import GalleryComment from "./GalleryComment";
const GalleryDetails = () => {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const navigate = useNavigate();
  let { state } = useLocation();
  const [filteredData, setFilteredData] = useState([]);

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  useEffect(() => {

    UserGalleryService.getUserGallery(UserData?._id)
      .then((res) => {
        const updatedData = res?.images?.filter((item) => item?.image === state?.item?.image);
        setFilteredData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])

  return (
    <>
      <div className="md:hidden block fixed top-0 sm:h-[80px] h-[70px] w-full bg-[#060C4D] z-50"></div>
      <div className="container">
        <div className=" w-full sm:flex hidden flex-row sm:justify-around justify-between items-end mt-[102px] sm:p-[16px] sm:bg-[#FFFFFF0A] rounded-[16px]">
          <div className="flex flex-col items-center justify-center sm:min-w-[120px] min-w-[80px]">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              VAIRIFY ID
            </div>
            <div className="font-bold sm:text-lg text-base text-white uppercase">
              {state?.user?.vaiID}
            </div>
          </div>
          <div className="relative">
            <div
              className="sm:h-[120px] h-[80px] sm:w-[120px] w-[80px] rounded-full mt-[-74px] relative flex justify-center"
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
                alt="Profile"
                className="sm:w-[100px] sm:h-[100px] w-[80px] h-[80px] rounded-[125px] border-2 border-white"
              />
              {state?.user?._id !== UserDetails?._id && (
                <div style={{ right: "0px", bottom: "0px" }} className="absolute">
                  <img src={"/images/profile-icon.png"} alt="Profile" />
                </div>
              )}
            </div>
            <div className="flex-col flex justify-center items-center mt-[24px]">
              <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                Name
              </div>
              <span className="font-bold sm:text-lg text-base text-white">
                {state?.user?.name}
              </span>
            </div>
          </div>
          <div className="leading-[18px] sm:min-w-[120px] min-w-[80px] flex flex-col justify-center items-center">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              TruRevu
            </div>
            <div className="flex justify-center items-center gap-1">
              <div className="sm:text-lg text-base text-white font-bold ">
                {state?.user?.averageRating}
              </div>
              <img src="/images/home/star.svg" alt="star" />
            </div>
          </div>
        </div>

        <div className="pt-[24px]">
          <div className="rounded-[15px] bg-[#040C50] max-w-[393px] aspect-square w-full mx-auto ">
            <img
              src={`${import.meta.env.VITE_APP_S3_IMAGE}/${state?.item?.image
                }`}
              alt={`Image `}
              className="rounded-[15px] max-w-[393px] object-cover w-full h-full mx-auto "
            />
          </div>
          <div className="flex items-center justify-center py-3">
            {/* <div
                className="flex items-center gap-1"
                // onClick={() =>
                //   navigate("/user/gallerycomment", {
                //     state: state,
                //   })
                // }
              >
                <span className={"text-[14px] text-white font-bold font-roboto"}>
                  {filteredData[0]?.comments?.length}
                </span>
                <span className={"text-[14px] text-white font-bold font-roboto"}>
                  {`Comment${state?.item?.comments?.length > 1 ? "s" : ""}`}
                </span>
                <img src="/images/home/comment.svg" />
              </div> */}
          </div>
        </div>
        <div className="text-white text-lg font-semibold">Comments</div>

        <div>
          <GalleryComment />
        </div>
      </div>
    </>
  );
};

export default GalleryDetails;
