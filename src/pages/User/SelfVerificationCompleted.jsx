import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { useState } from "react";
import BackButton from "../../components/BackButton/backArrowButton";

const SelfVerificationCompleted = () => {
    const navigate = useNavigate();
    const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
    const [isPopupOpen, setPopupOpen] = useState(false);

    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const HandleOnClick = () => {
        navigate('/setup');
    };

    const Popup = ({ isOpen, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                <div className="bg-white p-6 rounded-lg max-w-[300px] w-full flex flex-col justify-center items-center">
                    <h2 className="text-2xl font-bold mb-4">QR Code</h2>
                    <div className="p-4">
                        <img src="/images/QRCodeScan.png" className="w-[150px] h-[150px] ml-2" />
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="container md:mt-0 mt-[24px]">
            <div className="sm:p-[40px] p-[0px] relative">
                <div className="backnavigation">
                    <BackButton />
                </div>
                <div className="logo-img-container">
                    <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
                    <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
                </div>
                <div>


                    {/* <div className="grid grid-flow-col grid-cols-1 gap-4">
                      <div className="relative flex flex-col items-center justify-start">
                      <div className="relative top-6">
                                                <img
                                                 height={120}
                                                 width={120}
                                                 src={import.meta.env.BASE_URL + "images/VectorLogo1.png"}
                                                 alt="Vector Logo 1"
                                             />
                                         </div>
                                         <div className="relative items-center justify-center ml-5">
                                             <img
                                                 height={60}
                                                 width={60}
                                                 src={import.meta.env.BASE_URL + "images/VectorLogo2.png"}
                                                 alt="Vector Logo 2"
                                             />
                                         </div>
                                     </div>
                                 </div> */}
                    <div className="mt-[64px]">
                        <img
                            className="sm:w-[160px] mx-auto"
                            src={"/images/face-verification/chainpass.svg"}
                            alt="asdf"
                        />
                    </div>
                    <div className="bg-[#FFFFFF14] sm:p-[24px] p-[16px] sm:rounded-[16px] rounded-[8px] w-full max-w-[500px] mx-auto mt-[32px]">
                        <img
                            className="sm:w-[160px] mx-auto"
                            src={"/images/face-verification/verified.svg"}
                            alt="asdf"
                        />

                        <div>
                            {/* <p className="py-1 text-2xl font-bold text-[#fff] mx-auto">Site ID {UserData.name}</p> */}
                            <p className="py-1 text-[18px] font-normal text-white mx-auto uppercase text-center">{UserData?.vaiID}</p>
                            <p className="sm:text-[18px] text-[16px] font-normal text-white text-center">Congratulations Intimate Massage you have been</p>
                        </div>
                    </div>
                    {/* <div>
                <div className="px-2">
                 <button className="text-[#0247FF] text-[16px] font-bold"
                    onClick={openPopup}>Click here to see your QR Code</button>
                        </div>
                    </div> */}
                    <Popup isOpen={isPopupOpen} onClose={closePopup} />

                    <div className="max-w-[500px] w-full sm:mt-[64px] mt-[24px] mx-auto">
                        <Button
                            text={"Go to Setup"}
                            onClick={HandleOnClick}
                        />
                    </div>

                    {/* <div className="flex-1 w-full mt-10 mb-2">
                      <Button
                          className={
                              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                              }
                          text={"Go to V.A.I."}
                          size="45px"
                          onClick={HandleOnClick}
                      />
                  </div> */}




                </div>
            </div>
        </div>
    );
};

export default SelfVerificationCompleted;




// <div className="bg-[#B9BBCB] rounded-3xl flex items-center w-full">
// <div className="main-container">
//     <div className="flex flex-col items-center justify-center mx-auto w-max-370">
//         {/* <div className="grid grid-flow-col grid-cols-1 gap-4">
//             <div className="relative flex flex-col items-center justify-start">
//                 <div className="relative top-6">
//                     <img
//                         height={120}
//                         width={120}
//                         src={import.meta.env.BASE_URL + "images/VectorLogo1.png"}
//                         alt="Vector Logo 1"
//                     />
//                 </div>
//                 <div className="relative items-center justify-center ml-5">
//                     <img
//                         height={60}
//                         width={60}
//                         src={import.meta.env.BASE_URL + "images/VectorLogo2.png"}
//                         alt="Vector Logo 2"
//                     />
//                 </div>
//             </div>
//         </div> */}
//         <div className="relative mt-4">
//             <img width={'250px'}
//                 src={'/images/chainpass_id_logo.png'}
//                 alt="asdf"
//             />
//         </div>
//         <div className="py-2 mx-4">
//             <span className="text-[20px] font-bold text-[#000000]">Congratulations Intimate Massage you have been</span>
//         </div>
//         <div className="flex items-center justify-center mb-4">
//             <div className="px-2">
//                 <span className="text-[#00A769] text-3xl font-bold">Verified</span>
//             </div>
//             <div>
//                 <img
//                     height={40}
//                     width={40}
//                     src={"/images/check-mark 2.png"}
//                     alt="Vector Logo 2"
//                 />
//             </div>
//         </div>
//         <div className="bg-gradient-to-b from-[#000C3E] to-[#02227E] w-80 p-2 rounded-md shadow-sm text-center">
//             {/* <p className="py-1 text-2xl font-bold text-[#fff] mx-auto">Site ID {UserData.name}</p> */}
//             <p className="py-1 text-2xl font-extrabold text-[#fff] mx-auto uppercase">VAI<span className="logoSetupweight">RIFY ID</span></p>
//             <p className="py-1 text-2xl font-bold text-[#fff] mx-auto uppercase">{UserData?.vaiID}</p>
//         </div>
//         {/* <div className="py-3">
//             <img
//                 height={'320rem'}
//                 width={'320rem'}
//                 src={"/images/verifyed-pic.png"}
//                 alt="Vector Logo 2"
//             />
//         </div> */}
//         {/* <div>
//             <div className="px-2">
//                 <button className="text-[#0247FF] text-[16px] font-bold"
//                     onClick={openPopup}>Click here to see your QR Code</button>
//             </div>
//         </div> */}


//         <Popup isOpen={isPopupOpen} onClose={closePopup} />

//         <div className="w-max-370 flex-1 w-full mt-10 mb-2">
//             <Button
//                 className={
//                     "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
//                 }
//                 text={"Go to Setup"}
//                 size="55px"
//                 onClick={HandleOnClick}
//             />
//         </div>


//         {/* <div className="flex-1 w-full mt-10 mb-2">
//             <Button
//                 className={
//                     "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
//                     }
//                 text={"Go to V.A.I."}
//                 size="45px"
//                 onClick={HandleOnClick}
//             />
//         </div> */}
//     </div>
// </div>
// </div>
