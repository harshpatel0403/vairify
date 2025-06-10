import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../../components/Header/Header";
import { FaPen } from "react-icons/fa";
import Loading from "../../../components/Loading/Index";
import { MdGroupAdd } from "react-icons/md";
import PageTitle from "../../../components/PageTitle";


export default function DateGuardSelectGroup() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [fromAppointment, setFromAppointment] = useState(false);
  const { state } = useLocation();
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
      toast.error(t("dateguardselectgroup.errorNoMembers"));
    }
  };

  const handelAddMember = (e, group) => {
    e.preventDefault();
    let body = {
      groupdId: group._id,
      groupToken: group.groupToken,
    };
    nav(`/dateguard/add-member/${group._id}`, {
      state: { body }
    });
  };
  return (
    <>
      <div className="container">
        <div className="md:my-[48px] my-[24px] ">
          <div className=" relative md:block hidden">
            <h4 className="font-medium sm:text-[28px] text-[24px] text-white text-center md:block hidden">
               {t("dateguardselectgroup.pageTitle")}
            </h4>
            <div className="w-[132px] absolute right-0 sm:top-0 top-[40px]">
              <Button
                onClick={() => nav("/dateguard/create-group")}
                text={t("dateguardselectgroup.createGroupButton")}
                className={
                  "font-medium sm:text-[14px] text-[#060C4D] text-center py-[6px] px-[12px]"
                }
              />
            </div>
          </div>

          <div className="md:hidden block md:mb-0 sm:mb-[30px] mb-[16px]">
            <PageTitle title={t("dateguardselectgroup.pageTitle")} isSmall={true} />
          </div>

          <p className="font-normal opacity-70 sm:text-[18px] text-[14px] text-[#D9D9D9] text-center sm:block hidden"> {t("dateguardselectgroup.pageSubtitle")}</p>


          {loading ? (
            <div className="flex justify-center items-center mt-[20%]">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-[24px] md:mt-[40px] mt-[24px]">
              {groups.map((group, index) => (
                <div
                  key={index}
                  className="w-full sm:bg-[#FFFFFF14] rounded-[16px] sm:p-[16px] py-[14px] flex justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium sm:text-[20px] text-base text-white">
                        {group.name}
                      </h3>
                      <div className="cursor-pointer" onClick={() => nav(`/dateguard/edit-group/${group._id}`)}>
                        <FaPen color="white" />
                      </div>
                    </div>
                    <h5 className="font-normal opacity-50 text-[14px] text-white">
                      {t("dateguardselectgroup.membersCount", { count: group?.members?.length || 0 })}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2">
                    {fromAppointment && (
                      <Button
                        onClick={() => handleSelectGroup(group)}
                        text={t("dateguardselectgroup.selectButton")}
                        className={
                          "font-medium sm:!text-[14px] !text-[12px] sm:py-[5px] py-[2px] sm:px-[18px] px-[12px]"
                        }
                      />
                    )}
                    {!fromAppointment && (
                      <Button
                        onClick={(e) => handelAddMember(e, group)}
                        text={t("dateguardselectgroup.editButton")}
                        className={
                          "font-medium sm:!text-[14px] !text-[12px] sm:py-[5px] py-[2px] sm:px-[18px] px-[12px]"
                        }
                      />
                      // <Link onClick={(e) => handelAddMember(e, group)} to="#">
                      //   <div className="w-[34px] h-[34px] rounded-[50%] bg-[#05B7FD] flex items-center justify-center mr-4 mb-0">
                      //     <img
                      //       src={"/images/MathPlusMinus.png"}
                      //       alt="Plus-Minus Icon"
                      //     />
                      //   </div>
                      // </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
      </div >
      <div className="md:hidden block fixed right-[16px] bottom-[32px] z-50">
        <button className="bg-white rounded-full h-[52px] w-[52px] flex items-center justify-center" onClick={() => nav("/dateguard/create-group")}>
          <MdGroupAdd color="#060C4D" size={20} />
        </button>
      </div>
    </>
  );
}
