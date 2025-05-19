import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import CarouselNextArrow from "../CarouselNextArrow";
import CarouselPrevArrow from "../CarouselPrevArrow";
import MyVairifyService from "../../services/MyVairifyService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Index";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HandleSearchWithVaiId } from "../../redux/action/MarketplaceSearch";


export default function Carousel2({ images, des, admin, vairipay }) {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [followerData, setFollowersData] = useState([]);
  const settings = {
    dots: false,
    infinite: followerData.length > 16,
    arrows: false,
    speed: 500,
    slidesToShow: 16,
    // slidesToShow: Math.min(6, followerData?.length),
    slidesToScroll: 1,
    cssEase: "linear",
    prevArrow: null,
    nextArrow: null,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 10,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 5,
        },
      },
    ],
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
      <div className="flex justify-center align-center items-center pt-[48px]">
        <Loading />
      </div>
    );
  }
  else {


    return (
      <div className="folllowers-carousel">
        {/* {!followerData?.length && (
        <div className="text-sm text-white font-medium text-center opacity-[0.8]">
        Followers not found!
        </div>
        )} */}
        <Slider {...settings}>
          {followerData?.length > 0 &&
            followerData?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="mx-auto rounded-full max-w-[63px]  border-white !flex !items-center flex-col  sm:mt-[48px] mt-[24px]"
                  onClick={() => {
                    if (item?.vaiID) {

                      dispatch(HandleSearchWithVaiId(item?.vaiID))
                        .then((res) => {
                          navigate("/user/profile", {
                            state: {
                              item: res?.payload?.result?.[0]?.profile,
                              market: true,
                              service_type: "escort",
                            },
                          })
                            .catch((error) => {
                              toast.error("Something went wrong!");
                              console.log(error);
                            })
                        })
                    }
                    else {
                      navigate("/user/profile", {
                        state: {
                          item: item,
                          market: true,
                          service_type: "escort",
                        },
                      })
                    }
                  }
                  }
                >
                  <img
                    src={
                      item?.profilePic !== ""
                        ? `${import.meta.env.VITE_APP_S3_IMAGE
                        }/${item?.profilePic}`
                        : item?.gender === "Male"
                          ? "/images/male.png"
                          : "/images/female.png"
                    }
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  {!!item.name && (
                    <div className="text-[10px] text-white font-normal flex justify-center items-center mt-[8px] text-center">
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
}
