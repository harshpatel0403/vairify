import { useEffect, useState } from "react";
import SearchBox from "../../../components/DateguardSearchbox";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { useSelector } from "react-redux";

export default function InviteMemberToGroup() {
  const params = useParams();
  const nav = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [createMemberLoading, setCreateMemberLoading] = useState(false)
  const [members, setMembers] = useState([]);
  const [groupDetails, setGroupDetails] = useState({});
  const [inviteInprogress, setInviteInprogress] = useState(false)

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

console.log("ali state: ", state)
  const getMemersDetails = async () => {
    try {
      const res = await DateGuardService.getMembers(UserDetails?._id);
      setMembers(res);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const getGroupDetails = async () => {
    try {
      const res = await DateGuardService.getSingleGroup(params.groupId);
      setGroupDetails(res);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const fetchRequiredData = async () => {
    setLoading(true);
    try {
      await Promise.all([getMemersDetails(), getGroupDetails()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!UserDetails) {
      nav('/login')
      return
    }
    if (!params.groupId) {
      nav(-1);
      return;
    }
    fetchRequiredData();
  }, []);

  const handleInvite = async (member) => {
    try {
      setInviteInprogress(true)
      await DateGuardService.inviteToGroup(params.groupId, {
        memberId: member?._id,
      });
      nav(-1);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setInviteInprogress(false)
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    if(!name){
      return toast.error('Name is required!')
    }
    if(!isValidPhoneNumber){
      return toast.error('Valid phone number is required!')
    }
    try {
      setCreateMemberLoading(true)
      await DateGuardService.createMember(
        {
          name,
          phoneNumber: `+${phoneNumber}`,
          groupToken:state.groupToken
        },
        UserDetails?._id
      );
      setName("");
      setPhoneNumber("");
      setShowModal(false);
      setLoading(true)
      getMemersDetails().finally(() => {
        setLoading(false)
      }) 
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setCreateMemberLoading(false)
    }
  };

  const handleSearch = (e) => {
    console.log("Handle Search Event => ", e);
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
  console.log(members, " <=== members...");

  const validatePhoneNumber = (
    inputNumber,
    country,
    isDirty,
    phoneLength
  ) => {
    if (isDirty) {
      if (
        inputNumber &&
        inputNumber?.replace(country.dialCode, '')?.trim() === ''
      ) {
        return false;
      } else if (inputNumber.length < phoneLength) {
        return false;
      }
      return true;
    }
    return false;
  };

  return (
    <div className="main-container form-field-container p-0">
      <div className="mx-auto flex flex-col justify-center items-center pt-2 form-field-container">
        <div className="">
          <span className="font-bold text-[20px] text-white">
            Invite to Group {groupDetails?.name || ''}
          </span>
        </div>
        <div
          className="flex items-center justify-center bg-[#6e6880] py-2  mt-4 form-field-container"
          style={{ border: "1px solid #0247FF" }}
        >
          <SearchBox
            onSearch={handleSearch}
            bgColor={"[#6e6880]"}
            classname={
              "border-none focus:outline-none focus:shadow-none font-medium text-[25px] py-0 px-0 pr-11 text-white"
            }
            placeholder="Search Contacts"
          />
        </div>
        <div className="flex flex-col justify-start items-center pb-12 overflow-scroll form-field-container">
          {members.map((member, index) => {
            const isInvited = !!groupDetails?.members?.find(
              (memb) => member._id === memb?.memberId?._id
            );
            return (
              <div key={index} className="w-full mx-auto flex flex-col justify-center items-center mt-2">
                <div className="w-full flex flex-row justify-between items-center py-4 px-4 h-[77px] hover:bg-[#6e6880]">
                  <div className="flex items-center justify-center">
                    <div className="mr-4 w-[50px] h-[50px] flex justify-center items-center bg-[#02227E] text-white rounded-full">
                      <span>{member?.name?.[0]}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-medium text-[18px] text-white">
                        {member.name}
                      </span>
                      <br />
                      <span className="rounded-[10px] text-left font-bold text-[14px] text-[#fff] opacity-50">{member.phoneNumber}</span>
                    </div>
                  </div>
                  <div className="bg-[#02227E] p-2 text-white rounded-[4px]">
                    <button
                      disabled={isInvited || inviteInprogress}
                      onClick={() => handleInvite(member)}
                    >
                      <span className="font-black text-[14px] text-[#fff]">
                        {isInvited ? "Invited" : "Invite"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="h-[50px] w-[50px] flex justify-center items-center bg-[#02227E] text-white rounded-full fab cursor-pointer"
      >
        <i className="fa fa-plus"></i>
      </button>

      {showModal ? (
        <>
          
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none add-member-modal">
            <div
              className="relative w-auto mx-auto max-w-5xl"
              style={{ width: "25rem" }}
            >
              {/*content*/}
              <form onSubmit={handleCreateMember}>
                <div className="modal-body-part border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <button
                    className="absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {setShowModal(false); setName(""); setPhoneNumber("");}}
                  >
                    <img src={"/images/close-btn.svg"} alt="cancle" />
                  </button>
                  {/*body*/}
                  <div className="relative py-5 flex-auto">
                    <h2>Add to Contacts</h2>
                    <div className="px-5 pb-3">
                      <input
                        className="w-full p-3 modal-input"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="px-5 pb-3 ">
                     
                      <PhoneInput
                        inputClass="bg-[transparent] w-[100%]"
                        buttonClass=""
                        searchClass=""
                        dropdownClass=""
                        containerClass="w-full modal-input custom-flag-part"
                        country={"in"}
                        enableSearch={true}
                        value={phoneNumber}
                        onChange={(phone) => setPhoneNumber(phone)}
                        isValid={(inputNumber, country, countries) => {
                          const phoneLength = Math.ceil(
                            (countries.filter(
                              (val) => val.dialCode === country.dialCode
                            )[0])?.format.length / 2
                          );
                          let result = validatePhoneNumber(
                            inputNumber,
                            country,
                            true,
                            phoneLength
                          );
                          setIsValidPhoneNumber(result)
                          return true
                        }}
                      />
                    </div>
                    <div className="w-full mx-auto flex flex-col justify-center items-center">
                      <div className="w-[142px] my-2">
                        <Button
                          disabled={createMemberLoading}
                          text={createMemberLoading ? "Loading.." : "Invite"}
                          className="bg-[#05B7FD] rounded-[10px] font-bold text-[30px] h-[41px] flex items-center justify-center change-font-family"
                          size="41px"
                          // onClick={handleCreateMember}
                          type="submit"
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
