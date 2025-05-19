import React, { useMemo, useState } from "react";
import Modal from "react-modal";
import SelectBox_ from "../SelectBox_";
import InputText from "../InputText";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleCreateMarketPlace,
  HandleEditMarketPlace,
  HandleInvitation,
  HandleResultMarketPlace,
} from "../../redux/action/MarketplaceSearch";
import { toast } from "react-toastify";
import Loading from "../Loading/Index";
import { useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { CaretDown } from "phosphor-react";
const times = [
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
];

export default function MarketPlaceModale({
  open,
  setOpen,
  setsearchOpen,
  searchOpen,
  AllData,
  EditData,
  setUpdate,
  update,
  favoriteStatus,
  state,
  fromMonth,
  fromDay,
  toMonth,
  toDay,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sendInvitations = useSelector((state) => state?.Market?.sendInvitation);

  const [system, setSystem] = useState(false);
  const [escort, setEscort] = useState(false);
  const [invitationLoading, setInvitationLoading] = useState(false);
  const [addInvitationLoading, setAddInvitationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchname, setSearchname] = useState("");
  const [fromTime, setFromTime] = useState("02:00");
  const [fromZone, setFromZone] = useState("A.M");
  const [toTime, setToTime] = useState("01:00");
  const [toZone, setToZone] = useState("P.M");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState("");
  const [priceoffered, setPriceoffered] = useState("");

  useMemo(() => {
    if (EditData) {
      setSearchname(EditData?.searchname);
      setSpecialty(EditData?.specialty);
      setPriceoffered(EditData?.priceoffered);
    }
  }, [EditData]);
  const closeMessage = () => {
    setOpen(false);
  };
  const closeSyatem = () => {
    setSystem(false);
  };
  const closeEscort = () => {
    setEscort(false);
  };
  const closeFavorites = () => {
    setsearchOpen(false);
  };
  const closeUpdate = () => {
    setUpdate(false);
  };

  const zones = ["A.M", "P.M"];

  const HandleSubmit = async () => {
    setLoading(true);

    const validationErrors = {};
    if (!searchname && favoriteStatus) {
      validationErrors.name = "Name is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setInvitationLoading(false);
      console.log(validationErrors, " <=== errors..");
      return; // Prevent form submission if there are errors
    }
    // Clear any previous errors
    setError({});
    const updatedInquiryData = await { ...AllData };
    // Assign the value to the property
    updatedInquiryData.searchname = searchname;
    if (updatedInquiryData.inquiry === "Invitation") {
      const inviteID = sendInvitations?.result?.map((item) => {
        const id = item?.profile?.userId?._id;
        if (id) {
          return {
            id,
            invitationtime: {
              from: fromTime + " " + fromZone,
              to: toTime + " " + toZone,
            },
            invitationdate: {
              from: fromMonth + " " + fromDay,
              to: toMonth + " " + toDay,
            },
          };
        }
      });
      updatedInquiryData.specialty = specialty;
      updatedInquiryData.priceoffered = priceoffered;
      updatedInquiryData.invitationtime = {
        from: fromTime + " " + fromZone,
        to: toTime + " " + toZone,
      };
      updatedInquiryData.invitationdate = {
        from: fromMonth + " " + fromDay,
        to: toMonth + " " + toDay,
      };
      updatedInquiryData.invitee = inviteID;
    }
    dispatch(
      EditData
        ? HandleEditMarketPlace(EditData?._id, updatedInquiryData)
        : HandleCreateMarketPlace(updatedInquiryData)
    )
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setLoading(false);
          dispatch(
            HandleResultMarketPlace(result?.payload?.data?.MarketSearch?._id)
          );
          if (updatedInquiryData.inquiry === "Invitation") {
            navigate("/invitations");
          } else {
            navigate("/results");
          }
        } else {
          setLoading(false);
          // setError(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err, "Error");
      });
  };
  const SubmitData = async () => {
    if (AllData.favoriteStatus && AllData.inquiry !== "Invitation") {
      HandleSubmit();
    } else {
      setAddInvitationLoading(true);
      await dispatch(HandleInvitation(AllData))
        .then((result) => {
          if (result?.payload?.result?.length > 0) {
            navigate("/results");
            setsearchOpen(true);
            setAddInvitationLoading(false);
          } else {
            toast(result?.payload?.message, {
              hideProgressBar: true,
              autoClose: 1000,
              type: "warning",
            });
            setsearchOpen(false);
            // navigate("/advance/search", {
            //   state: { state, AllData, EditData: EditData },
            // });
            setAddInvitationLoading(false);
          }
        })
        .catch((err) => {
          setAddInvitationLoading(false);
          console.error(err, "Error");
        });
      // setIsLoading(false);
      // navigate("/results");
    }
  };

  const Invitations = async () => {
    // Clear any previous errors
    setError({});
    setInvitationLoading(true);
    const validationErrors = {};
    if (!priceoffered) {
      validationErrors.name = "priceoffered is required";
      setInvitationLoading(false);
      return toast.error("priceoffered is required");
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setInvitationLoading(false);
      console.log(validationErrors, " <=== error in invitation");
      return; // Prevent form submission if there are errors
    }

    await dispatch(HandleInvitation(AllData));
    setInvitationLoading(false);
    setSystem(true);
  };
  return (
    <div>
      {
        // Invitation Box
      }
      <div className="">
        <Modal
          isOpen={open}
          onRequestClose={closeMessage}
          className=" max-w-[550px] max-h-[700px] mx-auto bg-white overflow-auto fixed rounded-2xl sm:p-[24px] p-[16px] w-[90%]"
          contentLabel="#"
        >
          <p className="text-[20px] font-medium text-[#212B36] text-center mb-[30px]">
            Invitation Time Window
          </p>
          <button
            onClick={() => setOpen(false)}
            className="absolute sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          >
            <IoCloseCircleOutline size={26} />
          </button>
          <div className="flex gap-1 justify-between items-center w-full mt-2">
            <div className="flex justify-center items-center w-full gap-4">
              <div className="relative w-full">
                <SelectBox_
                  onChange={(e) => {
                    setFromTime(e.target.value);
                  }}
                  options={times}
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-black font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-black "}

                />
                <div className="absolute top-[10px] right-2 text-black z-[-1]"><CaretDown size={16} /></div>

              </div>
              <div className="relative w-full">
                <SelectBox_
                  onChange={(e) => setFromZone(` ${e.target.value}`)}
                  options={zones}
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-black font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-black "}

                />
                <div className="absolute top-[10px] right-2 text-black z-[-1]"><CaretDown size={16} /></div>

              </div>
            </div>
            <span className="text-[24px] text-[#fff] font-bold">to</span>
            <div className="flex justify-center items-center w-full gap-4">
              <div className="relative w-full">
                <SelectBox_
                  onChange={(e) => {
                    setToTime(e.target.value);
                  }}
                  options={times}
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-black font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-black "}

                />
                <div className="absolute top-[10px] right-2 text-black z-[-1]"><CaretDown size={16} /></div>

              </div>

              <div className="relative w-full">
                <SelectBox_
                  onChange={(e) => setToZone(` ${e.target.value}`)}
                  options={zones}
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-black font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-black "}

                />
                <div className="absolute top-[10px] right-2 text-black z-[-1]"><CaretDown size={16} /></div>

              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pb-2 mt-4 rounded-lg">
            <p className="text-[20px] font-medium text-black pl-0">
              Price offered
            </p>
            <p className="text-[20px] font-medium text-black py-0">
              $
              <input
                className="w-[75px] placeholder:text-black text-black text-[14px] py-[6px] px-[10px] focus:ring-0 !outline-none border-2 rounded-lg bg-transparent ml-2"
                // placeholder="500"
                onChange={(e) => setPriceoffered(e.target.value)}
                value={priceoffered}
                style={{ borderColor: `${error.name ? "#ef4444" : ""}` }}
                type="number"
              />
            </p>
          </div>
          <div>
            <textarea
              size="115px"
              className="w-full text-[14px] text-black px-[12px] py-[6px] h-[115px] rounded-lg bg-transparent border-2"
              bgColor={"#D9D9D9"}
              onChange={(e) => setSpecialty(e.target.value)}
              value={specialty}
            />
          </div>
          <div className="mt-1 mb-0 flex justify-center items-center">
            <div className="w-full">
              <Button
                className={'secondary-btn'}
                text={
                  !invitationLoading ? (
                    "Submit"
                  ) : (
                    <div className="flex items-center	justify-center">
                      <Loading />
                    </div>
                  )
                }
                onClick={Invitations}
                disabled={invitationLoading}
              />
            </div>
          </div>
        </Modal>
      </div>
      <Modal
        isOpen={system}
        onRequestClose={closeSyatem}
        className=" max-w-[550px] max-h-[700px] mx-auto bg-white overflow-auto fixed rounded-2xl sm:p-[24px] p-[16px] w-[90%]"
      >
        <button
          onClick={() => setSystem(false)}
          className="absolute sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
        >
          <IoCloseCircleOutline size={26} />
        </button>
        <p className="max-w-full text-[18px] font-normal text-center text-[#212B36] my-8">
          System has found{" "}
          <span>
            {sendInvitations?.result?.length}
          </span>{" "}
          Matching result do you want to send invitation?
        </p>
        <div className="flex justify-center gap-4 items-center w-full">
          <div className="w-full">
            <Button
              onClick={() => {
                favoriteStatus ? setUpdate(true) : HandleSubmit();
              }}
              className={
                'secondary-btn'}
              text={"Yes"}
              disabled={sendInvitations?.result?.length === 0}
            />
          </div>
          <div className="w-full">
            <Button
              text={"No"}
              onClick={() => {
                setPriceoffered("");
                setSystem(false);
                setOpen(false);
              }}
            />
          </div>
        </div>
      </Modal>
      {
        // Search Box
      }
      <Modal
        isOpen={searchOpen}
        onRequestClose={closeFavorites}
        style={{ zIndex: "1000" }}
        className=" max-w-[550px] max-h-[700px] mx-auto bg-white overflow-auto fixed rounded-2xl sm:p-[24px] p-[16px] w-[90%]"
      >
        <button
          onClick={() => setsearchOpen(false)}
          className="absolute sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
        >
          <IoCloseCircleOutline size={26} />
        </button>
        <p className="text-[20px] font-medium text-[#212B36] text-center">
          {AllData.service}
        </p>
        <div className="grid grid-cols-1 mt-[24px] sm:gap-[24px] gap-[16px]">
          <div className="flex items-center">
            <p className="text-[14px] font-medium text-[#212B36] min-w-[140px]">
              Type
            </p>
            <p className="text-[14px] font-normal text-[#212B36]">
              {AllData.type}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-[14px] font-medium text-[#212B36] min-w-[140px]">
              Location
            </p>
            <p className="text-[14px] font-normal text-[#212B36]">
              {AllData.location}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-[14px] font-medium text-[#212B36] min-w-[140px]">
              Sex
            </p>
            <p className="text-[14px] font-normal text-[#212B36]">
              {AllData.gender}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-[14px] font-medium text-[#212B36] min-w-[140px]">
              Orientation
            </p>
            <p className="text-[14px] font-normal text-[#212B36]">
              {AllData.orientation}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-[14px] font-medium text-[#212B36] min-w-[140px]">
              Venue
            </p>
            <p className="text-[14px] font-normal text-[#212B36]">
              {AllData.venue}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-[14px] font-medium text-[#212B36] min-w-[140px]">
              Inquiry
            </p>
            <p className="text-[14px] font-normal text-[#212B36]">
              {AllData.inquiry}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-[14px] font-medium text-[#212B36] min-w-[140px]">
              Service
            </p>
            <p className="text-[14px] font-normal text-[#212B36]">
              {AllData.service}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-[14px] font-medium text-[#212B36] min-w-[140px]">
              Sensual Services
            </p>
            <p className="text-[14px] font-normal text-[#212B36]">
              {AllData?.advancedservices
                ? AllData.advancedservices.join(", ")
                : ""}
            </p>
          </div>

          {AllData.favoriteStatus && AllData.inquiry !== "Invitation" && (
            <div className="flex items-center">
              <p className="text-[14px] font-medium text-[#212B36] min-w-[140px]">
                Name the Search/invitation
              </p>
              <InputText
                className="text-[14px] font-normal !text-[#212B36]  bg-[#919EAB14] rounded-lg border-0"
                border={"#D9D9D9"}
                bgColor={"#919EAB14"}
                onChange={(e) => setSearchname(e.target.value)}
                value={searchname}
              />
              {error.name && (
                <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                  {error.name}
                </label>
              )}
            </div>
          )}
        </div>


        <div className="mt-[24PX] flex justify-center items-center w-full">
          <Button
            className={'secondary-btn'}
            disabled={addInvitationLoading}
            text={
              !addInvitationLoading ? (
                AllData.favoriteStatus && AllData.inquiry !== "Invitation" ? (
                  "Save To Favorites"
                ) : (
                  "Submit"
                )
              ) : (
                <div className="flex items-center	justify-center">
                  <Loading />
                </div>
              )
            }
            onClick={() =>
              // setUpdate(true)
              SubmitData()
            }
          />
        </div>
      </Modal>

      <Modal
        isOpen={update}
        onRequestClose={closeUpdate}
        className=" max-w-[550px] max-h-[700px] mx-auto bg-white overflow-auto fixed rounded-2xl sm:p-[24px] p-[16px] w-[90%]"
      >
        <button
          onClick={() => setUpdate(false)}
          className="absolute sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
        >
          <IoCloseCircleOutline size={26} />
        </button>
        <p className="sm:text-[20px] text-[16px] sm:w-auto w-[80%] mx-auto font-medium text-center text-[#212B36]">
          Save this search/invitation to favorites Name it something you will
          Remember
        </p>
        <div className="w-full my-[24px]">
          <InputText
            className="text-[14px] font-normal !text-[#212B36] placeholder:!text-black  bg-[#919EAB14] rounded-lg border-0"
            border={"#D9D9D9"}
            bgColor={"#919EAB14"}
            onChange={(e) => setSearchname(e.target.value)}
            placeholder={'Name'}
            value={searchname}
          />
          {error.name && (
            <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
              {error.name}
            </label>
          )}
        </div>
        <div>
          <Button
            className={'secondary-btn'}
            text={
              !loading ? (
                "Save"
              ) : (
                <div className="flex items-center	justify-center">
                  <Loading />
                </div>
              )
            }
            onClick={HandleSubmit}
            disabled={loading}
          />
        </div>

      </Modal>
    </div>
  );
}
