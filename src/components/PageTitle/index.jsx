export default function PageTitle({ title, isSmall }) {
    return (
        <div className={`font-semibold text-white md:bg-transparent text-center md:my-[48px] sm:mb-[48px] md:p-0 pt-[24px] z-[990] sm:pb-4 pb-3 w-full left-0 bg-[#060C4D] md:relative fixed top-[0px] ${isSmall?"sm:text-[28px] text-[22px]":"sm:text-[28px] text-[24px]"}`}>
            {title}
        </div>
    )
}