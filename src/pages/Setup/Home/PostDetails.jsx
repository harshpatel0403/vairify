import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback } from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import BaseAPI from "../../../BaseAPI";
import { useDispatch, useSelector } from "react-redux";
import MyVairifyService from "../../../services/MyVairifyService";
import { toast } from "react-toastify";
import { HandleUpdateFollowers } from "../../../redux/action/Auth";
import { CardPlacehoderSkeleton } from "../../../components/CardPlacehoderSkeleton";


export default function PostDetails(props) {
  const location = useLocation();
  const state = props?.state || location?.state
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const likedByUser = state?.likes?.includes(UserDetails?._id);

  return (
    <div>
      <div
        className="w-full mt-[30px]"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center flex-1 gap-[8px] mb-1">

            <img
              src={
                state?.userId?.profilePic
                  ? `${import.meta.env.VITE_APP_S3_IMAGE
                  }/${state?.userId?.profilePic}`
                  : state?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
              }
              alt="User"
              className='h-[40px] w-[40px] rounded-full object-cover'
            />
            <div>
              <h2
                className="font-medium sm:text-[#212B36] text-white text-base"
              >
                {state?.userId?.name}
              </h2>
              <h2
                className="sm:text-[#919EAB] text-white font-regular text-sm"
              >
                ID# {state?.userId?.vaiID}
              </h2>

            </div>
          </div>
          <div className="flex gap-1 items-center">
            <p className="sm:text-[#212B36] text-white font-semibold text-base mt-[3px]">{(state?.userId?.averageRating || 0).toFixed(1)}</p>
            <img
              src="/images/home/star.svg"
              className="h-[20px] w-[20px]"
            />
          </div>

        </div>
        <div
          className="sm:text-[#919EAB] text-white text-sm font-normal mt-[5px]"
        >
          {state?.message === 'undefined' ? '' : state?.message}
        </div>
        <div
          className="h-[200px]  mx-auto mt-[8px]"
        >
          <CardPlacehoderSkeleton
            imageUrl={`${import.meta.env.VITE_APP_S3_IMAGE}/${state?.image
              }`}
            imageClassNames='h-full w-full object-cover rounded-[8px]'
          />
        </div>
        <div className="flex items-center mb-1 mt-[8px] gap-[10px]">
          <div
            className="flex items-center gap-[6px]"
          >
            {likedByUser ? <img src="/images/home/like.svg" alt={likedByUser ? "Liked" : "Like"}
            /> : <img src="/images/home/like_black_outline.svg" className="" alt={likedByUser ? "Liked" : "Like"}
            />}
            <span
              className=" sm:text-[#212B36] text-white font-medium text-base"
            >
              {state?.likes?.length}
            </span>
          </div>
          <div
            className="flex items-center gap-[6px]"
          >

            <img src="/images/home/comment.svg" className="invert" />
            <span
              className=" sm:text-[#212B36] text-white font-medium font-roboto text-base"
            >
              {state?.comments?.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
