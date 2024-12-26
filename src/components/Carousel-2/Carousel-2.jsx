import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import CarouselNextArrow from "../CarouselNextArrow";
import CarouselPrevArrow from "../CarouselPrevArrow";
import MyVairifyService from "../../services/MyVairifyService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Carousel2({ images, des, admin, vairipay }) {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [followerData, setFollowersData] = useState([]);
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 6,
    slidesToShow: Math.min(6, followerData?.length),
    slidesToScroll: 1,
    cssEase: "linear",
    prevArrow: null,
    nextArrow: null,
  };

  const fetchMyFollowers = async () => {
    setLoading(true);
    try {
      const result = await MyVairifyService.getMyFollowers(UserDetails?._id);
      setLoading(false);
      setFollowersData(result);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFollowers();
  }, []);

  if (loading) {
    return (
      <div className="main-container h-full">
        <div className="h-full flex justify-center items-center">
          <p className="text-14px] text-[#02227E] font-bold mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-11/12 py-6">
      {!followerData?.length && (
        <div className="text-[14px] text-[#02227E] font-bold text-center  flex flex-col justify-center items-center">
          Followers not found!
        </div>
      )}
      <Slider {...settings}>
        {followerData &&
          followerData?.map((item, index) => {
            return (
              <div
                key={index}
                className="mx-auto rounded-full max-w-[63px]  border-white !flex !items-center flex-col"
                onClick={() =>
                  navigate("/user/profile", {
                    state: {
                      item: item,
                      market: true,
                      service_type: "escort",
                    },
                  })
                }
              >
                <img
                 src={
                  item?.profilePic !== ""
                    ? `${
                        import.meta.env.VITE_APP_S3_IMAGE
                      }/${item?.profilePic}`
                    : item?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                  // src={
                  //   item?.profilePic !== ""
                  //     ? `${
                  //         import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL
                  //       }/${item?.profilePic}`
                  //     : item?.gender === "Male"
                  //     ? "/images/male.png"
                  //     : "/images/female.png"
                  // }
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                {!!item.name && (
                  <div className="w-full text-[7px] w-[10px] font-roboto-serif block font-[900] flex justify-center items-center">
                    <span>{item?.name}</span>
                  </div>
                )}
              </div>
            );
          })}
      </Slider>
    </div>
  );
}
