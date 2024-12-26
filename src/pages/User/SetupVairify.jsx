import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const SetupVairify = () => {
    const navigate = useNavigate();
    return (
        <div className="main-container">
            <div className="pb-1 inner-content-part-large ">
                <div className="py-2 mb-2">
                    <p className="text-2xl font-bold text-[#01195C]">We are just getting started!</p>
                    <p className="text-xl font-extrabold leading-5 text-[#01195C]">here is a sneak peak upcoming sites soon to be released in the VAI<span className="logoSetupweight">RIFY</span> community, setting the new standard for safety and convenience. Enjoy them for free as you help us make the VAIRIFY community the best adult community in the World!</p>
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-bold text-[#000]">Enjoy the Beta Version of VARIFY Premium Free!</p>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <div className="bg-[#3760CB] p-2 border-2 border-[#02227E] rounded-lg flex flex-col w-80">
                        <div className="flex flex-row self-center align-baseline">
                            <div>
                                <img
                                    src={import.meta.env.BASE_URL + "images/VAIRIFY-LOGO.png"}
                                    alt="VAIRIFY LOGO"
                                />
                            </div>
                            <div className="mt-4">
                                <img
                                    src={import.meta.env.BASE_URL + "images/Vairify-icon.png"}
                                    alt="Vairify-icon"
                                />

                            </div>
                        </div>
                        <div className="self-center py-2">
                            <img
                                src={import.meta.env.BASE_URL + "images/Premium-icon.png"}
                                alt="Premium-icon"
                            />
                        </div>
                    </div>
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-extrabold text-[#000]">VAI<span className='logoSetupweight'>RIDATE</span> - VAI<span className='logoSetupweight'>RIPAY</span> - Date Gaurd - Marketplace - TruRevu - and Much More! come see what all the buzz is about, and help us make an amazing app even better.</p>
                </div>
                <div className="flex-1 w-full mt-4 mb-6">
                    <Button
                        className={
                            "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-7 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                        }
                        text={"Set Up"}
                        size="50px"
                        onClick={() => { }}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex flex-col p-1 bg-gradient-to-b from-[#0198FE] to-[#FFFFFF] border-2 rounded-2xl border-white">
                        <div className="self-center p-2">
                            <img
                                src={import.meta.env.BASE_URL + "images/GoldenRoseTokensText.png"}
                                alt="GoldenRoseTokensText"
                            />
                        </div>

                        <div className="flex">
                            <div className="self-center p-2">
                                <img
                                    src={import.meta.env.BASE_URL + "images/GoldenRoseTokenCoins.png"}
                                    alt="GoldenRoseTokenCoins"
                                />
                            </div>
                            <div className="w-32 py-2 mb-2">
                                <p className="text-2xl font-bold text-[#000]">225 GRT’s for $200.00</p>
                            </div>
                            <div className="self-center p-2 transform -scale-x-100">
                                <img
                                    src={import.meta.env.BASE_URL + "images/GoldenRoseTokenItem3.png"}
                                    alt="GoldenRoseTokenItem3"
                                />
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-bold text-[#02227E]">Let the community know where you are and what you are doing, on us!</p>
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-bold text-[#02227E]">Estimated launch Date November 1st 12 months Free access founding members</p>
                </div>
                <div className="flex items-center justify-center">
                    <div className="self-center p-2">
                        <img
                            src={import.meta.env.BASE_URL + "images/dummy-img-1.png"}
                            alt="dummy-img-1"
                        />
                    </div>
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-extrabold text-[#02227E]">There are premium directories then there is Avictria - the World Wide Premium directory with  VAI<span className="logoSetupweight">RIFY</span> built in.</p>
                </div>
                <div className="flex-1 mx-10 mt-4 mb-10">
                    <Button
                        className={
                            "flex items-center bg-gradient-to-b from-[#02227E] to-[#02227E] justify-center text-[#fff] font-bold text-[26px] py-7 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                        }
                        text={"Learn More"}
                        size="18px"
                        onClick={() => { }}
                    />
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-bold text-[#02227E]">Estimated launch Date November 15th 12 months Free access founding members</p>
                </div>
                <div className="flex items-center justify-center">
                    <div className="self-center p-2">
                        <img
                            src={import.meta.env.BASE_URL + "images/dummy-img-2.png"}
                            alt="dummy-img-1"
                        />
                    </div>
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-bold text-[#02227E]">GFE is our fully featured directory - 75 languages - and VAIRIFY Built in</p>
                </div>
                <div className="flex-1 mx-10 mt-4 mb-10">
                    <Button
                        className={
                            "flex items-center bg-gradient-to-b from-[#02227E] to-[#02227E] justify-center text-[#fff] font-bold text-[26px] py-7 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                        }
                        text={"Learn More"}
                        size="18px"
                        onClick={() => { }}
                    />
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-bold text-[#02227E]">Estimated launch Date November 15th 12 months Free access founding members</p>
                </div>
                <div className="flex items-center justify-center">
                    <div className="self-center p-2">
                        <img
                            src={import.meta.env.BASE_URL + "images/dummy-img-3.png"}
                            alt="dummy-img-1"
                        />
                    </div>
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-bold text-[#02227E]">Massage has long been a staple in the adult community, EXOTIC KNEADS is the directory our community has deserved.</p>
                </div>
                <div className="flex-1 mx-10 mt-4 mb-10">
                    <Button
                        className={
                            "flex items-center bg-gradient-to-b from-[#02227E] to-[#02227E] justify-center text-[#fff] font-bold text-[26px] py-7 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                        }
                        text={"Learn More"}
                        size="18px"
                        onClick={() => { }}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <div className="self-center p-2">
                        <img
                            src={import.meta.env.BASE_URL + "images/50%-off-TRUREVU.png"}
                            alt="dummy-img-1"
                        />
                    </div>
                </div>
                <div className="flex-1 mx-8 mt-4 mb-4">
                    <Button
                        className={
                            "flex items-center bg-gradient-to-b from-[#02227E] to-[#4200FF] justify-center text-[#fff] font-bold text-[26px] py-8"
                        }
                        text={"TruRevu"}
                        size="20px"
                        onClick={() => { }}
                    />
                </div>
                <div className="py-2 mb-2">
                    <p className="text-xl leading-5 font-extrabold text-[#02227E]">Your reviews are your reputation, yet others control it, even profit from it.  VAI<span className="logoSetupweight">RIFY</span> will assign one of our staff to assist you in collecting your reviews over the internet and put them in one place, where they cant be tampered with, and you determine where they are seen. where you go your reputation will follow, and when our community sees the TruRevu badge they will know they are seeing accurate reflection of you.“Its Your Reputation Take Control of it”  </p>
                </div>
                <div className="flex-1 mx-10 mt-4 mb-6">
                    <Button
                        className={
                            "flex items-center bg-gradient-to-b from-[#02227E] to-[#02227E] justify-center text-[#fff] font-bold text-[26px] py-7 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                        }
                        text={"Learn More"}
                        size="18px"
                        onClick={() => { }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SetupVairify;
