import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchBox from "../../../components/DateguardSearchbox";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { useSelector } from "react-redux";
import Header from "../../../components/Header/Header";
import { IoCloseCircleOutline } from "react-icons/io5";
import Loading from "../../../components/Loading/Index";
import { MdPersonAdd } from "react-icons/md";
import PageTitle from "../../../components/PageTitle";


export default function InviteMemberToGroup() {
  const { t } = useTranslation();
  const params = useParams();
  const nav = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [createMemberLoading, setCreateMemberLoading] = useState(false)
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [groupDetails, setGroupDetails] = useState({});
  const [inviteInprogress, setInviteInprogress] = useState(null)

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  console.log("ali state: ", state)
  const getMemersDetails = async () => {
    try {
      const res = await DateGuardService.getMembers(UserDetails?._id);
      setAllMembers(res);
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
    if (!UserDetails) {
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
      setInviteInprogress(member._id)
      await DateGuardService.inviteToGroup(params.groupId, {
        memberId: member?._id,
      });
      nav(-1);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setInviteInprogress(null)
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    if (!name) {
      return toast.error(t("invitemember.nameRequired"));
    }
    if (!isValidPhoneNumber) {
      return toast.error(t("invitemember.validPhoneRequired"));
    }
    try {
      setCreateMemberLoading(true)
      await DateGuardService.createMember(
        {
          name,
          phoneNumber: `+${phoneNumber}`,
          groupToken: state?.body?.groupToken
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
    if (e != "") {
      const filtered = allMembers?.filter((member) =>
        member?.name?.toLowerCase().includes(e.toLowerCase())
      );
      setMembers(filtered);
    }
    else {
      setMembers(allMembers)
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }
  console.log(allMembers, " <=== members...");

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
    <>
      <div className="container">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px] md:hidden block">
          <PageTitle title={t("invitemember.pageTitle", { groupName: groupDetails?.name || "" })} isSmall={true} />
        </div>
        <div className="relative md:block hidden">
          <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white sm:my-[48px] mt-[24px]">{t("invitemember.pageTitle", { groupName: groupDetails?.name || "" })}</h3>
          <div className=" absolute right-0 sm:top-0 top-6 sm:block hidden">
            <Button
              onClick={() => setShowModal(true)}
              text={t("invitemember.addContacts")}
              className={
                "font-medium text-[14px] text-[#060C4D] text-center py-[6px] px-[12px]"
              }
            />
          </div>
        </div>


        {/* <input
            className='w-full border border-[#919EAB33] text-[18px] focus:outline-none bg-transparent rounded-lg'
            type="search"
            onSearch={handleSearch}
            placeholder='Search Contacts'
          /> */}
        <div className="mt-3">
          <SearchBox
            onSearch={handleSearch}
            bgColor={"transparent"}
            classname={
              "focus:outline-none focus:shadow-none !font-normal !text-[14px] py-[14px] px-[16px] text-white !border !rounded-lg !border-[#919EAB33] bg-transparent"
            }
            placeholder={t("invitemember.searchPlaceholder")}
          />
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-[24px] my-[40px]">
          {members.map((member, index) => {
            const isInvited = !!groupDetails?.members?.find(
              (memb) => member._id === memb?.memberId?._id
            );
            console.log('====================================');
            console.log(isInvited);
            console.log('====================================');

            const name = member?.name || "";
            const initials = name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map(word => word[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={index}
                className=""
              >
                <div className="w-full flex justify-between items-center gap-2">

                  <div className="flex items-center justify-center">
                    {/* Circle with initials */}
                    <div className="mr-4 w-[50px] h-[50px] flex justify-center items-center bg-[#FFFFFF14] text-white rounded-full text-lg font-semibold">
                      <span>{initials}</span>
                    </div>

                    {/* Name and Phone */}
                    <div className="text-left">
                      <span className="font-medium text-[14px] text-white">
                        {member.name}
                      </span>
                      <br />
                      <span className="rounded-[10px] font-bold text-[14px] text-[#fff] opacity-60">
                        {member.phoneNumber}
                      </span>
                    </div>
                  </div>

                  {/* Invite Button */}
                  <div className={`py-[4px] px-[16px]  ${isInvited ? " bg-[#0085B9] text-white" : "text-[#060C4D] bg-white"}  rounded-[8px] cursor-pointer`}>
                    <div
                      // disabled={isInvited || inviteInprogress}
                      onClick={() => !isInvited && !inviteInprogress && handleInvite(member)}
                    >
                      <span className={`text-[12px] font-semibold`}>
                         {inviteInprogress === member._id ? (
                            <Loading className="border-blue !h-4 !w-4 !mt-1" />
                          ) : (
                            <span className="text-[12px] font-semibold">
                              {isInvited ? t("invitemember.invited") : t("invitemember.invite")}
                            </span>
                          )}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
        <div className="md:hidden block fixed right-[16px] bottom-[32px] z-50">
          <button className="bg-white rounded-full h-[52px] w-[52px] flex items-center justify-center" onClick={() => setShowModal(true)}>
            <MdPersonAdd color="#060C4D" size={20} />
          </button>
        </div>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto w-[90%] mx-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div
                className="relative w-auto mx-auto max-w-5xl"
                style={{ width: "25rem" }}
              >
                {/*content*/}
                <form onSubmit={handleCreateMember}>
                  <div className="modal-body-part border-0 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <button
                      className="absolute right-[24px] top-[20px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => { setShowModal(false); setName(""); setPhoneNumber(""); }}
                    >
                      <IoCloseCircleOutline size={26} />

                    </button>
                    {/*body*/}
                    <div className="relative p-[24px] flex-auto">
                      <h2 className="text-center text-[#212B36] text-[20px] font-medium mb-4">{t("invitemember.addModalTitle")}</h2>
                      <input
                        className=" border border-[#919EAB33] p-[14px] mb-3 placeholder:!text-black text-black text-[14px] font-normal bg-transparent rounded-lg w-full max-w-[500px]"
                        type="text"
                        placeholder={t("invitemember.namePlaceholder")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <div>
                        <PhoneInput
                          inputClass="!bg-[transparent] w-[100%] border border-[#919EAB33] !text-black"
                          buttonClass=""
                          searchClass=""
                          dropdownClass=""
                          containerClass="w-full"
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
                        <div className="max-w-[500px] w-full mt-4">
                          <Button
                            disabled={createMemberLoading}
                            text={createMemberLoading ? <div className="flex items-center	justify-center">
                              <Loading />
                            </div> : t("invitemember.inviteBtn")}
                            // onClick={handleCreateMember}
                            type="submit"
                            className={'secondary-btn'}
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
