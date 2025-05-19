import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import OtpInput from "react-otp-input";
import DateGuardService from '../../../services/DateGuardService';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../../components/Header/Header';

export default function JoinMemberToGroup() {

    const [otp, setOtp] = useState("");
    const [groupData, setGroupData] = useState({});

    const nav = useNavigate();
    const params = useParams();

    const handleOtpChange = (value) => {
        setOtp(value);
    }

    const handleSubmit = async () => {
        try {
            if (!(otp?.length === 6)) {
                return toast('Please enter valid Code', {
                    hideProgressBar: true,
                    autoClose: 1000,
                    type: "error",
                })
            }
            await DateGuardService.verifyInvitationCode({ groupToken: params?.groupId, memberToken: params?.guardianId, smsCode: otp })
            nav('/dateguard/join-member-to-group/success')
        } catch (error) {
            console.log(error)
            toast('Invalid Code!', {
                hideProgressBar: true,
                autoClose: 1000,
                type: "error",
            })
            return setOtp("");
        }
    }

    const handleGetGroupDetails = async (groupId) => {
        try {
            let response = await DateGuardService.getSingleGroup(groupId);
            setGroupData(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (params?.groupId) {
            handleGetGroupDetails(params?.groupId)
        }
    }, [params])

    return (
        <div className="container">
    
            <div className="sm:py-[48px] py-[24px]">
                <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white">Join {groupData?.name || ''} Group</h3>
            </div>
            <div className='grid md:grid-cols-2 grid-cols-1'>

                <div className='flex items-center justify-center w-full'>
                    <img src="/images/setup/addgroup.svg" alt="add img" />
                </div>
                <div className='flex justify-center w-full flex-col'>
                    <h3 className='sm:text-[28px] text-[24px] font-medium text-white'>Join Group {groupData?.name || ''}</h3>
                    <p className='sm:text-[18px] text-[16px] font-normal text-white mb-[24px]'>Please enter the 6-character invite code</p>
                    <OtpInput
                        value={otp}
                        onChange={handleOtpChange}
                        numInputs={6}
                        renderSeparator={<span> </span>}
                        renderInput={(props) => (
                            <div className='w-[45px] flex items-cener justify-center mr-4' >
                                <input {...props} style={{
                                    // borderColor: false ? `#ef4444` : "#0247FF",
                                }} className='w-full focus:outline-none focus:shadow-none border-[1.2px] rounded-[8px] border-[#919EAB] h-[45px] bg-transparent text-[24px] text-center text-white' />
                            </div>
                        )}
                    />
                    <Button onClick={handleSubmit} text="Submit" className={'mt-[24px] max-w-[400px]'} />
                </div>
            </div>
        </div>
    );
}



{/* <div className='main-container form-field-container'>
            <div className='w-full mx-auto flex flex-col justify-center items-center pt-20'>
                <div className='w-full mx-auto flex flex-col justify-center items-center max-w-[242px]'><span className='font-bold text-[27px] text-white change-font-family'>Join {groupData?.name || ''} Group</span></div>
                <div className='w-full mx-auto flex flex-col justify-center items-center mt-2'>
                    <img src={'/images/JoinMemberToGroupLogo.png'} alt="Join Member To Group" />
                </div>
                <div className='w-full mx-auto flex flex-col justify-center items-cener mt-7'>
                    <span className='font-normal text-[21.6px] text-white change-font-family'>Please enter the 6 character invite code</span>
                </div>
                <div className='w-full mx-auto flex flex-row justify-center items-center mt-2'>
                    <div className='w-[45px] flex items-cener justify-center mr-4'><input className='w-full focus:outline-none focus:shadow-none border-4 border-[white] border-t-0 border-l-0 border-r-0 h-[78px] bg-transparent text-[35px] text-center text-white' type="text" id="first" maxLength='1' /></div>
                    <div className='w-[45px] flex items-cener justify-center mr-4'><input className='w-full focus:outline-none focus:shadow-none border-4 border-[white] border-t-0 border-l-0 border-r-0 h-[78px] bg-transparent text-[35px] text-center text-white' type="text" id="second" maxLength='1' /></div>
                    <div className='w-[45px] flex items-cener justify-center mr-4'><input className='w-full focus:outline-none focus:shadow-none border-4 border-[white] border-t-0 border-l-0 border-r-0 h-[78px] bg-transparent text-[35px] text-center text-white' type="text" id="third" maxLength='1' /></div>
                    <div className='w-[45px] flex items-cener justify-center mr-4'><input className='w-full focus:outline-none focus:shadow-none border-4 border-[white] border-t-0 border-l-0 border-r-0 h-[78px] bg-transparent text-[35px] text-center text-white' type="text" id="fourth" maxLength='1' /></div>
                    <div className='w-[45px] flex items-cener justify-center mr-4'><input className='w-full focus:outline-none focus:shadow-none border-4 border-[white] border-t-0 border-l-0 border-r-0 h-[78px] bg-transparent text-[35px] text-center text-white' type="text" id="fifth" maxLength='1' /></div>
                    <div className='w-[45px] flex items-cener justify-center'><input className='w-full focus:outline-none focus:shadow-none border-4 border-[white] border-t-0 border-l-0 border-r-0 h-[78px] bg-transparent text-[35px] text-center text-white' type="text" id="seventh" maxLength='1' /></div>
                    <OtpInput
                        value={otp}
                        onChange={handleOtpChange}
                        numInputs={6}
                        renderSeparator={<span> </span>}
                        renderInput={(props) => (
                            <div className='w-[45px] flex items-cener justify-center mr-4' >
                                <input {...props} style={{
                                    // borderColor: false ? `#ef4444` : "#0247FF",
                                }} className='w-full focus:outline-none focus:shadow-none border-4 border-[white] border-t-0 border-l-0 border-r-0 h-[78px] bg-transparent text-[35px] text-center text-white' />
                            </div>
                        )}
                    />
                </div>
                <div className='w-full mx-auto flex items-center justify-center mt-6'><Button onClick={handleSubmit} text="Submit" className={'rounded-[25px] bg-gradient-to-b from-[#0198FE] to-[#0247FF] font-bold text-[20px] text-white'} /></div>
                <div className='w-full mx-auto flex items-center justify-center mt-4'><Button text="Cancel" className={'rounded-[25px] bg-transparent font-bold text-[20px] text-[#0247FF] shadow-none'} /></div>
            </div>
        </div> */}