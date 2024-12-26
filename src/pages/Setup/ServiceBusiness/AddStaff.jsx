import React, { useState } from 'react';
import Button from '../../../components/Button';
import InputText from '../../../components/InputText';
import { useSelector } from 'react-redux';
import StaffService from "../../../services/StaffService";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../../components/Loading/Index';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function AddStaff() {
    const navigate = useNavigate();

    const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
    const fileInputRef = React.useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const [staff, setStaff] = useState({
        email: "",
        name: "",
        userType: "",
        userProfilePic: null,
        description: "",
        userId: UserDetails._id
    })

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleChange("userProfilePic", file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = (name, value) => {
        setError((prevError) => ({
            ...prevError,
            [name]: '',
        }));

        setStaff({ ...staff, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        let formData = new FormData();
        const validationErrors = {};
        const checkEmail = {};

        if (!staff.email) {
            validationErrors.email = "Email is required";
        }

        if (!staff.name) {
            validationErrors.name = "Name is required";
        }

        if (!staff.userType) {
            validationErrors.userType = "User type is required";
        }
        if (!staff.userProfilePic) {
            validationErrors.userProfilePic = "userProfilePic is required";
        }
        if (!staff.description) {
            validationErrors.description = "Description is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            setIsLoading(false);
            return;
        }

        setError({});

        formData.append('userProfilePic', staff?.userProfilePic)
        formData.append('email', staff?.email)
        formData.append('name', staff?.name)
        formData.append('userType', staff?.userType)
        formData.append('userId', staff?.userId)
        formData.append('description', staff?.description)
        StaffService.createStaff(formData)
            .then((res) => {
                navigate("/service-business/user-list");
                toast("create a staff successfully", {
                    hideProgressBar: true,
                    autoClose: 1000,
                    type: "success",
                });
            })
            .catch((err) => {
                toast(err?.response?.data?.data, {
                    hideProgressBar: true,
                    autoClose: 1000,
                    type: "error",
                });
            }).finally(() => {
                setIsLoading(false)
            });
    }




    return (
        <div className='main-container px-0 '>
            <div className='w-full mx-auto flex flex-col justify-center items-center'>


                <div className='w-full mx-auto flex flex-row justify-between items-start mt-2 px-[25px]'>
                    <div className='flex flex-col items-center justify-center'>
                        <div><span className='text-[18px] text-[#040C50] font-extrabold'>VAI<span className='text-[18px] text-[#040C50] font-semibold'>RIFY ID</span></span></div>
                        <div><span className='text-[15px] text-[#040C50] font-bold'>{UserDetails?.vaiID}</span></div>
                    </div>
                    <div className='w-[120px] relative'>
                        <div style={{ left: '10px', bottom: '65px' }} className='absolute w-full h-full rounded-full'>
                            <div className='w-[110px] h-[110px] border-2 rounded-full overflow-hidden'>
                                <img
                                    // src={
                                    //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                                    //   `/${appointment?.[ userType === 'client-hobbyist' ? 'companionId' : 'clientId']?.profilePic}`
                                    // }
                                    src={
                                        UserDetails?.profilePic ? (import.meta.env.VITE_APP_S3_IMAGE + UserDetails?.profilePic) : UserDetails?.gender === "Male"
                                            ? "/images/male.png"
                                            : "/images/female.png"
                                    }
                                    // src={
                                    //     UserDetails?.profilePic ? (import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL + UserDetails?.profilePic) : UserDetails?.gender === "Male"
                                    //         ? "/images/male.png"
                                    //         : "/images/female.png"
                                    // }
                                    alt="Intimate Massage"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div><span className='text-[18px] text-[#040C50] change-font-family'>TruRevu</span></div>
                        <div className='flex flex-row justify-center items-center'>
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 1 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 2 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 3 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 4 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 5 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <span className='text-[15px] text-[#040C50] font-bold'>{(UserDetails?.averageRating || 0).toFixed(1)}</span></div>
                    </div>
                </div>


                {/* <div className="mt-3 flex flex-col justify-center items-center relative bottom-3">
                    <div>
                        <img
                            src={"/images/varify_logo.png"}
                            alt="Varify Logo"
                            className="mt-5"
                        />
                    </div>
                </div> */}
                <div className='w-full mx-auto flex flex-row justify-baseline items-center mt-5'>
                    <div className='flex items-center justify-center px-[15px]'><span className='font-bold text-[15px]'>Enter Email</span></div>
                    <div className='table items-center justify-center px-[15px]'>
                        <InputText
                            className="rounded-md h-[26px] mb-2 bg-white"
                            placeholder="Email"
                            size="35px"
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                        {error.email && (
                            <label className="text-red-500 text-lg flex items-baseline">
                                {error.email}
                            </label>
                        )}
                    </div>
                </div>

                <div className='w-full mx-auto flex flex-row justify-baseline items-center mt-5'>
                    <div className='flex items-center justify-center px-[15px]'><span className='font-bold text-[15px]'>Enter Name</span></div>
                    <div className='table items-center justify-center px-[15px]'>
                        <InputText
                            className="rounded-md h-[26px] mb-2 bg-white"
                            placeholder="Name"
                            size="35px"
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                        {error.name && (
                            <label className="text-red-500 text-lg flex items-baseline">
                                {error.name}
                            </label>
                        )}
                    </div>
                </div>

                <div className='max-w-[350px] w-full mx-auto flex flex-row justify-around items-center flex-wrap-nowrap mt-4'>
                    <div className='max-w-[230px] w-[100%] pr-2 option-selected' ><Button onClick={() => handleChange("userType", "admin")} text="Administrative" className={`font-semobold text-[16px] text-white ${staff?.userType === "admin" ? 'bg-gradient-to-b from-[#6db268] to-[#6db268] border-[3px] border-[#fff]' : 'bg-gradient-to-b from-[#02227E] to-[#0247FF]'} rounded-md px-1`} /></div>
                    <div className='max-w-[230px] w-[100%] pl-2 option-selected' ><Button onClick={() => handleChange("userType", "staff")} text="Service" className={`font-semobold text-[16px] text-white ${staff?.userType === "staff" ? 'bg-gradient-to-b from-[#6db268] to-[#6db268] border-[3px] border-[#fff]' : 'bg-gradient-to-b from-[#02227E] to-[#0247FF]'} rounded-md px-1`} /></div>
                </div>
                {error.userType && (
                    <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                        {error.userType}
                    </label>
                )}
                <div className="w-full max-w-[250px] flex flex-col justify-center items-center image-upload-data px-4 mt-8 mb-5">
                    <div className="overflow-hidden bg-gradient-to-b from-blue-400 flex flex-col justify-center items-center w-[140px] h-[130px] image-upload-box">
                        {staff?.userProfilePic ? (
                            <img
                                src={imagePreview} className='object-cover w-[140px] h-[auto] min-h-[100%]'
                                alt="Selected Image"
                            />
                        ) : (
                            <>
                                <img
                                    id="imagePreview"
                                    style={{ overflow: "hidden" }}
                                    className="w-[68px] h-[56px] mt-5"
                                    src={"/images/VectorCamera.png"}
                                    alt="Vector Camera" width={'88px'} height={'73px'}
                                />
                                <p className="mt-2 text-[14px] font-bold">Photos</p>
                            </>
                        )}
                    </div>
                    {error.userProfilePic && (
                        <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                            {error.userProfilePic}
                        </label>
                    )}
                    <div className="custom-select-border px-4">
                        <button onClick={handleBrowseClick} className="photo-upload-btn text-white text-[20px] font-extrabold" >
                            Browse
                        </button>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            name="Choose Image"
                            className="image-file-input"
                            id="photo-upload"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileInputChange}
                        />
                    </div>


                    <div className="flex flex-row justify-between items-center px-5">
                        <Button
                            className={
                                "px-5 flex items-center justify-center bg-gradient-to-b from-[#0247FF] to-[#0247FF] text-[#fff] font-bold text-[18px] py-0 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] mt-3"
                            }
                            size="35px"
                            text="Browse" />
                    </div>
                </div>


                <div className='max-w-[350px] w-full mx-auto flex flex-col justify-around flex-wrap-nowrap mt-2'>
                    <div className='flex items-left justify-left mb-2'><span className='font-bold text-[18px]'>Description</span></div>
                    <textarea
                        className="w-full bg-[#fff] text-left font-[500] p-[10px]"
                        rows={4}
                        placeholder="enter description"
                        onChange={(e) => handleChange("description", e.target.value)}
                    ></textarea>
                    {error.description && (
                        <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                            {error.description}
                        </label>
                    )}
                </div>

                <div className="flex flex-row justify-between items-center px-5">
                    {!isLoading ? (
                        <Button
                            className={
                                "mb-5 px-5 flex items-center justify-center bg-gradient-to-b from-[#02227E] to-[#0247FF] text-[#fff] font-bold text-[18px] py-0 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] mt-7"
                            }
                            onClick={handleSubmit}
                            type='submit'
                            size={"40px"}
                            text="Add Staff" />
                    ) : (
                        <div className="flex items-center justify-center pt-[6px]">
                            <Loading />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}