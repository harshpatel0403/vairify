import React, { useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleMyInvitation,
  HandleUpdateInvitationStatus,
} from "../../../redux/action/MarketplaceSearch";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function Invite() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const myInvitation = useSelector((state) => state?.Market?.myInvitation);
  console.log(
    "🚀 ~ file: Invite.jsx:11 ~ Invite ~ myInvitation:",
    myInvitation
  );

  useEffect(() => {
    dispatch(HandleMyInvitation(UserDetails?._id));
  }, []);

  const handleCancelInvite = (invitationId) => {
    const userId = UserDetails?._id;
    dispatch(HandleUpdateInvitationStatus(invitationId, userId, "cancel"));
    dispatch(HandleMyInvitation(UserDetails?._id));
  };

  return (
    <div className="main-container px-3 py-6 pb-6 gap-2 flex flex-col items-center">
      <div className="w-[100vw] flex flex-col justify-center items-center bg-[#797E9E] h-[40px]">
        <p className="font-bold text-[26px] text-[#040C50]">Invitations</p>
      </div>

      {myInvitation?.length ? (
        <div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <p className="w-[18px] h-[17px] bg-[#0CA36C]"></p>
              <p className="text-[26px] font-bold">Accepted</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="w-[18px] h-[17px] bg-[#0247FF]"></p>
              <p className="text-[26px] font-bold">Active</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {myInvitation.map((item, index) => {
              item.client = true;
              const startTime = moment(item?.invitationtime.from, "hh:mm A");
              const endTime = moment(item?.invitationtime.to, "hh:mm A");
              // Calculate the duration between the two moments
              const duration = moment.duration(endTime.diff(startTime));
              const hours = duration.hours();
              const minutes = duration.minutes();
              item?.invitee?.map((D) => {
                if (D?.id === UserDetails?._id && D.status === "accept") {
                  item.status = D.status;
                  return item;
                }
              });
              var isCancelled = false;
              item.invitee.map((invitee) => {
                if (invitee?.id === UserDetails?._id) {
                  if (invitee.status === "cancel") {
                    isCancelled = true;
                  }
                }
              });
              if (isCancelled) {
                return <React.Fragment key={item._id}></React.Fragment>;
              }
              console.log("🚀 ~ file: Invite.jsx:47 ~ Invite ~ status:", item);
              return (
                <div
                  key={index}
                  className={`bg-${
                    item.status === "pending" ? "[#3760CB]" : "[#0CA36C]"
                  } flex flex-col rounded-2xl px-3 py-1.5 border-2 border-white`}
                >
                  <div className="flex gap-2 ">
                    <div className="flex flex-col items-center">
                      {/* <img
                        src={import.meta.env.BASE_URL + "images/AdminAboutMe2.png"}
                        alt=""
                        width={74}
                      /> */}
                      {item?.userId?.profilePic ? (
                        <img
                        src={
                          import.meta.env.VITE_APP_S3_IMAGE +
                          `/${item?.userId?.profilePic}`
                        }
                          // src={
                          //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                          //   `/${item?.userId?.profilePic}`
                          // }
                          className="w-[65px] min-w-[65px] max-w-[65px] h-[65px] min-h-[65px] max-h-[65px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                          alt="Hot Rod"
                        />
                      ) : (
                        <img
                          className="w-[65px] min-w-[65px] max-w-[65px]  h-[65px] min-h-[65px] max-h-[65px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                          src={
                            item?.userId?.gender === "Male"
                              ? "/images/male.png"
                              : "/images/female.png"
                          }
                          alt="Hot Rod"
                        />
                      )}
                      <div>
                        <h4 className="text-white text-[12px] font-bold leading-4">
                          TruRevu
                        </h4>
                        <h4 className="text-white text-[14px] font-bold leading-4">
                          {item?.userId?.name}
                        </h4>
                        <h4 className="text-white text-[12px] font-bold leading-4 uppercase">
                          {item?.userId?.vaiID}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 leading-[20px]">
                        <ReactStars
                          count={5}
                          value={item?.userId?.averageRating}
                          size={16}
                        />
                        <span className="text-black font-black text-[11px]">
                          {item?.userId?.averageRating}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="w-full grid grid-cols-3">
                        <div className="flex flex-col">
                          <div>
                            <h6 className="text-[10px] text-white font-bold leading-1">
                              Requested Appt/time
                            </h6>
                          </div>
                          <div className="mt-2">
                            <h6 className="text-[10px] text-white font-bold">
                              {moment(item.createdAt).format("DD/MM/YY")}
                            </h6>
                            <h6 className="text-[10px] text-white font-bold">
                              {item?.invitationtime.from} to
                              <br />
                              {item?.invitationtime.to}
                            </h6>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div>
                            <h6 className="text-[10px] text-white font-bold leading-1">
                              Requested Service/Time
                            </h6>
                          </div>
                          <div className="mt-2">
                            <h6 className="text-[10px] text-white font-bold">
                              {item.service}
                            </h6>
                            <h6 className="text-[10px] text-white font-bold">
                              {hours} hr {minutes} m
                            </h6>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div>
                            <h6 className="text-[10px] text-white font-bold leading-1">
                              Requested Location
                            </h6>
                          </div>
                          <div className="mt-2">
                            <h6 className="text-[10px] text-white font-bold">
                              {item.venue}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-[0px] justify-around py-1">
                        <div className="border-2 border-[#02227E] rounded-2xl bg-[#fdfdfd80] p-2 w-[160px]">
                          <p className="font-bold leading-3 text-[10px]">
                            {item.specialty}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-[10px] text-white ">
                            PRICE OFFERED
                          </h5>
                          <h3
                            className="text-[24px] text-black font-bold "
                            style={{
                              WebkitTextStrokeColor: "white",
                              WebkitTextStrokeWidth: 0.6,
                            }}
                          >
                            ${item.priceoffered}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2 mt-3">
                    <div className="w-[100px]">
                      <Button
                        text={"View Profile"}
                        className={
                          "text-[14px] text-white font-bold border-2 border-white from-[#02227E] to-[#02227E] leading-4 rounded-full whitespace-nowrap mt-[3px]"
                        }
                        size={"33.7px"}
                        onClick={() =>
                          navigate("/user/profile", {
                            state: { item, market: true },
                          })
                        }
                      />
                    </div>
                    <div className="w-[133px]">
                      <Button
                        text={"View Invitation"}
                        className={
                          "text-[14px] text-white font-bold border-2 border-white from-[#02227E] to-[#02227E] leading-4 rounded-full mt-[3px]"
                        }
                        size={"36px"}
                        onClick={() =>
                          navigate("/marketplace/active/invitation", {
                            state: item,
                          })
                        }
                      />
                    </div>
                    <div className="w-[103px]">
                      <Button
                        onClick={() => handleCancelInvite(item._id)}
                        text={"Cancel"}
                        className={
                          "text-[14px] text-white font-bold border-2 border-white bg-[#DB3002] leading-4 rounded-full w-[144px] mt-[3px]"
                        }
                        size={"36px"}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-[32px] text-[#4b4b4b] font-bold text-center h-[400px] flex flex-col justify-center items-center">
          <div className="image-not">
            <img src="/images/notFound.png" alt="logo" />
          </div>
          Result not found
        </div>
      )}
    </div>
  );
}
