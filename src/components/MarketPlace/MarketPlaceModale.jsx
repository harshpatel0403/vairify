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
  const [isLoading, setIsLoading] = useState(false); // State to track loading
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
    setIsLoading(true);

    const validationErrors = {};
    if (!searchname && favoriteStatus) {
      validationErrors.name = "Name is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
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
          setIsLoading(false);
          dispatch(
            HandleResultMarketPlace(result?.payload?.data?.MarketSearch?._id)
          );
          if (updatedInquiryData.inquiry === "Invitation") {
            navigate("/invitations");
          } else {
            navigate("/results");
          }
        } else {
          setIsLoading(false);
          // setError(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
      });
  };
  const SubmitData = async () => {
    if (AllData.favoriteStatus && AllData.inquiry !== "Invitation") {
      HandleSubmit();
    } else {
      setIsLoading(true);
      await dispatch(HandleInvitation(AllData))
        .then((result) => {
          if (result?.payload?.result?.length > 0) {
            navigate("/results");
            setsearchOpen(true);
            setIsLoading(false);
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
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err, "Error");
        });
      // setIsLoading(false);
      // navigate("/results");
    }
  };

  const Invitations = async () => {
    // Clear any previous errors
    setError({});
    setIsLoading(true);
    const validationErrors = {};
    if (!priceoffered) {
      validationErrors.name = "priceoffered is required";
      setIsLoading(false);
      return toast.error("priceoffered is required");
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      console.log(validationErrors, " <=== error in invitation");
      return; // Prevent form submission if there are errors
    }

    await dispatch(HandleInvitation(AllData));
    setIsLoading(false);
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
          className={
            "bg-[#3760CB] relative w-[360px] rounded-2xl px-4 center-modal"
          }
          contentLabel="#"
        >
          <div className="pt-px">
            <p className="text-[22px] text-[#fff] text-start font-bold px-0 mt-6">
              Invitation Time Window
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4"
          >
            <img
              src="/images/Mask group-close.png"
              alt=""
              width="30px"
              height="30px"
            />
          </button>
          <div className="flex gap-1 justify-between items-center w-full mt-2">
            <div className="flex flex-row justify-center items-center w-full">
              <div className="relative w-1/2 bg-[#02227E] rounded-xl">
                <SelectBox_
                  onChange={(e) => {
                    setFromTime(e.target.value);
                  }}
                  options={times}
                  className={
                    "rounded-r-none bg-inherit pl-2 appearance-none rounded-xl bg-[#02227E] text-[18px] text-[#fff] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[45px]"
                  }
                />
                <div className="absolute top-2 right-1">
                  <svg
                    className={`w-6 h-6 fill-current text-white mt-1`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
              <div className="relative w-1/2 bg-[#02227E] rounded-xl">
                <SelectBox_
                  onChange={(e) => setFromZone(` ${e.target.value}`)}
                  options={zones}
                  className={
                    "border-l-0 rounded-l-none bg-inherit pl-2 appearance-none rounded-xl bg-[#02227E] text-[18px] text-[#fff] font-bold px-0 max-[350px]:pr-2 pr-2 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[45px]"
                  }
                />
                <div className="absolute top-2 right-1">
                  <svg
                    className={`w-6 h-6 fill-current text-white mt-1`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
            <span className="text-[24px] text-[#fff] font-bold">to</span>
            <div className="flex flex-row justify-center items-center w-full h-[52px]">
              <div className="relative w-1/2 bg-[#02227E] rounded-xl">
                <SelectBox_
                  onChange={(e) => {
                    setToTime(e.target.value);
                  }}
                  options={times}
                  className={
                    "rounded-r-none pl-2 bg-inherit appearance-none rounded-xl bg-[#02227E] text-[18px] text-[#fff] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[45px]"
                  }
                />
                <div className="absolute top-2 right-1">
                  <svg
                    className={`w-6 h-6 fill-current text-white mt-1`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>

              <div className="relative w-1/2 bg-[#02227E] rounded-xl">
                <SelectBox_
                  onChange={(e) => setToZone(` ${e.target.value}`)}
                  options={zones}
                  className={
                    "border-l-0 rounded-l-none pl-2 bg-inherit appearance-none rounded-xl bg-[#02227E] text-[18px] text-[#fff] font-bold px-0 max-[350px]:pr-2 pr-2 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[45px]"
                  }
                />
                <div className="absolute top-2 right-1">
                  <svg
                    className={`w-6 h-6 fill-current text-white mt-1`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pb-2 mt-2">
            <p className="text-[24px] font-bold text-[#fff] pl-0">
              Price offered
            </p>
            <p className="text-[24px] font-bold text-[#fff] py-0">
              $
              <input
                className="w-[75px] placeholder:text-white focus:ring-0 !outline-none border-2  bg-[#3760cb00] ml-2 px-2"
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
              className="w-full text-[18px] text-[#01195C] h-[115px] bg-[#D9D9D9] rounded-none border-2 px-2 border-white"
              bgColor={"#D9D9D9"}
              onChange={(e) => setSpecialty(e.target.value)}
              value={specialty}
            />
          </div>
          <div className="mt-1 mb-0 flex justify-center items-center">
            <div className="">
              <Button
                className={
                  "flex items-center px-[35px] py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[25px]"
                }
                text={
                  !isLoading ? (
                    "Submit"
                  ) : (
                    <div className="flex items-center	justify-center pt-[6px]">
                      <Loading />
                    </div>
                  )
                }
                size="44px"
                onClick={Invitations}
              />
            </div>
          </div>
          <br />
        </Modal>
      </div>
      <Modal
        isOpen={system}
        onRequestClose={closeSyatem}
        className=" w-[360px] center-modal bg-[#316AFF] relative rounded-2xl px-4 py-3"
      >
        <button
          onClick={() => setSystem(false)}
          className="absolute top-2 right-2"
        >
          <img
            src="/images/Mask group-close.png"
            alt=""
            width="30px"
            height="30px"
          />
        </button>
        <p className="max-w-full text-[24px] font-bold text-center text-[#fff] mt-8">
          System has found{" "}
          <span className="text-[#FFC020]">
            {sendInvitations?.result?.length}
          </span>{" "}
          Matching result do you want to send invitation?
        </p>
        <div className="flex justify-around items-center w-full">
          <div className="w-[40%]">
            <Button
              onClick={() => {
                favoriteStatus ? setUpdate(true) : HandleSubmit();
              }}
              className={
                "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
              }
              text={"Yes"}
              size="45px"
              disabled={sendInvitations?.result?.length === 0}
            />
          </div>
          <div className="w-[40%]">
            <Button
              className={
                "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
              }
              text={"No"}
              size="45px"
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
        className=" w-[360px] bg-[#3760CB] overflow-auto relative center-modal rounded-2xl"
      >
        <button
          onClick={() => setsearchOpen(false)}
          className="absolute top-3 right-3"
        >
          <img
            src="/images/Mask group-close.png"
            alt=""
            width="30px"
            height="30px"
          />
        </button>
        <div className="flex items-center justify-start py-2 px-10">
          <p className="text-[12px] font-bold bg-[#D9D9D9] rounded-full h-[75px] w-[75px] flex justify-center items-center text-center leading-normal">
            Marketplace Icon
          </p>
          <p className="text-[30px] font-semibold text-[#fff] ml-3">
            {AllData.service}
          </p>
        </div>
        <div className="bg-[#01195C] h-[11px] w-full"></div>
        <div className="px-10 grid grid-cols-2">
          <div className="w-fit pt-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/Mask group-3.png"
                alt=""
                width="16px"
                height="17.1px"
              />
              <p className="text-[16px] font-semibold text-[#CFCFCF] py-1 pl-0">
                Type
              </p>
            </div>
            <p className="text-[16px] font-bold text-[#fff] pt-px pl-0">
              {AllData.type}
            </p>
          </div>
          <div className="w-fit pt-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/Mask group-3.png"
                alt=""
                width="16px"
                height="17.1px"
              />
              <p className="text-[16px] font-semibold text-[#CFCFCF] py-1 pl-0">
                Location
              </p>
            </div>
            <p className="text-[16px] font-bold text-[#fff] pt-px pl-0">
              {AllData.location}
            </p>
          </div>
          <div className="w-fit pt-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/Mask group-3.png"
                alt=""
                width="16px"
                height="17.1px"
              />
              <p className="text-[16px] font-semibold text-[#CFCFCF] py-1 pl-0">
                Sex
              </p>
            </div>
            <p className="text-[16px] font-bold text-[#fff] pt-px pl-0">
              {AllData.gender}
            </p>
          </div>
          <div className="w-fit pt-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/Mask group-3.png"
                alt=""
                width="16px"
                height="17.1px"
              />
              <p className="text-[16px] font-semibold text-[#CFCFCF] py-1 pl-0">
                Orientation
              </p>
            </div>
            <p className="text-[16px] font-bold text-[#fff] pt-px pl-0">
              {AllData.orientation}
            </p>
          </div>
          <div className="w-fit pt-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/Mask group-3.png"
                alt=""
                width="16px"
                height="17.1px"
              />
              <p className="text-[16px] font-semibold text-[#CFCFCF] py-1 pl-0">
                Venue
              </p>
            </div>
            <p className="text-[16px] font-bold text-[#fff] pt-px pl-0">
              {AllData.venue}
            </p>
          </div>
          <div className="w-fit pt-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/Mask group-3.png"
                alt=""
                width="16px"
                height="17.1px"
              />
              <p className="text-[16px] font-semibold text-[#CFCFCF] py-1 pl-0">
                Inquiry
              </p>
            </div>
            <p className="text-[16px] font-bold text-[#fff] pt-px pl-0">
              {AllData.inquiry}
            </p>
          </div>
          <div className="w-fit pt-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/Mask group-3.png"
                alt=""
                width="16px"
                height="17.1px"
              />
              <p className="text-[16px] font-semibold text-[#CFCFCF] py-1 pl-0">
                Service
              </p>
            </div>
            <p className="text-[16px] font-bold text-[#fff] pt-px pl-0">
              {AllData.service}
            </p>
          </div>
        </div>
        <div className="w-fit pt-5 px-10">
          <div className="flex items-center gap-3">
            <img
              src="/images/Mask group-3.png"
              alt=""
              width="16px"
              height="17.1px"
            />
            <p className="text-[16px] font-semibold text-[#CFCFCF] py-1 pl-0">
              Sensual Services
            </p>
          </div>
          <p className="text-[16px] font-black text-[#fff] pt-px pl-0">
            {AllData?.advancedservices
              ? AllData.advancedservices.join(", ")
              : ""}
          </p>
        </div>
        {AllData.favoriteStatus && AllData.inquiry !== "Invitation" && (
          <div className="flex flex-col items-center px-10 pt-7">
            <p className="text-[20px] text-[#fff] font-bold mb-1 pl-0 w-max-none">
              Name the Search/invitation
            </p>
            <InputText
              size="39px"
              className="text-[24px] font-semibold text-[#01195C] h-[39px] bg-[#D9D9D9] rounded-xl border-0 border-[#D9D9D9]"
              border={"#D9D9D9"}
              bgColor={"#D9D9D9"}
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
        <div className="mt-1 pb-3 flex justify-center items-center w-full">
          <div className="">
            <Button
              className={
                "flex items-center px-[35px] py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[20px] shadow-[0px_5px_10px_rgba(0,0,0,0.5)]"
              }
              text={
                !isLoading ? (
                  AllData.favoriteStatus && AllData.inquiry !== "Invitation" ? (
                    "Save To Favorites"
                  ) : (
                    "Submit"
                  )
                ) : (
                  <div className="flex items-center	justify-center pt-[6px]">
                    <Loading />
                  </div>
                )
              }
              size="40px"
              onClick={() =>
                // setUpdate(true)
                SubmitData()
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={update}
        onRequestClose={closeUpdate}
        className=" w-[360px] h-[199px] bg-[#3760CB] relative center-modal rounded-2xl px-4"
      >
        <button
          onClick={() => setUpdate(false)}
          className="absolute top-2 right-2"
        >
          <img
            src="/images/Mask group-close.png"
            alt=""
            width="30px"
            height="30px"
          />
        </button>
        <div className="flex items-center justify-start pt-10 ">
          <p className="text-[12px] font-bold bg-[#D9D9D9] rounded-full h-[73.59px] w-[75px] flex justify-center items-center text-center">
            Marketplace Icon
          </p>
          <p className="text-[20px] font-bold text-center text-[#fff] leading-5">
            Save this search/invitation to favorites Name it something you will
            Remember
          </p>
        </div>
        <div className="flex justify-around items-center w-full gap-5">
          <div className="w-[30%]">
            <Button
              className={
                "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[20px]"
              }
              text={
                !isLoading ? (
                  "Save"
                ) : (
                  <div className="flex items-center	justify-center pt-[6px]">
                    <Loading />
                  </div>
                )
              }
              size="60px"
              onClick={HandleSubmit}
            />
          </div>
          <div className="w-full h-full">
            <InputText
              size="60px"
              className="text-[24px] font-bold text-[#01195C] h-full bg-[#fff] rounded-xl border-2 border-[#02227E] h-[60px]"
              bgColor={"#fff"}
              onChange={(e) => setSearchname(e.target.value)}
              value={searchname}
            />
            {error.name && (
              <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                {error.name}
              </label>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
