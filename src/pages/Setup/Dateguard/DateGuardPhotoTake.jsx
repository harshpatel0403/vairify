import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import DateGuardService from '../../../services/DateGuardService';
import Webcam from 'react-webcam';
import DetectRTC from 'detectrtc';

export default function DateGuardPhotoTake() {

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState('')
    const [imgSrc, setImgSrc] = React.useState(null);
    const [hasCamara, setHasCamara] = React.useState(true);
    const [faceCompareLoading, setFaceCompareLoading] = React.useState(false);
    const webcamRef = React.useRef(null);
    const videoConstraints = {
        width: 400,
        height: 400,
        facingMode: "user",
    };

    const params = useParams()
    const navigate = useNavigate()

    const handleClickPhoto = () => {
        const input = document.getElementById("photo-upload");
        input.click();
    }
    const handleChange = (event) => {
        if (!!event.target.files[0]) {
            setFile(event.target.files[0])
            const previewImage = document.getElementById("imagePreview");
            previewImage.src = URL.createObjectURL(event.target.files[0]);
            previewImage.onload = function () {
                URL.revokeObjectURL(previewImage.src);
            }
        }
    }

    const handleSubmit = async () => {
        try {
            if (!file) {
                toast.error('Please upload a file')
                return
            }
            setLoading(true)
            const formData = new FormData
            formData.append('message', message)
            formData.append('groupId', params?.groupId)
            formData.append('appointmentId', params?.appointmentId)
            formData.append('file', file)

            await DateGuardService.uploadProof(formData)
            navigate(`/dateguard/count-up/${params?.appointmentId}/${params?.groupId}`)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        DetectRTC.load(() => {
            if (!DetectRTC.hasWebcam) {
                setHasCamara(false)
            } else {
                setHasCamara(true)
            }
        });
    }, []);

    const capture = React.useCallback(async () => {
        try {
            setFaceCompareLoading(true);
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);

            const userFile = await DateGuardService.dataURLtoFile(
                imageSrc,
                "userFace.jpg"
            );
            setFile(userFile)
        } catch (error) {
            console.log(error, " <=== Error while verifing user face");
        } finally {
            setFaceCompareLoading(false);
        }
    }, [webcamRef, setImgSrc]);

    const handleRetry = () => {
        setFile(null);
        setImgSrc(null);
    }

    if (!hasCamara) {
        return (
            <div className="main-container">
                <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
                    <div className="w-full mx-auto flex items-center justify-center gap-3">
                        <div className="bg-[#ff0000] rounded-full w-[50px]">
                            <img src="/images/close-btn.svg" className="w-full" />
                        </div>
                        <span className="font-bold text-[30px] text-[#05B7FD] change-font-family">
                            Camara not found
                        </span>
                    </div>
                </div>
            </div>
        )
    }
    

    return (
        <div className='main-container form-field-container'>
            <div className='w-full mx-auto flex flex-col justify-center items-center pt-2'>
                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                    <div className='mr-4'><span className='font-bold text-[30px] text-[#4200FF] change-font-family'>Date Guard</span></div>
                    <div className='w-[28px] h-[33px]'><img src={'/images/Mask2.png'} alt="Mark Second Logo" /></div>
                </div>
                <div className='w-full mx-auto flex items-center justify-center mt-9'><span className='font-bold text-[14.4px] change-font-family text-white'>Take a photo</span></div>
                {/* <div className="w-full flex flex-col justify-center items-center mt-5">
                    <div className="w-[178px] h-[160px] flex flex-col justify-start items-center border-[#0247FF] border-2 rounded-lg">
                        <img id="imagePreview" style={{ overflow: 'hidden', width: '100%' }} className="rounded-t-lg" src={"/images/DateGuardPhotoIcon.png"} alt="Date Guard Camera" />
                    </div>
                </div> */}

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

                {(!faceCompareLoading) && (!file) && (
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

                {file && (
                    <div className="flex flex-col items-center mt-4">
                        {/* <div className="bg-[#ff0000] rounded-full mb-3">
                            <img src="/images/close-btn.svg" className="w-[70px]" />
                        </div> */}
                        <button
                            onClick={handleRetry}
                            className="bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]">
                            Retry
                        </button>
                    </div>
                )}

                {/* <div className="relative custom-select-border w-[108px] h-[31px] mt-5">
                    <button className="w-full h-full bg-[#4200FF] rounded-md text-[#D9D9D9] text-[20px] font-bold change-font-family" onClick={handleClickPhoto}>
                        Photos
                    </button>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        name="Choose Image"
                        className="image-file-input w-full"
                        id="photo-upload"
                        capture="environment"
                        onChange={handleChange}
                    />
                </div> */}
                <div className='w-full mx-auto flex flex-col justify-center items-start mt-12 mb-20'>
                    <div className='px-2'><span className='font-bold text-[18px] text-[#D9D9D9] change-font-family'>Message</span></div>
                    <div className='w-full mx-auto flex flex-row justify-center items-center'>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows="3"
                            className="block p-2.5 w-full text-[15px] text-gray-900 rounded-md border-0 focus:ring-blue-500 dark:placeholder-gray-400 bg-[#E2E2E2] focus-visible:border-0 mt-2"
                            placeholder="">
                            {message}
                        </textarea>
                    </div>
                </div>
                <Button
                    disabled={loading || (!imgSrc)}
                    onClick={handleSubmit} text={loading ? 'Loading..' : 'Save'} className={'bg-[#05B7FD] rounded-[10px] text-[20px] font-bold change-font-family'} size="34px"
                />
            </div>
        </div>
    )
}