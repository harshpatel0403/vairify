import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserGalleryService from "../../services/UserGalleryService";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
const UserGallery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [gallery, setGallery] = useState([]);

  const getGallery = (userid) => {
    UserGalleryService.getUserGallery(`${userid}`)
      .then((res) => {
        console.log(res.images);
        setGallery(res.images);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (location.state?.userId ?? false) {
      getGallery(location.state.userId);
    }
  }, []);

  const handelImageClick = (e, item) => {
    e.preventDefault();
    navigate("/user/gallery-details", {
      state: {
        item,
        personId: location.state?.userId,
        user: location.state?.user,
      },
    });
  };

  return (
    <div
      className="main-container relative rounded-2xl"
      style={{ maxHeight: "calc(100vh - 149px)" }}
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
                {location.state?.user?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "-5px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
            >
              <img
                  src={
                    location.state?.user?.profilePic
                      ? import.meta.env.VITE_APP_S3_IMAGE +
                      `/${location.state?.user?.profilePic}`
                      : location.state?.user?.gender === "male"
                        ? "/images/male.png"
                        : "/images/female.png"
                  }
                // src={
                //   location.state?.user?.profilePic
                //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //     `/${location.state?.user?.profilePic}`
                //     : location.state?.user?.gender === "male"
                //       ? "/images/male.png"
                //       : "/images/female.png"
                // }
                alt="Profile"
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
              />
            </div>
            {location.state?.userId !== UserData?._id && (
              <div style={{ right: "0px", top: "25px" }} className="absolute">
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
                  length: location.state?.user?.averageRating || 0,
                },
                (_, index) => index
              )?.map((rating) => (
                <img
                  key={rating}
                  src="/images/Star.svg"
                  className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
                  alt=""
                />
              ))}
              {Array.from(
                {
                  length: 5 - Math.floor(location.state?.user?.averageRating),
                },
                (_, index) => index
              )?.map((rating) => (
                <img
                  key={rating}
                  src="/images/StarUnfilled.svg"
                  className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
                  alt=""
                />
              ))}
              {/* <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              /> */}
              <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
                {(location.state?.user?.averageRating || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
          <span className="font-bold text-[24px] capitalize">
            {location.state?.user?.name}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center ">
        <div className="mt-3 w-full "></div>
        <div className="w-full flex flex-col justify-center items-center ">
          <div className=" text-[27px] font-bold break-all">
            <span>Gallery</span>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center mt-3 items-center">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-0 max-h-[calc(100vh_-_274px)] overflow-scroll pb-[50px]">
            {gallery &&
              gallery?.map((image, index) => (
                <div
                  key={index}
                  className="gallery-data m-1"
                  onClick={(e) => handelImageClick(e, image)}
                >
                  <img
                    src={`${import.meta.env.VITE_APP_S3_IMAGE
                      }/${image?.image}`}
                    alt={`Image ${index}`}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGallery;
