import Button from "../../../components/Button"


const Groups = () => {
  return (
    <div className='main-container'>
    <div className='w-full mx-auto flex flex-col justify-center items-center pt-2'>
        <div className='w-full mx-auto flex items-center justify-center'><span className='font-bold text-[30px] text-[#05B7FD] change-font-family' >Date Guard</span></div>
        <div className='w-full mx-auto flex items-center justify-center mt-4'><div className='w-[67px] h-[82px]'><img src={'/images/DateGuardMask.png'} alt="Date Guard Mask" /></div></div>
        <div className='w-full mx-auto flex items-center justify-center mt-4'><span className='font-bold text-[30px] text-[#D9D9D9] change-font-family' >Edit Groups</span></div>
        <div className='w-full mx-auto flex items-center justify-center'><span className='font-bold text-[24px] text-[#D9D9D9] change-font-family' >Name Group</span></div>
        <div style={{marginBottom: '200px'}} className='w-full mx-auto flex flex-col justify-center items-center mt-4'>
            <div className='relative'><div style={{left: '2px'}} className='absolute w-[44px] z-20'><Button text="+" className='font-bold text-[35px] rounded-[50%] bg-[#05B7FD] h-[44px] flex items-center justify-center pb-2' size="44px" /></div><div className='relative w-[196px] h-[45px] bg-[#40355C] rounded-[25px] border-2 border-[#4200FF]'><span style={{left: '15px'}} className='font-bold text-[24px] text-white relative change-font-family'>Atlanta</span></div></div>
            <div className='relative mt-5'><div style={{left: '2px'}} className='absolute w-[44px] z-20'><Button text="+" className='font-bold text-[35px] rounded-[50%] bg-[#05B7FD] h-[44px] flex items-center justify-center pb-2' size="44px" /></div><div className='relative w-[245px] h-[45px] bg-[#4200FF] rounded-[25px] border-2 border-[#4200FF]'><span style={{left: '20px'}} className='font-bold text-[24px] text-white relative change-font-family'>Add/Members</span></div></div>
        </div>
    </div>
</div>
  )
}

export default Groups