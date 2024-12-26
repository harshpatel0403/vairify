import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DateGuardSelectGroup() {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [fromAppointment, setFromAppointment] = useState(false);

  const nav = useNavigate();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const params = useParams();

  const userId = UserDetails?._id;
  useEffect(() => {
    if (!UserDetails) {
      nav("/login");
      return;
    }
    setLoading(true);
    DateGuardService.getGroups(userId)
      .then((res) => {
        console.log(res, " <=== groups in response..");
        setGroups(res || []);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.error || error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (params?.appointmentId) {
      setFromAppointment(true);
    }
  }, [params]);

  const handleSelectGroup = (group) => {
    if (group?.members?.length > 0) {
      if (fromAppointment) {
        nav(`/dateguard/set-time-alarm/${params.appointmentId}/${group._id}`);
      } else {
        nav("/dateguard/select-appointment");
        return;
      }
    } else {
      toast.error("Members are not selected");
    }
  };

  const handelAddMember = (e, group) => {
    e.preventDefault();
    let body = {
      groupdId: group._id,
      groupToken: group.groupToken,
    };
    nav(`/dateguard/add-member/${group._id}`, {
      state: body,
    });
  };
  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex items-center justify-center">
          <span className="font-bold text-[30px] text-[#05B7FD] change-font-family">
            Date Guard
          </span>
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-4">
          <div className="w-[67px] h-[82px]">
            <img src={"/images/DateGuardMask.png"} alt="Date Guard Mask" />
          </div>
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-4">
          <span className="font-bold text-[30px] text-[#D9D9D9] change-font-family">
            SELECT GROUP
          </span>
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-12">
          <div className="w-[262px]">
            <Button
              onClick={() => nav("/dateguard/create-group")}
              text="Create Group"
              className={
                "bg-[#4200FF] rounded-[25px] font-bold text-[24px] text-[#D9D9D9] change-font-family"
              }
              size="43px"
            />
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-7 mb-20">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            groups.map((group, index) => (
              <div
                key={index}
                className="w-full mx-auto flex flex-row justify-center items-center flex-wrap mb-5"
              >
                {!fromAppointment && (
                  <Link onClick={(e) => handelAddMember(e, group)} to="#">
                    <div className="w-[34px] h-[34px] rounded-[50%] bg-[#05B7FD] flex items-center justify-center mr-4 mb-0">
                      <img
                        src={"/images/MathPlusMinus.png"}
                        alt="Plus-Minus Icon"
                      />
                    </div>
                  </Link>
                )}
                <div className="w-[122px] flex flex-col justify-center items-start mr-6">
                  <div>
                    <span className="font-bold text-[20px] text-[#D9D9D9]">
                      {group.name}
                    </span>
                  </div>
                  <div className="w-[100px]">
                    <Link to={`/dateguard/edit-group/${group._id}`}>
                      <Button
                        text="Edit/Details"
                        className={
                          "rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[14px] text-[#02227E]"
                        }
                        size="20px"
                      />
                    </Link>
                  </div>
                </div>
                <div className="w-[35px] mr-4 ">
                  <span className="font-bold text-[30px] text-[#D9D9D9]">
                    {group?.members?.length || 0}
                  </span>
                </div>
                {fromAppointment && (
                  <div className="w-[77px]">
                    <Button
                      onClick={() => handleSelectGroup(group)}
                      text="Select"
                      className={
                        "rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[20px]"
                      }
                      size="34px"
                    />
                  </div>
                )}
              </div>
            ))
          )}
          {/* <div className='w-full mx-auto flex flex-row justify-center items-center flex-wrap mt-5'>
                        <div className='w-[34px] h-[34px] rounded-[50%] bg-[#05B7FD] flex items-center justify-center mr-4 mb-0'><img src={'/images/MathPlusMinus.png'} alt="Plus-Minus Icon" /></div>
                        <div className='w-[122px] flex flex-col justify-center items-start mr-6 mb-4'><div><span className='font-bold text-[20px] text-[#D9D9D9]'>Family</span></div><div className='w-[100px]'><Button text="Edit/Details" className={'rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[14px] text-[#02227E]'} size="20px" /></div></div>
                        <div className='w-[35px] mr-4 mb-4'><span className='font-bold text-[30px] text-[#D9D9D9]'>5</span></div>
                        <div className='w-[77px] mb-4'><Button text="Select" className={'rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[20px]'} size="34px" /></div>
                    </div>
                    <div className='w-full mx-auto flex flex-row justify-center items-center flex-wrap mt-5'>
                        <div className='w-[34px] h-[34px] rounded-[50%] bg-[#05B7FD] flex items-center justify-center mr-4 mb-0'><img src={'/images/MathPlusMinus.png'} alt="Plus-Minus Icon" /></div>
                        <div className='w-[122px] flex flex-col justify-center items-start mr-6 mb-4'><div><span className='font-bold text-[20px] text-[#D9D9D9]'>Atlanta</span></div><div className='w-[100px]'><Button text="Edit/Details" className={'rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[14px] text-[#02227E]'} size="20px" /></div></div>
                        <div className='w-[35px] mr-4 mb-4'><span className='font-bold text-[30px] text-[#D9D9D9]'>10</span></div>
                        <div className='w-[77px] mb-4'><Button text="Select" className={'rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[20px]'} size="34px" /></div>
                    </div> */}
        </div>
      </div>
    </div>
  );
}
