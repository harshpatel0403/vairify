import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import OtpInput from 'react-otp-input';
import { useState } from "react";

const VairifySendCode = () => {
    const navigate = useNavigate();
    const [OTPCode, setOTPCode] = useState(null)
    return (
        <div className="main-container">
            <div className="max-w-[400px] mx-auto w-full">
                <div className="py-2 mb-2">
                    <span className="text-2xl font-extrabold text-black">VAI<span className="logoSetupweight">RIFY</span> Welcomes you as a Founding member </span>
                </div>
                <div className="flex items-center justify-center py-2">
                    <div className="flex justify-center items-center rounded-xl bg-gradient-to-b from-[#02227E] to-[#0247FF] text-[#fff] py-1 w-96">
                        <img
                            src={import.meta.env.BASE_URL + "images/right-icon-with-zigzag.png"}
                            alt="right-icon-with-zigzag"
                        />
                        <span className="px-4 text-2xl font-bold">Safe-Date</span>
                    </div>
                </div>
                <div className="flex items-center justify-center py-2">
                    <div className="flex justify-center items-center rounded-xl bg-gradient-to-b from-[#02227E] to-[#0247FF] text-[#fff] py-1 w-96">
                        <img
                            height={22}
                            width={22}
                            src={import.meta.env.BASE_URL + "images/ProfileDateGuard.png"}
                            alt="right-icon-with-zigzag"
                        />
                        <span className="px-4 text-2xl font-bold">Date Guard</span>
                    </div>
                </div>
                <div className="py-4">
                    <span className="text-xl font-bold text-black">We are sending a code to your registered Phone # enter this Code below to receive up to $4,000 in benifits to the VAI<span className="font-normal">RIFY</span>community</span>
                </div>
                <div className='mt-3'>
                    <OtpInput
                        value={OTPCode}
                        onChange={e => setOTPCode(e)}
                        numInputs={6}
                        inputStyle={{ borderColor: '#02227E', backgroundColor: '#D9D9D9' }}
                        renderSeparator={<span> </span>}
                        renderInput={(props) => <input
                            {...props}
                            className={`flex-1 mr-2 border-2 bg-[#d5d6e0] h-14 w-9 text-center form-control otp_input bg-transparent text-[30px] text-[#02227E] "
                  type="text`}
                        />}
                    />
                </div>
                <div className="flex-1 w-full mt-10 mb-10">
                    <Button
                        className={
                            "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-7 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                        }
                        text={"Send the Code"}
                        size="45px"
                        onClick={() => { }}
                    />
                </div>
                <div className="flex items-center justify-center py-2">
                    <div className="w-[260px]">
                        <span className="text-[#0247FF] text-[16px] font-bold">If you do not receive your code in 60 seconds click this link to resend  </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VairifySendCode;
