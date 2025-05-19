import { useState, useEffect } from 'react'
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import StaffService from "../../../services/StaffService";
import { Link } from 'react-router-dom';
import Selecter from '../../../components/Selecter/Selecter';
import Footer from '../../layout/Footer';
import Loading from '../../../components/Loading/Index';
import PageTitle from '../../../components/PageTitle';


const UserList = () => {

    const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
    const [staffList, setStaffList] = useState();
    const [searchParams] = useSearchParams();
    const initialType = searchParams.get('type') || 'adminStaff';
    const [type, setType] = useState(initialType);
    const [loading, setLoading] = useState(false);
    const handleBusinessType = (event) => {
        setType(event.target.value)
        getStaff(event.target.value)
    };

    useEffect(() => {
        getStaff(type)
    }, [])

    const getStaff = async (typeName) => {
        setLoading(true);
        await StaffService.fetchStaff({ userId: UserDetails?._id })
            .then((res) => {
                setStaffList(res[typeName]);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            })
    };

    if (loading) {
        return (
            <div className="flex justify-center align-center items-center h-[62vh]">
                <Loading />
            </div>
        )
    }
    else {
        return (
            <div className='container'>
                <div className='min-h-[calc(100vh-350px)]'>
                    <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                        <PageTitle title={type === "adminStaff" ? "Admin Permission" : "Staff Permission"} isSmall={true} />
                    </div>
                    {/* <div className="text-center md:my-[48px] mt-[-34px] mb-[24px] text-[28px] text-white font-semibold flex justify-between">
                    <span></span>
                    <span></span>
                    <span className='font-bold text-[24px] text-white'>{type === "adminStaff" ? "Admin Permission" : "Staff Permission"}</span>
                    <FormControl className='bg-[#040c50] text-white rounded-[30px]' sx={{ minWidth: 160 }}>
                        <Select
                            value={type}
                            onChange={handleBusinessType}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            sx={{ '& .MuiSelect-select': { color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', backgroundColor: '#FFFFFF14', padding: '5px' } }}
                        >
                            <MenuItem value="adminStaff">Admin Staff</MenuItem>
                            <MenuItem value="serviceStaff">Service Staff</MenuItem>
                        </Select>
                    </FormControl>
                </div> */}
                    {staffList?.length > 0 ?
                        <div className="grid md:grid-cols-2 gap-[24px] mt-[70px] sm:mt-0">
                            {staffList?.map((staff, index) => {
                                return (
                                    <Link to={`/service-business/staff-settings/${staff._id}`}>
                                        <div
                                            key={staff._id}
                                            className="sm:w-[100%] bg-[#FFFFFF14] p-[16px] rounded-[8px] cursor-pointer"
                                        >
                                            <div className="flex gap-2 sm:gap-4 pl-[10px] pr-[10px] align-items-center">
                                                <div className='w-[50px] h-[50px] rounded-full bg-[#fff] overflow-hidden mx-auto flex justify-center'>
                                                    <img
                                                        src={`${import.meta.env.VITE_APP_S3_IMAGE}/${staff.profilePic}`}
                                                        // src={`${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${staff.profilePic}`}
                                                        width={'100%'} alt="" />
                                                </div>
                                                <div className="flex-1 text-left ml-2">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h6 className="text-md text-white font-roboto font-bold  mb-1">
                                                                {staff?.name}
                                                            </h6>
                                                            <h6 className="text-sm text-white font-roboto font-normal opacity-[0.6]">
                                                                ID# {staff.referralCode}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-right ml-2 justify-end">
                                                    <h6 className="text-md text-white font-roboto font-bold mb-1 flex justify-end">
                                                        <span className='text-[18px] font-bold'>{(staff?.averageRating || 0).toFixed(1)}</span>
                                                        <img src="/images/home/star.svg" alt="star" className='ml-2' />
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                        : (
                            <div className="text-xl text-white font-bold text-center flex flex-col justify-center items-center my-[48px] gap-[24px]">
                                <div className="image-not">
                                    <img src="/images/home/result-not-found.svg" alt="not found" />
                                </div>
                                Result not found
                            </div>
                        )}
                </div>
                {/* {Array.isArray(staffList) && staffList.length === 0 && (<div className='flex items-center justify-center w-full'><img src='/images/home/notfound.svg' alt='img' /></div>)} */}
            </div>
        )
    }
}
export default UserList;