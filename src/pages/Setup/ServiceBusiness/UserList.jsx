import { useState, useEffect } from 'react'
import * as React from 'react';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';  
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import StaffService from "../../../services/StaffService";
import { Link } from 'react-router-dom';


const UserList = () => { 

    const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
    const [staffList, setStaffList] = useState();
    const [type, setType] = useState("adminStaff");

    const handleBusinessType = (event) => {
        setType(event.target.value)
        getStaff(event.target.value)
    };

    useEffect(() => {
        getStaff(type)
    },[])

    const getStaff = (typeName) => {
        StaffService.fetchStaff({userId: UserDetails?._id})
          .then((res) => {
            setStaffList(res[typeName]);
          })
          .catch((err) => {
            console.log(err);
          });
      };

    return (
        <div>  
            <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
                <div className='w-full mx-auto flex flex-row justify-center items-start mt-m-5'>
                    <div className='flex flex-col items-center justify-center'>
                        <div><span className='text-[18px] text-[#040C50] font-extrabold'>VAI<span className='text-[18px] text-[#040C50] font-medium'>RIFY ID</span></span></div>
                        <div><span className='text-[15px] text-[#040C50] font-bold'>{UserDetails?.vaiID}</span></div>
                    </div>
                    <div className='w-[120px] relative'>
                        <div style={{left: '0px', bottom: '80px'}} className='absolute w-full h-full rounded-full'>
                            <img 
                              src={
                                UserDetails?.profilePic ? (import.meta.env.VITE_APP_S3_IMAGE + UserDetails?.profilePic) : UserDetails?.gender === "Male"
                                ? "/images/male.png"
                                : "/images/female.png"
                                }
                            // src={
                            //     UserDetails?.profilePic ? (import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL + UserDetails?.profilePic) : UserDetails?.gender === "Male"
                            //     ? "/images/male.png"
                            //     : "/images/female.png"
                            //     }
                                 alt="Sugar" className='rounded-full'/>
                            </div>
                        {/* <div style={{right: '4px', top: '6px'}} className='absolute'><img src={import.meta.env.BASE_URL + 'images/SugarIcon2.png'} alt="Sugar Icon Second" /></div> */}
                    </div>
                    <div>
                        <div><span className='text-[18px] text-[#040C50] font-bold'>TRU<span className='text-[18px] text-[#040C50] font-light'>REVU</span></span></div>
                        <div className='flex flex-row justify-center items-center'>
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 1 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 2 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 3 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 4 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={UserDetails?.averageRating >= 5 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <span className='text-[15px] text-[#040C50] font-bold'>{(UserDetails?.averageRating || 0).toFixed(1)}</span></div>
                    </div>
                </div> 
            </div>

            
            <div className='w-full mx-auto flex flex-col justify-center items-center pt-3 px-3'>
                <span className='font-bold text-[24px]'>Settings</span>
            </div> 

            <div className='w-full mx-auto flex flex-col justify-center items-center pt-3 px-3'>
               
                <FormControl className='bg-[#040c50] text-white rounded-[30px]' sx={{ m: 1, minWidth: 160 }}>
                    <Select  
                    value={type}
                    onChange={handleBusinessType}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ '& .MuiSelect-select': { color: 'white', padding: '10px 0' } }}
                    >  
                        {/* <MenuItem value="businessStaff">Agency Business</MenuItem> */}
                        <MenuItem value="adminStaff">Admin Staff</MenuItem>
                        <MenuItem value="serviceStaff">Service Staff</MenuItem>
                    </Select>    
                </FormControl>
            </div> 

            <div className="w-full mx-auto grid grid-cols-2 gap-0 pt-2 mt-2">
            {staffList?.map((staff,index) => {
                return(
                    <Link to={`/service-business/staff-settings/${staff._id}`}>
                        <div className='min-h-[171px] m-3 rounded-[30px] card bg-[#fff] bg-gradient-to-b from-blue-800 text-center py-2' key={index}>
                            <div className='w-[90px] h-[90px] rounded-full bg-[#fff] overflow-hidden mx-auto flex justify-center'>
                                <img 
                                src={`${import.meta.env.VITE_APP_S3_IMAGE}/${staff.profilePic}`}
                                // src={`${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${staff.profilePic}`}
                                width={'100%'} alt="" />
                            </div>
                            <div className='flex flex-row justify-center items-center'><span className='text-[12px] text-[#040C50] font-bold'>TruRevu</span></div>
                            <div className='flex flex-row justify-center items-center'><span className='text-[14px] text-[#040C50] font-bold'>{staff?.name} / Id# <span>{staff.referralCode}</span></span></div>
                            <div className='flex flex-row justify-center items-center'>
                            <FontAwesomeIcon icon={faStar} color={staff?.averageRating >= 1 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={staff?.averageRating >= 2 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={staff?.averageRating >= 3 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={staff?.averageRating >= 4 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <FontAwesomeIcon icon={faStar} color={staff?.averageRating >= 5 ? "#E1AB3F" : "#111"} className='text-[10px] margin-right-5' />
                            <span className='text-[12px] text-[#040C50] font-bold'>{(staff?.averageRating || 0).toFixed(1)}</span></div>
                        </div>
                    </Link>
                )
            })}
            </div>
        </div>
    )
}
export default UserList;