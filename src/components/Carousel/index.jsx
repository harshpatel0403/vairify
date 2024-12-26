import React from "react";
import Slider from "react-slick";
import CarouselNextArrow from "../CarouselNextArrow";
import CarouselPrevArrow from "../CarouselPrevArrow";
import { useNavigate } from "react-router-dom";

export default function Carousel({
  images,
  des,
  userVaripaysData,
  admin,
  vairipay,
}) {
  // const row = []
  const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    slidesPerRow: 3,
    cssEase: "linear",
    touchMove: true,
    arrows: true,
    prevArrow: <CarouselPrevArrow />,
    nextArrow: <CarouselNextArrow />,
  };

  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    cssEase: "linear",
    prevArrow: <CarouselPrevArrow admin={admin} />,
    nextArrow: <CarouselNextArrow admin={admin} />,
  };

  return (
    <div className="w-11/12 py-6 mx-auto">
      {vairipay == "true" ? (
        <Slider {...settings2}>
          {images &&
            images?.map((image) => (
              <div key={image?._id} className="max-w-[90px] h-[90px]">
                <img
                  className="w-full h-full"
                  src={
                    import.meta.env.BASE_URL +
                    `images/varipays/${image?.paymentImage?.toLowerCase()}`
                  }
                  alt={image?.paymentImage}
                />
              </div>
            ))}
        </Slider>
      ) : (
        <Slider
          beforeChange={settings.beforeChange}
          touchMove={settings.touchMove}
          infinite={settings.infinite}
          arrows={settings.arrows}
          slidesPerRow={settings.slidesPerRow}
          nextArrow={settings.nextArrow}
          prevArrow={settings.prevArrow}
        >
          {userVaripaysData?.map((item) => (
            <div key={item?._id} className="max-w-[130px] h-[90px]">
              <div className="flex flex-col items-center justify-between mx-auto max-w-[90px] h-[90px] rounded-xl border-2 bg-[#3760CB] border-white vairipay-item px-2 py-2">
                <div className="w-[43px] h-[56px]">
                  <img
                    className="w-full h-full"
                    src={`/images/varipays/${item?.paymentImage?.toLowerCase()}`}
                    alt="Slide 1"
                  />
                </div>
              </div>
              <span className="text-white">{item?.paymentAppName}</span>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
