import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useSelector } from 'react-redux';

export default function Verification() {
    const navigate = useNavigate();
    const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
    const userType = UserData.user_type

    const location = useLocation()
    const appointment = location.state

    const navigateToNextPage = (url = '/varidate/reviews', details) => {
        navigate(url, {
            state:
                details ?
                    appointment :
                    {
                        vaiID: userType === 'client-hobbyist' ? appointment?.['companionId']?.vaiID : appointment?.['clientId']?.vaiID,
                        averageRating: userType === 'client-hobbyist' ? appointment?.['companionId']?.averageRating : appointment?.['clientId']?.averageRating,
                        name: userType === 'client-hobbyist' ? appointment?.['companionId']?.name : appointment?.['clientId']?.name,
                        userId: userType === 'client-hobbyist' ? appointment?.['companionId']?._id : appointment?.['clientId']?._id,
                        profilePic: userType === 'client-hobbyist' ? appointment?.['companionId']?.profilePic : appointment?.['clientId']?.profilePic,
                        gender: userType === 'client-hobbyist' ? appointment?.['companionId']?.gender : appointment?.['clientId']?.gender
                    }
        });
    }
    return (
        <div className='main-container px-0 '>
            <div className='w-full mx-auto flex flex-col justify-center items-center'>
                <div className='max-w-[300px] w-[70vw] flex rounded-full flex-col justify-center items-center mt-7 bg-[#797E9E] py-2'><span className='font-bold text-[30px] text-[#02227E]'>VAI<span className='font-normal'>RIDATE</span></span></div>
                <div className='w-[100%] flex flex-col justify-center items-center mt-9 bg-[#587EE7] py-4'>
                    <div className='w-[150px] h-[150px] overflow-hidden rounded-full'>
                        <img
                         src={appointment?.[userType == 'client-hobbyist' ? 'companionId' : 'clientId']?.profilePic ? `${import.meta.env.VITE_APP_S3_IMAGE}/${appointment?.[userType == 'client-hobbyist' ? 'companionId' : 'clientId']?.profilePic}` : ((appointment?.[userType == 'client-hobbyist' ? 'companionId' : 'clientId']?.gender) === 'Male'
                                ? '/images/male.png'
                                : '/images/female.png')
                            }
                            // src={appointment?.[userType == 'client-hobbyist' ? 'companionId' : 'clientId']?.profilePic ? `${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${appointment?.[userType == 'client-hobbyist' ? 'companionId' : 'clientId']?.profilePic}` : ((appointment?.[userType == 'client-hobbyist' ? 'companionId' : 'clientId']?.gender) === 'Male'
                            //     ? '/images/male.png'
                            //     : '/images/female.png')
                            // }
                            className='w-full'
                            // src={'/images/Ellipse 154.png'}
                            alt="Vairidate Verification Member"
                        />
                    </div>
                </div>
                <div className='w-full mx-auto flex flex-col justify-center items-center'><img src={'/images/VairidateVerificationMark.png'} alt="Vairidate Verification Mark Icon" /></div>
                <div className='w-full mx-auto flex flex-col justify-center items-center'>
                    <div className='flex items-center justify-center'><span className='font-bold text-[28px]'>{appointment?.clientId?.name} has been</span></div>
                    <div className='flex items-center justify-center'><span className='font-bold text-[40px] text-[#13A307]'>"verified"</span></div>
                </div>
                <div className='w-full mx-auto flex flex-col justify-center items-center mt-2 mb-2'>
                    <div className='max-w-[300px] w-full'><Button onClick={() => navigateToNextPage('/varidate/reviews')} text="View TruRevu" className={'font-bold text-[20px] text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[25px]'} /></div>
                    <div className='max-w-[300px] w-full mt-7'><Button onClick={() => navigateToNextPage('/varidate/booking-details', true)} text="View Date Request" className={'font-bold text-[20px] text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[25px]'} /></div>
                </div>
            </div>
        </div>
    );
}