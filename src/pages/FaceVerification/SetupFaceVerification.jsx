import React, { useEffect } from "react";
import Webcam from "react-webcam";
import DateGuardService from "../../services/DateGuardService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DetectRTC from "detectrtc";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading/Index";
import UserService from "../../services/userServices";
import { HandleUser } from "../../redux/action/Auth";

const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
};

export default function SetupFaceVerification() {
    const webcamRef = React.useRef(null);
    const dispatch = useDispatch();
    const nav = useNavigate();

    const [imgSrc, setImgSrc] = React.useState(null);
    const [hasCamara, setHasCamara] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [faceCompareLoading, setFaceCompareLoading] = React.useState(false);
    const [isApproved, setIsApproved] = React.useState(false);
    const [file, setFile] = React.useState(null);

    const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

    useEffect(() => {
        if (!UserDetails) {
            nav("/login");
            return;
        }
        DetectRTC.load(() => {
            setFaceCompareLoading(true);
            if (!DetectRTC.hasWebcam) {
                setHasCamara(false);
            } else {
                setHasCamara(true);
            }
        });
    }, []);

    const capture = React.useCallback(async () => {
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);

            const userFile = await DateGuardService.dataURLtoFile(
                imageSrc,
                "userFace.jpg"
            );
            setFile(userFile);
            console.log(userFile, " <=== user file..");
        } catch (error) {
            console.log(error, " <=== Error while verifing user face");
        } finally {
            setFaceCompareLoading(true);
            setIsApproved(true);
        }
    }, [webcamRef, setImgSrc]);

    const handelUploadManualSelfie = async () => {
        setIsLoading(true);
        if (file) {
            let data = new FormData();
            data.append("userId", UserDetails._id);
            data.append("image", file);
            await UserService.uploadFaceVerificationImage(data)
                .then(() => {
                    dispatch(HandleUser(UserDetails?._id));
                    toast("Face Verification Completed", {
                        hideProgressBar: true,
                        autoClose: 1000,
                        type: "success",
                    });
                    //   navigate("/setup");
                    nav("/get-vai");
                })
                .catch((err) => {
                    toast(err?.response?.data?.message || "Something went wrong", {
                        type: "error",
                        hideProgressBar: false,
                    });
                });
        } else {
            toast("Please Upload your Face picture", {
                type: "error",
                hideProgressBar: false,
            });
        }
        setIsLoading(false);
    };

    const handleRetry = () => {
        setIsApproved(false);
        setFile(null);
        setImgSrc(null);
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
            <div className="inner-content-part mt-4 ">
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
                    {!faceCompareLoading && <p className="">Please wait...</p>}
                    {faceCompareLoading && !isApproved && (
                        <button
                            disabled={!faceCompareLoading}
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

                    <div className="w-full mt-5">
                        {isApproved && (
                            <div className="flex flex-col items-center">
                                {/* <div className="bg-[#ff0000] rounded-full mb-3">
                                    <img src="/images/close-btn.svg" className="w-[70px]" />
                                </div> */}
                                <button
                                    onClick={handleRetry}
                                    className="bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={handelUploadManualSelfie}
                                    disabled={isLoading}
                                    className="mt-3 bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1"
                                >
                                    {isLoading ? <Loading /> : "Confirm"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
