import BackButton from "../BackButton/backArrowButton";

export default function Header({ title = "" }) {
    return (
        <div className="fixed top-0 w-full z-[999] md:right-[7.5px] right-0">
            <div className="container">
                <div className="flex items-center justify-center w-full md:bg-[#1A2168] bg-transparent rounded-[400px] sm:px-[24px] sm:py-[10px] md:mt-[30px] mt-[26px] relative md:h-auto sm:h-[48px] h-[34px] relative z-[100] w-full">
                    <div className="absolute md:top-[10px] top-0 sm:left-[10px] left-0">
                        <BackButton className="sm:!bg-transparent transition-all duration-500 hover:!bg-[#FFFFFF14]" />
                    </div>

                    {!title && (
                        <div className="logo-img-container md:flex hidden">
                            <img src="/images/signup/logo.svg" className="sm:flex hidden w-[132px] h-[40px]" alt="img" />
                            <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex w-[132px] h-[40px]" alt="img" />
                        </div>
                    )}

                    {title && <h3 className="text-center font-medium text-[24px] text-white">{title}</h3>}
                </div>
            </div>
        </div>
    );
}
