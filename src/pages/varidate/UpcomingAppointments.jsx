import React, { useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import VaridateService from '../../services/VaridateServices';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading/Index';
import PageTitle from '../../components/PageTitle';
// import TextArea from '../../components/TextArea';
// import Button from '../../components/Button';

export default function UpcomingAppointments() {

    const [lastMileInst, setLastMileInst] = useState('')
    const [loading, setLoading] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    const appointment = location.state
    const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

    const handleSendLastMileInst = async () => {
        setLoading(true)
        try {
            await VaridateService.updateAppointment(UserDetails?._id, appointment?._id, {
                lastMileInst
            })
            toast.success('Saved successfully!')
            if (appointment.from === 'vai-check') {
                navigate("/vai-check/list");
            }
            else if (appointment.from === 'vai-now' || appointment.from === 'vairifyNow') {
                navigate("/vai-now/list");
            }
            else {
                navigate("/varidate/upcoming-appointments");
            }
            // navigate(-1);
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.error || error?.message)
        } finally {
            setLoading(false)
        }
    }

    const rate = (UserDetails?.profileReviews || []).reduce((total, item) => total + item.rating, 0) / ((UserDetails?.profileReviews || []).length || 1)


    return (
        <div className="container mb-[48px]">
            <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Last Mile Directions"} isSmall={true} />
            </div>

            <textarea disabled={loading} placeholder='Message' onChange={e => setLastMileInst(e.target.value)} className="w-full placeholder:!text-[#ffffff] text-[14px] text-white p-[12px] h-[115px] rounded-lg bg-transparent border border-[#919EAB33]" rows={6}>
                {appointment?.lastMileInst}
            </textarea>
            <div className='flex items-center justify-center w-full mt-[48px]'>
                <Button
                    disabled={loading}
                    onClick={handleSendLastMileInst}
                    text={loading ? <div className="flex items-center	justify-center">
                        <Loading />
                    </div> : "Send"}
                    className={
                        "w-full max-w-[500px] mx-auto"}
                />
            </div>
        </div>

    )
}


// <div className="main-container flex flex-col" style={{ paddingInline: 20 }}>
// <div className='-top-14 relative w-full flex-1'>
//     <div className='flex-1 w-full'>
//         <div className='w-full mx-auto flex flex-row items-center justify-center'>
//             <div className='w-full flex flex-col justify-start items-center mt-14'>
//                 <h3 className='text-lg' style={{ lineHeight: 0.5 }}><strong>VAI</strong>RIFY ID </h3>
//                 <h4 className='text-sm'>{UserDetails?.vaiID}</h4>
//             </div>
//             <div className='w-[120px] relative'>
//                 <div style={{ left: '10px', bottom: '65px' }}>
//                     <img
//                         src={UserDetails?.profilePic ?
//                             import.meta.env.VITE_APP_S3_IMAGE +
//                             `/${UserDetails?.profilePic}` :
//                             ((UserDetails?.gender) === 'Male'
//                                 ? '/images/male.png'
//                                 : '/images/female.png')
//                         }
//                         // src={UserDetails?.profilePic ?
//                         //     import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
//                         //     `/${UserDetails?.profilePic}` :
//                         //     ((UserDetails?.gender) === 'Male'
//                         //         ? '/images/male.png'
//                         //         : '/images/female.png')
//                         // }
//                         alt="Hot Rod" className='rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white' /></div>
//                 {/* <div style={{ right: '15px', bottom: '5px' }} className='absolute'><img src={'/images/HotRodIcon2.png'} alt="Hot Rod Icon Second" className=''/></div> */}
//             </div>
//             <div className='w-full flex flex-col justify-start items-center mt-14'>
//                 <h3 className='text-lg' style={{ lineHeight: 0.5 }}><strong>TruRevu</strong> </h3>
//                 <div className='flex items-center gap-1'>
//                     <ReactStars count={5} value={rate} size={16} classNames={'leading-none'} />
//                     <p>{rate?.toFixed(1)}</p>
//                 </div>
//             </div>
//         </div>
//         <div className="w-full mx-auto">
//             <h2 className='text-2xl font-bold'>{UserDetails?.name}</h2>
//         </div>
//         <div className='mt-[64px] flex'>
//             <h4 className='text-[24px]' style={{ fontFamily: 'Quintessential' }}>
//                 Last Mile Directions
//             </h4>
//         </div>
//         <div className='items-center rounded-2xl'>
//             <textarea disabled={loading} onChange={e => setLastMileInst(e.target.value)} className={'border-2 border-[#316AFF] h-[170px] w-full rounded-xl text-[17px] text-center p-10'} rows={6}>
//                 {appointment?.lastMileInst}
//             </textarea>
//             {/* <div className='flex gap-1'>
//         <input type='checkbox' className='text-[10px]' />
//         <span className='text-white text-[10px]'>I Have read and agree to the cancellation policy </span>
//     </div>
//     <Button text={'Request Cancellation'} className={'from-[#DB3002] to-[#DB3002] text-[15px] text-white h-[36px] w-48 mx-auto mt-4'} size={35} /> */}
//             {/* <Button text={'Request Cancellation'} className={'from-[#DB3002] to-[#DB3002] text-[15px] text-white h-[36px] w-48 mx-auto mt-4'} size={35} /> */}
//             {/* {!appointment?.lastMileInst && ( */}
//             <button
//                 disabled={loading}
//                 onClick={handleSendLastMileInst}
//                 className='font-roboto font-bold text-[20px] text-white px-4 py-3 border rounded-[8px] border-white bg-[#02227E] w-full'>
//                 Send
//             </button>
//             {/* )} */}
//         </div>
//     </div>
// </div>
// {/* <div className='mb-[40px]'>
// <svg xmlns="http://www.w3.org/2000/svg" width="219" height="83" viewBox="0 0 219 83" fill="none" className='mx-auto'>
//     <path d="M65.1524 17.628L65.2837 17.7602L65.4566 17.8293L65.4578 17.8298C70.9315 23.3272 74.3357 30.551 75.089 38.2757C75.8483 46.0609 73.8675 53.867 69.4883 60.3484C65.109 66.8297 58.6057 71.58 51.0994 73.7804C43.5932 75.9807 35.5544 75.4933 28.369 72.4019L28.3631 72.3994C27.5224 72.0449 26.6038 71.9157 25.6979 72.0246L25.6628 72.0289L25.6281 72.0358L10.9498 74.9852H10.3494H10.3379L10.3264 74.9855C9.98231 74.9943 9.63997 74.9333 9.32004 74.8062C9.0009 74.6794 8.71066 74.4895 8.46672 74.2478C8.16977 73.9487 7.95158 73.5806 7.83169 73.1765C7.71151 72.7715 7.69386 72.3429 7.78031 71.9294L7.78049 71.9285L10.8165 57.335L10.8197 57.3196L10.8224 57.304C10.9818 56.3758 10.8497 55.4211 10.4444 54.5713C7.35956 47.3902 6.87454 39.3581 9.0732 31.8577C11.2736 24.3514 16.0239 17.8481 22.5052 13.4688C28.9865 9.08952 36.7927 7.10878 44.5778 7.86804C52.363 8.62731 59.6394 12.079 65.1524 17.628ZM25.1826 45.0021L25.6826 44.2538L25.1826 45.0021C25.898 45.4801 26.739 45.7352 27.5994 45.7352C28.7531 45.7352 29.8595 45.2769 30.6753 44.4611C31.4911 43.6453 31.9494 42.5389 31.9494 41.3852C31.9494 40.5249 31.6942 39.6838 31.2163 38.9685C30.7383 38.2531 30.0589 37.6956 29.264 37.3663C28.4692 37.0371 27.5945 36.9509 26.7507 37.1188C25.9069 37.2866 25.1318 37.7009 24.5234 38.3093C23.9151 38.9177 23.5008 39.6927 23.3329 40.5366C23.1651 41.3804 23.2512 42.255 23.5805 43.0499C23.9097 43.8447 24.4673 44.5241 25.1826 45.0021ZM38.9826 45.0021C39.698 45.4801 40.539 45.7352 41.3994 45.7352C42.5531 45.7352 43.6595 45.2769 44.4753 44.4611C45.2911 43.6453 45.7494 42.5389 45.7494 41.3852C45.7494 40.5249 45.4942 39.6838 45.0163 38.9685C44.5383 38.2531 43.8589 37.6956 43.064 37.3663C42.2692 37.0371 41.3945 36.9509 40.5507 37.1188C39.7069 37.2866 38.9318 37.7009 38.3234 38.3093C37.7151 38.9177 37.3008 39.6927 37.1329 40.5366C36.9651 41.3804 37.0512 42.255 37.3805 43.0499C37.7097 43.8447 38.2673 44.5241 38.9826 45.0021ZM52.7826 45.0021C53.498 45.4801 54.339 45.7352 55.1994 45.7352C56.3531 45.7352 57.4595 45.2769 58.2753 44.4611C59.0911 43.6453 59.5494 42.5389 59.5494 41.3852C59.5494 40.5249 59.2942 39.6838 58.8163 38.9685C58.3383 38.2531 57.6589 37.6956 56.864 37.3663C56.0692 37.0371 55.1945 36.9509 54.3507 37.1188C53.5069 37.2866 52.7318 37.7009 52.1235 38.3093C51.5151 38.9177 51.1008 39.6927 50.9329 40.5366C50.7651 41.3804 50.8512 42.255 51.1805 43.0499C51.5097 43.8447 52.0673 44.5241 52.7826 45.0021Z" fill="#02227E" stroke="#0198FE" stroke-width="1.8"/>
//     <path d="M217.801 41.8498C217.801 60.9758 202.097 76.4998 182.701 76.4998C163.305 76.4998 147.601 60.9758 147.601 41.8498C147.601 22.7238 163.305 7.1998 182.701 7.1998C202.097 7.1998 217.801 22.7238 217.801 41.8498Z" fill="#02227E" stroke="#05B7FD" stroke-width="1.8"/>
//     <path opacity="0.2" d="M192.562 49.0487C192.628 49.0348 192.661 49.0391 192.664 49.0393L192.692 49.0483L192.727 49.0569C195.311 49.6819 197.062 50.874 198.176 51.9101C198.734 52.4294 199.135 52.9116 199.4 53.2669C199.533 53.4444 199.632 53.5912 199.703 53.6977C199.738 53.752 199.758 53.7825 199.783 53.8214C199.786 53.8371 199.789 53.8575 199.792 53.883C199.798 53.9496 199.8 54.0209 199.801 54.1028C199.32 56.7609 198.209 58.4712 197.229 59.5259C196.732 60.0614 196.262 60.4337 195.914 60.6765C195.741 60.7978 195.596 60.8876 195.491 60.9509C195.455 60.9728 195.43 60.9875 195.405 61.002C195.389 61.0117 195.373 61.0212 195.353 61.0326C195.345 61.0378 195.335 61.0439 195.324 61.0506C195.3 61.0405 195.275 61.0299 195.248 61.02C195.215 61.0078 195.173 60.9937 195.124 60.9812C194.832 60.8531 194.47 60.7426 194.065 60.6423L194.037 60.6345C191.404 59.9154 186.222 58.5001 180.738 54.3913C175.258 50.2854 169.427 43.4515 165.601 31.8187V31.4611C165.609 31.4388 165.618 31.4151 165.628 31.3891C165.668 31.2878 165.725 31.1517 165.809 30.9895C165.976 30.6655 166.253 30.227 166.71 29.7574C167.608 28.8349 169.264 27.7296 172.314 27.1968C172.387 27.1974 172.438 27.1992 172.492 27.2051C172.546 27.2111 172.611 27.2223 172.695 27.2471C173.006 27.3967 174.24 28.0117 175.495 29.123C176.883 30.351 178.214 32.1112 178.425 34.4374C178.422 34.5087 178.408 34.5981 178.383 34.6803C178.368 34.7254 178.354 34.757 178.344 34.7755C178.343 34.7776 178.342 34.7794 178.341 34.7809L178.338 34.7843C177.345 35.8229 176.439 36.9768 175.789 37.9681C175.465 38.4623 175.193 38.9344 175.006 39.3443C174.913 39.5486 174.832 39.7558 174.779 39.9548C174.732 40.1277 174.685 40.3713 174.721 40.6294C174.754 40.9257 174.874 41.2597 175.009 41.568C175.159 41.912 175.367 42.3142 175.627 42.7562C176.149 43.6414 176.9 44.721 177.866 45.8615C179.796 48.1394 182.62 50.7034 186.251 52.4381L186.53 52.5714L186.832 52.5051C187.2 52.4243 187.62 52.2429 188.03 52.034C188.454 51.8177 188.926 51.5418 189.413 51.2336C190.372 50.6259 191.423 49.8695 192.337 49.1383C192.408 49.096 192.489 49.0643 192.562 49.0487Z" fill="#231F20" stroke="#05B7FD" stroke-width="1.8"/>
//     <path d="M192.562 46.8268C192.628 46.8129 192.661 46.8171 192.664 46.8173L192.692 46.8264L192.727 46.835C195.311 47.46 197.062 48.6521 198.176 49.6882C198.734 50.2075 199.135 50.6897 199.4 51.045C199.533 51.2225 199.632 51.3693 199.703 51.4758C199.738 51.5301 199.758 51.5606 199.783 51.5994C199.786 51.6152 199.789 51.6356 199.792 51.6611C199.798 51.7277 199.8 51.799 199.801 51.8809C199.32 54.539 198.209 56.2493 197.229 57.304C196.732 57.8395 196.262 58.2118 195.914 58.4546C195.741 58.5759 195.596 58.6657 195.491 58.729C195.455 58.7509 195.43 58.7656 195.405 58.7801C195.389 58.7897 195.373 58.7993 195.353 58.8107C195.345 58.8158 195.335 58.822 195.324 58.8286C195.3 58.8186 195.275 58.808 195.248 58.7981C195.215 58.7858 195.173 58.7718 195.124 58.7593C194.832 58.6312 194.47 58.5207 194.065 58.4204L194.037 58.4126C191.404 57.6935 186.222 56.2782 180.738 52.1694C175.258 48.0635 169.427 41.2295 165.601 29.5968V29.2391C165.609 29.2169 165.618 29.1932 165.628 29.1672C165.668 29.0658 165.725 28.9298 165.809 28.7675C165.976 28.4436 166.253 28.0051 166.71 27.5355C167.608 26.6129 169.264 25.5076 172.314 24.9749C172.387 24.9755 172.438 24.9773 172.492 24.9832C172.546 24.9892 172.611 25.0004 172.695 25.0252C173.006 25.1748 174.24 25.7898 175.495 26.9011C176.883 28.1291 178.214 29.8893 178.425 32.2155C178.422 32.2868 178.408 32.3762 178.383 32.4584C178.368 32.5035 178.354 32.5351 178.344 32.5536C178.343 32.5557 178.342 32.5575 178.341 32.559L178.338 32.5623C177.345 33.6009 176.439 34.7548 175.789 35.7462C175.465 36.2404 175.193 36.7124 175.006 37.1223C174.913 37.3267 174.832 37.5339 174.779 37.7329C174.732 37.9057 174.685 38.1494 174.721 38.4075C174.754 38.7038 174.874 39.0378 175.009 39.3461C175.159 39.69 175.367 40.0922 175.627 40.5343C176.149 41.4195 176.9 42.499 177.866 43.6396C179.796 45.9175 182.62 48.4814 186.251 50.2161L186.53 50.3494L186.832 50.2832C187.2 50.2024 187.62 50.0209 188.03 49.812C188.454 49.5957 188.926 49.3199 189.413 49.0117C190.372 48.404 191.423 47.6475 192.337 46.9163C192.408 46.8741 192.489 46.8424 192.562 46.8268Z" fill="white" stroke="#05B7FD" stroke-width="1.8"/>
// </svg>
// </div> */}
// </div>