import React, { useEffect } from "react";
import Webcam from "react-webcam";
import Button from "../../components/Button";
import DateGuardService from "../../services/DateGuardService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import DetectRTC from "detectrtc";
import { useSelector } from "react-redux";
import VaridateService from "../../services/VaridateServices";
import Loading from "../../components/Loading/Index";
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

export default function FaceVerification() {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [faceCompareLoading, setFaceCompareLoading] = React.useState(true);
  const [hasCamara, setHasCamara] = React.useState(true);

  const [isApproved, setIsApproved] = React.useState(null);
  const [payload, setPayload] = React.useState({});

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const [file, setFile] = React.useState(null);

  const nav = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (location?.state) {
      setPayload({ ...location?.state });
    }
  }, [location]);

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
    if (payload?.for === "vaicheck") {
      nav("/vai-now/accept", { state: { ...payload, from: "vai-now" } });
      return;
    }
    if (payload.from === "vai-check") {
      return nav("/varidate/esign-send", {
        state: { ...payload, from: "vai-check" },
      });
    }
    setLoading(true);
    try {
      if (payload.from === "modify") {
        payload.isModified = true;
        payload._id = payload.appointmentId;
      }
      let response;
      if (payload.appointmentId || payload?._id) {
        console.log(payload, " <== I am payload..");
        response = await VaridateService.updateAppointment(
          UserDetails?._id,
          payload.appointmentId || payload?._id,
          payload
        );
        response = payload;
      } else {
        response = await VaridateService.createAppointment({
          data: JSON.stringify(payload),
        });
        response = await DateGuardService.getAppointment(response?._id);
      }
      if (payload.from === "modify") {
        nav("/varidate/esign-send", {
          state: { ...payload, companionId: location?.state?.companionData },
        });
      } else if (payload.from === "vairifyNow") {
        nav("/varidate/esign-send", {
          state: { ...response, from: "vairifyNow" },
        });
      } else if (payload.from === "vai-now") {
        nav("/varidate/esign-send", {
          state: { ...response, from: "vai-now" },
        });
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
    if (payload?.for === "vaicheck") {
      nav("/vai-now/accept", { state: { ...payload, from: "vai-now" } });
      return;
    }
    setLoading(true);
    try {
      const formdata = new FormData();
      if (payload.from === "modify") {
        payload.isModified = true;
        payload._id = payload.appointmentId;
      }
      if (
        payload.from === "vai-check" &&
        !(payload?.appointmentId || payload?._id)
      ) {
        formdata.append(
          "data",
          JSON.stringify({
            ...payload,
            clientId: payload?.clientId?._id,
            companionId: payload?.companionId?._id,
          })
        );
      } else {
        formdata.append("data", JSON.stringify(payload));
      }
      console.log(payload, " <== I am payload..");
      formdata.append("file", file);
      let response;
      if (payload.appointmentId || payload?._id) {
        let response = await VaridateService.updateAppointment(
          UserDetails?._id,
          payload.appointmentId || payload?._id,
          formdata,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log(response);
      } else {
        response = await VaridateService.createAppointment(formdata, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(response);
      }
      if (payload.from === "modify") {
        nav("/varidate/esign-send", { state: payload });
      } else if (payload.from === "vairifyNow") {
        nav("/varidate/esign-send", {
          state: { ...response, from: "vairifyNow", ...payload },
        });
      } else if (payload.from === "vai-now") {
        nav("/varidate/esign-send", { state: payload });
      } else if (payload.from === "vai-check") {
        nav("/varidate/esign-send", { state: { ...response, ...payload } });
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
      <div className="main-containe faceVerificationContainer">
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
          <div className="w-full mx-auto flex items-center justify-center gap-3 flex-col">
            <div className="cameraNotfoundImg">
              <img src="/images/cameraNotFound.png" className="w-full" />
            </div>
            <span className="font-bold text-[30px] text-[#ff1919] change-font-family mb-6">
              Camara not found
            </span>
            {/* <button onClick={handleSendRequest}>accept</button> */}
          </div>
          <p className="text-[18px] max-w-[90%] md:max-w-[70%]">
            You can not use face verification feature on this device, please
            retry in your mobile or a davice which has working camara.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mt-2 bg-[#040C50]/[26%] w-full ">
        <h2 className="font-extrabold py-2 text-[24px] text-[#02227E] font-inter mulish-font-family">
          Face Verification
        </h2>
      </div>
      <div className="inner-content-part mt-4">
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-2 px-4">
          <div className="w-full mx-auto flex items-center justify-center mt-2">
            <div className="flex-1 flex items-center justify-center">
              {imgSrc ? (
                <img src={imgSrc} alt="Date Guard Success Changed Code" />
              ) : (
                <>
                  <Webcam
                    audio={false}
                    height={300}
                    ref={webcamRef}
                    width={300}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                  />
                </>
              )}
            </div>
          </div>
          {!faceCompareLoading && isApproved === null && (
            <button
              disabled={faceCompareLoading}
              onClick={capture}
              className="w-full mx-auto flex items-center justify-center mt-4"
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
                  disabled={loading}
                  className="bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1 "
                >
                  {loading ? <Loading /> : "Send Request"}
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
                  className="bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1"
                >
                  Retry
                </button>
                <button
                  onClick={handleManualSelfie}
                  disabled={loading}
                  className="mt-3 bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1"
                >
                  {loading ? <Loading /> : "Send as Manual"}
                </button>
              </div>
            )}
          </div>

          {/* <div className='w-full mx-auto flex items-center justify-center mt-2'><span className='font-bold text-[28px] text-[#05B7FD] change-font-family'>Codes Successfully Changed</span></div> */}
        </div>
      </div>
    </div>
  );
}
