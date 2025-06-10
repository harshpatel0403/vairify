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
                toast(err?.response?.data?.error, {
                    hideProgressBar: true,
                    autoClose: 1000,
                    type: "error",
                });
            }).finally(() => {
                setIsLoading(false)
            });
    }




    return (
        <div className='container'>
            <div className='w-full mx-auto '>
                <div className="text-center md:my-[48px] mt-[-34px] mb-[24px]  text-[28px] text-white font-semibold">
                    Add Staff
                </div>

                <div className='flex justify-between items-start mt-5 gap-4'>
                    <div className='w-1/2'>
                        <InputText
                            className="w-full rounded-md border-[2px] border-[#919EAB33] mb-2 py-[20px]"
                            placeholder="Enter Email"
                            size="35px"
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                        {error.email && (
                            <label className="text-red-500 text-lg flex items-baseline">
                                {error.email}
                            </label>
                        )}
                    </div>

                    <div className='w-1/2'>
                        <InputText
                            className="w-full rounded-md border-[2px] border-[#919EAB33] mb-2 py-[20px]"
                            placeholder="Enter Name"
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


                <div className="text-left mt-[20px] sm:text-[20px] text-lg text-white font-medium">
                    Select Staff
                </div>


                <div className="text-left text-[16px] text-white font-[400] flex flex-row gap-[5%] mt-[10px]">
                    <label class="flex items-center gap-[10px]">
                        <input
                            id="default-radio-1"
                            type="radio"
                            value="Incall"
                            name="default-radio"
                            class="peer hidden"
                            checked={staff?.userType === "admin"}
                            onChange={() => handleChange("userType", "admin")}
                        />
                        <div class="w-5 h-5 rounded-full border-2 border-white peer-checked:after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-transparent peer-checked:after:bg-[#ffffff] after:mx-auto after:my-auto after:mt-[3px]"></div>
                        <span className="text-base font-normal text-white">Administrative</span>
                    </label>

                    <label class="flex items-center gap-[10px]">
                        <input
                            id="default-radio-2"
                            type="radio"
                            name="default-radio"
                            class="peer hidden"
                            checked={staff?.userType === "staff"}
                            onChange={() => handleChange("userType", "staff")}
                        />
                        <div class="w-5 h-5 rounded-full border-2 border-white peer-checked:after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-transparent peer-checked:after:bg-[#ffffff] after:mx-auto after:my-auto after:mt-[3px]"></div>
                        <span className="text-base font-normal text-white">Service</span>
                    </label>
                </div>
                {error.userType && (
                    <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                        {error.userType}
                    </label>
                )}

                <div className="w-full flex flex-col justify-center items-center image-upload-data mt-8 mb-5">
                    <div className="overflow-hidden bg-gradient-to-b from-blue-400 flex flex-col p-[30px] justify-center items-center w-full text-white image-upload-box font-[400] text-[14px]">
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
                                    className="w-[56px] h-[56px]"
                                    src={"/images/upload_icon.svg"}
                                    alt="Vector Camera" width={'88px'} height={'73px'}
                                />
                                <p className="mt-2 text-[14px]">Upload file here</p>
                                <p className="mt-2 text-[14px] underline" onClick={handleBrowseClick}>Browse</p>
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
                </div>


                <div className='w-full mx-auto flex flex-col justify-around flex-wrap-nowrap mt-2 text-white'>
                    <textarea
                        className="w-full !bg-[#9b9a9a0a] text-left font-[500] p-[10px] border-[2px] border-[#919EAB33] rounded-md !placeholder-white"
                        rows={4}
                        placeholder="Description"
                        onChange={(e) => handleChange("description", e.target.value)}
                    ></textarea>
                    {error.description && (
                        <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                            {error.description}
                        </label>
                    )}
                </div>

                <div className=" max-w-[500px] mx-auto w-full mt-[24px] mb-[48px]">
                    <Button
                        text={
                            !isLoading ? (
                                "Add Staff"
                            ) : (
                                <div className="flex items-center justify-center pt-[6px]">
                                    <Loading />
                                </div>
                            )
                        }
                        disabled={isLoading}
                        onClick={handleSubmit}
                    />
                </div>

            </div>
        </div>
    );
}