import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCloseCircleOutline } from "react-icons/io5";
import Loading from "../../../components/Loading/Index";
import { MdPersonAdd } from "react-icons/md";
import PageTitle from "../../../components/PageTitle";


export default function DateGuardAddMember() {
  const params = useParams();
  const nav = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [groupDetails, setGroupDetails] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState({});

  console.log("ali state:  ", state);
  const fetchGroupDetails = () => {
    setLoading(true);
    DateGuardService.getSingleGroup(params.groupId)
      .then((res) => {
        setGroupDetails(res);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.error || error?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!params.groupId) {
      toast.error("Invalid Url");
      nav(-1);
      return;
    }
    fetchGroupDetails();
  }, [params.groupId]);

  const handleShowDelete = (member) => {
    if (!member || !member._id) {
      return;
    }
    setMemberToDelete(member);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setDeleteInProgress(true);
    try {
      await DateGuardService.removeFromGroup(groupDetails._id, {
        memberId: memberToDelete?.memberId?._id,
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setMemberToDelete(null);
      setShowModal(false);
      setDeleteInProgress(false);
      fetchGroupDetails();
    }
  };

  const handelAddMembers = (e) => {
    e.preventDefault();
    nav(`/dateguard/add-member/${params.groupId}/select-member`, {
      state: { body: state?.body }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="md:hidden block md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={groupDetails?.name} isSmall={true} />
        </div>
        <div className="relative md:py-0 py-[40px] md:block hidden">
          <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white my-[48px] md:block hidden">{groupDetails?.name}</h3>
          <div className=" absolute right-0 md:top-0 top-[40px]">
            <Button
              onClick={(e) => handelAddMembers(e)}
              text='+ Add Members'
              className={
                "font-medium text-[14px] text-[#060C4D] text-center py-[6px] px-[12px]"
              }
            />
          </div>
        </div>


        <div className="my-[48px] grid sm:grid-cols-2 grid-cols-1 gap-[24px]">
          {groupDetails?.members?.map((member, index) => {
            const name = member?.memberId?.name || "";
            const initials = name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map(word => word[0])
              .join("")
              .toUpperCase();
            return (
              <div key={index} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#FFFFFF14] flex items-center gap-1 justify-center text-white text-lg font-semibold">
                    {initials}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-[14px] font-normal">{member?.memberId?.name}</h2>
                    <h2 className="text-white text-[14px] opacity-70 font-normal">{member?.memberId?.phoneNumber}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-white text-[12px] font-normal">{member.status == "Invited" ? (<span className='bg-[#0085B9] py-[8px] px-[16px] rounded-lg'>Invited</span>) : (<span className='bg-[#4700B9] py-[8px] px-[16px] rounded-lg'>Accepted</span>)}</div>
                  <button
                    onClick={() => handleShowDelete(member)}
                  >
                    <RiDeleteBin6Line color="#ffffff" size={20} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="md:hidden block fixed right-[16px] bottom-[32px] z-50">
          <button className="bg-white rounded-full h-[52px] w-[52px] flex items-center justify-center" onClick={(e) => handelAddMembers(e)}>
            <MdPersonAdd color="#060C4D" size={20} />
          </button>
        </div>

        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div
                className="relative w-[90%] mx-auto p-[24px] rounded-2xl max-w-[500px] bg-white"
              >
                {/*content*/}
                <form onSubmit={() => { }}>
                  <div className="">
                    {/*header*/}
                    <button
                      className="absolute right-[18px] top-[18px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <IoCloseCircleOutline color="black" size={26} />
                    </button>
                    {/*body*/}
                    <div className="relative">
                      <h2 className="text-[#212B36] font-medium text-[20px] text-center">{memberToDelete?.memberId?.name} </h2>
                      <p className="text-[#212B36] font-medium text-[16px] text-center opacity-80 mt-1">Remove from the group {groupDetails.name}</p>
                      <div className="w-full mx-auto flex flex-col justify-center items-center">
                        <div className="max-w-[500px] w-full mx-auto mt-[24px]">
                          <Button
                            disabled={deleteInProgress}
                            text={deleteInProgress ? <div className="flex items-center	justify-center">
                              <Loading />
                            </div> : "Remove"}
                            className=" secondary-btn"
                            onClick={handleDelete}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </>
  );
}
