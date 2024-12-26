const SelfVerificationProcess = () => {
    return (
        <div className="bg-[#B9BBCB] rounded-3xl flex items-center"> 
        <div className="w-full main-container">
            <div className="w-full flex flex-col items-center justify-center mx-auto w-max-370">
                {/* <div className="grid grid-flow-col grid-cols-1 gap-4">
                    <div className="relative flex flex-col items-center justify-start">
                        <div className="relative top-6">
                            <img
                                src={import.meta.env.BASE_URL + "images/VectorLogo1.png"}
                                alt="Vector Logo 1"
                            />
                        </div>
                        <div className="relative bottom-2 left-4">
                            <img
                                src={import.meta.env.BASE_URL + "images/VectorLogo2.png"}
                                alt="Vector Logo 2"
                            />
                        </div>
                    </div>
                </div> */}
                <div className="relative mt-8">
                    <img width={'250px'} 
                        src={'/images/chainpass_id_logo.png'}
                        alt="asdf"
                    /> 
                </div> 
                <div className="py-6 w-60 mt-5">
                    <span className="text-2xl font-semibold leading-snug text-[#000000]">Your verification is under process.</span>
                </div>
                <div className="py-10">
                    <span className="text-3xl font-bold text-[#000000]">PLEASE WAIT....</span>
                </div>
            </div>
        </div>
        </div>
    );
};

export default SelfVerificationProcess;
