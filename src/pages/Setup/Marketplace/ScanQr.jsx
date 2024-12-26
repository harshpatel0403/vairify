import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import DetectRTC from "detectrtc";
import { useDispatch, useSelector } from "react-redux";
import VaridateService from "../../../services/VaridateServices";
import { BrowserQRCodeReader } from "@zxing/library";
import { HandleSearchWithVaiId } from "../../../redux/action/MarketplaceSearch";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

export default function SearchScanQR() {
  const webcamRef = React.useRef(null);
  const codeReader = new BrowserQRCodeReader();

  const [result, setResult] = useState(null);

  const [imgSrc, setImgSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [faceCompareLoading, setFaceCompareLoading] = React.useState(true);
  const [hasCamara, setHasCamara] = React.useState(true);

  const [isApproved, setIsApproved] = React.useState(null);
  const [payload, setPayload] = React.useState({});

  const navigate = useNavigate();

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const user_type = UserDetails?.user_type;

  const [file, setFile] = React.useState(null);

  const nav = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  useEffect(() => {
    if (location?.state) {
      setPayload({ ...location?.state });
    }
  }, [location]);

  const handleRefresh = () => {
    window.location.reload(); // This line refreshes the page
  };

  const capture = React.useCallback(async () => {
    try {
      setFaceCompareLoading(true);
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);

      const userFile = await DateGuardService.dataURLtoFile(
        imageSrc,
        "userFace.jpg"
      );
      setFile(userFile);
      console.log(userFile, " <=== user file..");
      const data = new FormData();
      data.append("file", userFile);
      const resp = await DateGuardService.verifyUserFace(UserDetails._id, data);
      console.log(resp, " <=== I am user verify api call response");
      handleApprove();
    } catch (error) {
      console.log(error, " <=== Error while verifing user face");
      handleReject();
    } finally {
      setFaceCompareLoading(false);
    }
  }, [webcamRef, setImgSrc]);

  useEffect(() => {
    if (!UserDetails) {
      nav("/login");
      return;
    }
    setFaceCompareLoading(true);
    DetectRTC.load(() => {
      setFaceCompareLoading(false);
      if (!DetectRTC.hasWebcam) {
        setHasCamara(false);
        handleReject();
      } else {
        setHasCamara(true);
      }
    });

    // if(user_type !== 'client-hobbyist') {
    //   toast.error('You do not have permission to visit that page.')
    //   navigate('/marketplace')
    // }
  }, []);

  const scanQRCode = async () => {
    if (webcamRef.current) {
      try {
        const videoElement = webcamRef.current.video;
        const codeResult = await codeReader.decodeFromVideoElement(
          videoElement
        );
        var Qrtext = codeResult?.getText();
        // const userDetails = await VaridateService.fetchMarketPlaceUserDetails(Qrtext)
        Qrtext = Qrtext.split("/");
        Qrtext = [Qrtext.length - 1];
        dispatch(HandleSearchWithVaiId(Qrtext))
          .then((res) => {
            if (res?.payload?.result?.length) {
              navigate("/user/profile", {
                state: {
                  item: res?.payload?.result?.[0]?.profile,
                  market: true,
                },
              });
            } else {
              toast.error("Invalid vaiID!");
              handleRefresh();
            }
          })
          .catch((error) => {
            toast.error("Something went wrong!");
            console.log(error);
            handleRefresh();
          });
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.error || error.message);
        nav(-1);
      }
      // scanQRCode()
    }
  };

  useEffect(() => {
    scanQRCode();
  }, []);

  const handleApprove = async () => {
    setLoading(true);
    try {
      //   TODO: implement api call here..
      setIsApproved(true);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      if (payload.from === "modify") {
        payload.isModified = true;
        payload._id = payload.appointmentId;
      }
      if (payload.appointmentId) {
        console.log(payload, " <== I am payload..");
        let response = await VaridateService.updateAppointment(
          UserDetails?._id,
          payload.appointmentId,
          payload
        );
        console.log(response);
      } else {
        let response = await VaridateService.createAppointment({
          data: JSON.stringify(payload),
        });
        console.log(response);
      }
      if (payload.from === "modify") {
        nav("/varidate/esign-send", { state: payload });
      } else {
        nav("/varidate/invitations-list");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSelfie = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      if (payload.from === "modify") {
        payload.isModified = true;
        payload._id = payload.appointmentId;
      }
      console.log(payload, " <== I am payload..");
      formdata.append("data", JSON.stringify(payload));
      formdata.append("file", file);
      if (payload.appointmentId) {
        let response = await VaridateService.updateAppointment(
          UserDetails?._id,
          payload.appointmentId,
          formdata,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log(response);
      } else {
        let response = await VaridateService.createAppointment(formdata, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(response);
      }
      if (payload.from === "modify") {
        nav("/varidate/esign-send", { state: payload });
      } else {
        nav("/varidate/invitations-list");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setIsApproved(null);
    setFile(null);
    setImgSrc(null);
  };

  const handleReject = () => {
    // TODO: handle reject case
    setIsApproved(false);
    // nav("/dateguard/password-input");
  };

  if (!hasCamara) {
    return (
      <div className="main-container">
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
          <div className="w-full mx-auto flex items-center justify-center gap-3">
            <div className="bg-[#ff0000] rounded-full w-[50px]">
              <img src="/images/close-btn.svg" className="w-full" />
            </div>
            <span className="font-bold text-[30px] text-[#000] change-font-family">
              Camara not found
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex items-center justify-center">
          <span className="font-bold text-[30px] text-[#000] change-font-family">
            Scan Vai Now QR
          </span>
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-2">
          <div className="flex-1 flex items-center justify-center">
            {imgSrc ? (
              <img src={imgSrc} alt="Date Guard Success Changed Code" />
            ) : (
              <>
                <Webcam
                  audio={false}
                  height={400}
                  ref={webcamRef}
                  width={400}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </>
            )}
          </div>
        </div>
        {false && !faceCompareLoading && isApproved === null && (
          <button
            disabled={faceCompareLoading}
            onClick={capture}
            className="w-full mx-auto flex items-center justify-center mt-10"
          >
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-[#2096f3] items-center justify-center flex rounded-full w-[80px] h-[80px]">
                <img
                  src={"/images/DateGuardCamera.png"}
                  className="w-[50px]"
                  alt="Verification Success Mark Icon"
                />
              </div>
            </div>
          </button>
        )}
        {faceCompareLoading && <p className="">Please wait...</p>}
        {false && imgSrc && (
          <div className="mt-3 flex gap-3">
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Approve"}
              className="bg-[#05B7FD] rounded-[10px] font-bold text-[30px] h-[41px] flex items-center justify-center change-font-family px-10"
              size="41px"
              onClick={handleApprove}
            />
            <Button
              disabled={loading}
              text={"Reject"}
              className="bg-[#05B7FD] rounded-[10px] font-bold text-[30px] h-[41px] flex items-center justify-center change-font-family px-10"
              size="41px"
              onClick={handleReject}
            />
          </div>
        )}

        <div className="w-full mt-3">
          {isApproved === true && (
            <div className="flex flex-col items-center">
              <img src="/images/CheckMark.png" className="w-[70px] mb-3" />
              <button
                onClick={handleSendRequest}
                className="bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
              >
                Send Request
              </button>
            </div>
          )}

          {isApproved === false && (
            <div className="flex flex-col items-center">
              <div className="bg-[#ff0000] rounded-full mb-3">
                <img src="/images/close-btn.svg" className="w-[70px]" />
              </div>
              <button
                onClick={handleRetry}
                className="bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
              >
                Retry
              </button>
              <button
                onClick={handleManualSelfie}
                className="mt-3 bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
              >
                Send as Manual
              </button>
            </div>
          )}
        </div>

        {/* <div className='w-full mx-auto flex items-center justify-center mt-2'><span className='font-bold text-[28px] text-[#05B7FD] change-font-family'>Codes Successfully Changed</span></div> */}
      </div>
    </div>
  );
}
