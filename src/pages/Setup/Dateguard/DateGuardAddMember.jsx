import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
      state: state,
    });
  };

  if (loading) {
    return (
      <div className="main-container h-full">
        <div className="text-white h-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container form-field-container px-3">
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
        <div className="w-full mx-auto flex items-center justify-center mt-6">
          <span className="font-bold text-[30px] text-white change-font-family">
            {groupDetails?.name}
          </span>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
          <Link onClick={(e) => handelAddMembers(e)} to="#">
            <div className="relative mt-5">
              <div style={{ left: "2px" }} className="absolute w-[44px] z-20">
                <Button
                  text="+"
                  className="font-bold text-[35px] rounded-[50%] bg-[#05B7FD] flex items-center justify-center w-[44px] h-[44px]"
                  size="44px"
                />
              </div>
              <div className="relative w-[245px] h-[45px] bg-[#4200FF] rounded-[25px] border-2 border-[#4200FF]">
                <span
                  style={{ left: "20px" }}
                  className="font-bold text-[24px] text-white relative change-font-family"
                >
                  Add/Members
                </span>
              </div>
            </div>
          </Link>
        </div>
        <div className="mark-data flex mt-3">
          <h4 className="flex-1">Invited</h4>
          <h4 className="flex-1 accept">Accepted</h4>
        </div>
        <div className="mark-table-part mt-10">
          {groupDetails?.members?.map((member, index) => (
            <div key={index} className="table-field mt-3">
              <div
                className={
                  member.status == "Invited" ? "mark invited" : "mark accepted"
                }
              ></div>
              <h2 className="">{member?.memberId?.name}</h2>
              <h2 className="">{member?.memberId?.phoneNumber}</h2>
              <button
                onClick={() => handleShowDelete(member)}
                className="delete-icon"
              >
                <img src={"/images/delete-icon.svg"} alt="icon" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none add-member-modal">
            <div
              className="relative w-auto mx-auto max-w-5xl"
              style={{ width: "25rem" }}
            >
              {/*content*/}
              <form onSubmit={() => {}}>
                <div className="modal-body-part border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <button
                    className="absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <img src={"/images/close-btn.svg"} alt="cancle" />
                  </button>
                  {/*body*/}
                  <div className="relative py-5 flex-auto">
                    <h2>{memberToDelete?.memberId?.name} </h2>
                    <p>Remove from the group </p>
                    <p>{groupDetails.name}</p>
                    <div className="w-full mx-auto flex flex-col justify-center items-center">
                      <div className="w-[142px] my-2">
                        <Button
                          disabled={deleteInProgress}
                          text={deleteInProgress ? "Loading.." : "Remove"}
                          className="bg-[#05B7FD] rounded-[10px] font-bold text-[30px] h-[41px] flex items-center justify-center change-font-family"
                          size="41px"
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
  );
}
