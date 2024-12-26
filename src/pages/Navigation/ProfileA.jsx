import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function ProfileA({toggleStatus}) {
    const navigate = useNavigate()

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/user/my-vairipay-request-confirm')
    }

    return (
        <div className={`text-white flex flex-col justify-start items-center px-8 pb-20 overflow-auto w-[255px] h-[100vh] fixed top-0 custom-left-minus-100 bg-gradient-to-b from-[#01195C] to-[#073FE1] ${toggleStatus == true ? 'custom-left-0' : ''}`}>
            <div className='w-full mx-auto flex flex-col justify-center items-center pt-10'>
                <div><span className='text-[18px] font-bold text-white'>Profile</span></div>
            </div>
            <div className='w-full mx-auto flex flex-col justify-center items-center mt-4'>
                <img className='w-[163px] h-[163px]' src={ "/images/HotRod.png"} alt="Profile Hot Rod" />
            </div>
            <div className='w-full mx-auto flex flex-col justify-center items-center mt-4'>
                <div style={{border: '1px solid white'}} className='w-[65px] border-white'></div>
                <div><span className='text-white font-bold text-[18px]'>Robert</span></div>
            </div>
            <div className='w-full mx-auto flex flex-col justify-center items-start mt-10'>
                <button><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/VectorHome.png'} /></div><div><span className='text-white text-[16px] font-bold'>Home</span></div></div></button>
                <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/ProfileMarketPlace.png'} /></div><div><span className='text-white text-[16px] font-bold'>Market Place</span></div></div></button>
                <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/VectorChat.png'} /></div><div><span className='text-white text-[16px] font-bold'>Chat</span></div></div></button>
                <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-2 relative right-2' src={ '/images/ProfileVairipay.png'} /></div><div><span className='text-white text-[16px] font-bold'>VAI</span><span className='text-white text-[16px] font-light'>RIPAY</span></div></div></button>
                <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/ProfileMyRevenue.png'} /></div><div><span className='text-white text-[16px] font-bold'>My Revenue</span></div></div></button>
                <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div onClick={(e)=>handleClick(e)}><img className='mr-4' src={ '/images/ProfileMyVairipay.png'} /></div><div><span className='text-white text-[16px] font-bold'>My VAI<span className='text-white text-[16px] font-light'>RIFY</span></span></div></div></button>
                <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/VectorForum.png'} /></div><div><span className='text-white text-[16px] font-bold'>Forum</span></div></div></button>
                {/* <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/VectorCalendar.png'} /></div><div><span className='text-white text-[16px] font-bold'>Calendar</span></div></div></button>
                <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/ProfileDateGuard.png'} /></div><div><span className='text-white text-[16px] font-bold'>Date Guard</span></div></div></button> */}
                {/* <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/VectorRevenue.png'} /></div><div><span className='text-white text-[16px] font-bold'>My Revenue</span></div></div></button> */}
                {/* <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/VectorContact.png'} /></div><div><span className='text-white text-[16px] font-bold'>My Contacts</span></div></div></button> */}
                <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/VectorSettings.png'} /></div><div><span className='text-white text-[16px] font-bold'>Settings</span></div></div></button>
                <button className='mt-8'><div className='w-full flex flex-row justify-start items-center'><div><img className='mr-4' src={ '/images/VectorHelp.png'} /></div><div><span className='text-white text-[16px] font-bold'>Help</span></div></div></button>
            </div>
        </div>
    );
}