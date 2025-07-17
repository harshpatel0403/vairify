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
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: isMobile ? { exact: "environment" } : "user",
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
        toast.error(Qrtext);
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
      <div className="container py-[48px]">
        <div className="w-full mx-auto flex flex-col justify-center items-center sm:gap-[48px] gap-[24px]">
          <h6 className="text-[28px] text-center font-semibold text-white ">Camera not found</h6>
          <img src="/images/face-verification/camera-not-found.svg" alt="camera not found" />
          {/* <button onClick={handleSendRequest}>accept</button> */}
          <p className="text-[18px] max-w-[90%] md:max-w-[70%] text-center font-medium text-[#E43530]">
            You can not use face verification feature on this device, please
            retry in your mobile or a device which has working camara.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mb-[48px]">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Scan Vai Now QR"} isSmall={true} />
      </div>
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full mx-auto flex items-center justify-center mb-[48px]">
          <div className="flex-1 flex items-center justify-center max-w-[400px]">
            {imgSrc ? (
              <img src={imgSrc} alt="Date Guard Success Changed Code" className="rounded-[16px]" />
            ) : (
              <div className="relative">
                <Webcam
                  audio={false}
                  height={400}
                  ref={webcamRef}
                  width={400}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="rounded-[16px] w-full max-w-[400]"
                  style={{ transform: "scaleX(-1)" }}

                />
                <img src="/images/face-verification/camera-vector.svg" className="left-[5%] top-[5%] absolute z-[100]" />
                <img src="/images/face-verification/camera-vector.svg" className="right-[5%] top-[5%] absolute z-[100] rotate-[90deg]" />
                <img src="/images/face-verification/camera-vector.svg" className="left-[5%] bottom-[5%] absolute z-[100] rotate-[-90deg]" />
                <img src="/images/face-verification/camera-vector.svg" className="right-[5%] bottom-[5%] absolute z-[100]  rotate-[-180deg]" />
              </div>
            )}
          </div>
        </div>
        {false && !faceCompareLoading && isApproved === null && (
          <button
            disabled={faceCompareLoading}
            onClick={capture}
            className="mx-auto flex items-center justify-center mt-[-34px] relative z-[100] h-[64px] w-[64px] p-2 rounded-full bg-white"
          >
            <img src="/images/face-verification/camera.svg" alt="camera img" />
          </button>
        )}
        {faceCompareLoading && <p className="text-white text-base text-center">Please wait...</p>}
        {false && imgSrc && (
          <div className="mt-3 flex gap-3 w-full ">
            <Button
              disabled={loading}
              text={loading ? <div className="flex items-center	justify-center">
                <Loading />
              </div> : "Approve"}
              onClick={handleApprove}
            />
            <Button
              text={"Reject"}
              className={'secondary-btn !bg-[#FFFFFF29]'}
              onClick={handleReject}
            />
          </div>
        )}

        <div className="w-full mt-2">
          {isApproved === true && (
            <div className="flex flex-col items-center">
              <img src="/images/marketplace/verified.svg" className="w-[30px] mb-3" />
              <Button
                onClick={handleSendRequest}
                text={'Send Request'}
                className={'max-w-[500px] mx-auto w-full'}
              />
            </div>
          )}

          {isApproved === false && (
            <div className="flex flex-col items-center">
              <div className="bg-[#ff0000] rounded-full mb-3">
                <img src="/images/close-btn.svg" className="w-[30px]" />
              </div>
              <Button
                onClick={handleRetry}
                text={'Retry'}
                className={'max-w-[500px] px-4 w-full mx-auto'}
              />
              <Button
                onClick={handleManualSelfie}
                text='Send as Manual'
                className={'max-w-[500px] px-4 w-full mx-auto mt-3 !bg-[#FFFFFF29] secondary-btn'}
              />
            </div>
          )}
        </div>

        {/* <div className='w-full mx-auto flex items-center justify-center mt-2'><span className='font-bold text-[28px] text-[#05B7FD] change-font-family'>Codes Successfully Changed</span></div> */}
      </div>
    </div>
  );
}
