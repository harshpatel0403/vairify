import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PersonalComments from "../../../components/PersonalComments";
import { useLocation } from "react-router";
import InputText from "../../../components/InputText";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  HandleCommentsPost,
  HandleGetCommentsPost,
} from "../../../redux/action/MarketplaceSearch";
import MyVairifyService from "../../../services/MyVairifyService";
import { HandleUpdateFollowers } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../../../components/Loading/Index";

export default function Comments(props) {
  const location = useLocation();
  const state = props?.state || location?.state;
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const dispatch = useDispatch();
  const AllCommments = useSelector((state) => state.Market.getAllPostComment);
  const [storeComments, setStoreComments] = useState([])
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (state?._id) {
        setLoading(true);
        const result = await dispatch(HandleGetCommentsPost(state._id));
        setStoreComments(result?.payload || []);
        setLoading(false);
      }
    };
    fetch();
  }, [state?._id, dispatch]);


  const HandleButton = () => {
    if (!comments) {
      return;
    }

    const newComment = {
      userId: UserDetails,
      text: comments,
      timeAgo: moment().fromNow(),
    };

    setStoreComments((prev) => [...prev, newComment]);
    setComments("");
    const body = {
      userId: UserDetails?._id,
      text: comments,
    };
    dispatch(HandleCommentsPost(state?._id, body))
      .then((result) => {
        if (result?.payload?.status === 200) {
          dispatch(HandleGetCommentsPost(state?._id));
        }
      })
      .catch((err) => {
        console.error(err, "Error");
      });
  };


  if (loading) {
    return (
      <div className="flex justify-center align-center items-center pt-[48px]">
        <Loading className="border-blue" />
      </div>
    );
  }
  else {

    return (
      <div className="">
        <div className="w-full mx-auto flex flex-col justify-center items-center">
          <div className="sm:py-[10px] sm:my-0 text-xl sm:text-[#212B36] text-white font-semibold text-center sm:bg-transparent bg-[#060C4D] sm:relative fixed max-sm:top-[-5px] pt-[30px] pb-2 sm:w-fit w-full">
            Comments
          </div>
          <div className="w-full sm:max-h-[180px] overflow-auto scrollbar-hidden pb-[30px] sm:pb-[50px]">
            {(storeComments || AllCommments) &&
              (storeComments || AllCommments)?.map((item, index) => {
                return (
                  <div key={index} className="w-full mx-auto">
                    <PersonalComments
                      userAvatar={
                        item?.userId?.profilePic !== ""
                          ? `${import.meta.env.VITE_APP_S3_IMAGE
                          }/${item?.userId?.profilePic}`
                          : item?.userId?.gender === "Male"
                            ? "/images/male.png"
                            : "/images/female.png"
                      }
                      userName={item?.userId?.name}
                      duration={item?.timeAgo}
                      content={item?.text}
                    />
                  </div>
                );
              })}
          </div>
          <div className="mt-[24px] flex w-full sm:absolute fixed z-50 bottom-[0px] sm:bottom-[8px]  px-[16px] bg-[#060C4D] sm:bg-white pb-[24px] sm:pb-0 pt-2 sm:pt-0">
            <InputText
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              influencer-affiliate
              placeholder={"Write a comment"}
              className={"h-[50px] border-[#919EAB33] text-sm font-normal sm:bg-white rounded-full sm:rounded-2xl sm:!text-black sm:!placeholder-black !text-white !placeholder-white w-full pr-[48px]"}
            />
            <button className="w-[20px] ml-[20px] absolute right-[34px] sm:top-[17px] top-[24px]" onClick={HandleButton}>
              <img src="/images/comments.png" alt="icon" className="sm:block hidden" />
              <img src="/images/home/message-white.svg" alt="icon" className="sm:hidden block" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
