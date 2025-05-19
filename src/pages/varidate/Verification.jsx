import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useSelector } from 'react-redux';
import PageTitle from '../../components/PageTitle';

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
                        gender: userType === 'client-hobbyist' ? appointment?.['companionId']?.gender : appointment?.['clientId']?.gender,
                        isFromAppointment: true
                    }
        });
    }
    return (
        <div className='container'>
            <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"VAIRIDATE"} />
            </div>
            <div className='text-white font-medium text-lg mb-[24px]'>{appointment?.clientId?.name}'s details</div>
            <div className="sm:max-w-[482px] p-[16px] rounded-[16px] mx-auto bg-[#FFFFFF14]">
                <div className=' w-full aspect-square overflow-hidden rounded-[16px]'>
                    <img
                        src={appointment?.[userType == 'client-hobbyist' ? 'companionId' : 'clientId']?.profilePic ? `${import.meta.env.VITE_APP_S3_IMAGE}/${appointment?.[userType == 'client-hobbyist' ? 'companionId' : 'clientId']?.profilePic}` : ((appointment?.[userType == 'client-hobbyist' ? 'companionId' : 'clientId']?.gender) === 'Male'
                            ? '/images/male.png'
                            : '/images/female.png')
                        }
                        className='w-full object-cover object-center h-full'
                        alt="Vairidate Verification Member"
                    />
                </div>
                <div className='text-[#4CAF50] font-medium text-xl mt-[8px] text-center flex gap-2 justify-center'><span><img src='/images/marketplace/verified.svg' alt='verified' /></span>Vairidate Verification Member</div>
            </div>
            <div className='w-full mx-auto flex  justify-center items-center my-[48px] gap-[24px]'>
                <Button onClick={() => navigateToNextPage('/varidate/reviews')} text="View TruRevu" size={'48px'} />
                <Button onClick={() => navigateToNextPage('/varidate/booking-details', true)} text="View Date Request" className={'secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF3D]'} />
            </div>
        </div>
    );
}