import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../../components/Button';
import DateGuardService from '../../../services/DateGuardService';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';
import DateGuardSelectGroup from "../../../pages/Setup/Dateguard/DateGuardSelectGroup";

export default function DateGuardEditGroup() {
    const params = useParams()
    const nav = useNavigate()

    const [loading, setLoading] = useState(false)
    const [updateNameLoading, setUpdateNameLoading] = useState(false)
    const [groupDetails, setGroupDetails] = useState({})
    const [redirectToSelectGroup, setRedirectToSelectGroup] = useState(false);


    // Debounced search function using lodash
    const debouncedvalue = useMemo(() => {
        return debounce(async (query, otherData = {}) => {
            setUpdateNameLoading(true);
            try {
                // Simulate an API request (replace with your actual search logic)
                await DateGuardService.updateGroup(params.groupId, {
                    ...otherData,
                    groupName: query
                })
                toast.success('Group updated successfully');
                setRedirectToSelectGroup(true);
            } catch (error) {
                console.error('Error performing search:', error);
            } finally {
                setUpdateNameLoading(false);
            }
        }, 500); // 500ms delay
    }, [])

    useEffect(() => {
        return () => {
            debouncedvalue.cancel()
        }
    }, [])


    useEffect(() => {
        if (!params.groupId) {
            toast.error('Invalid Url')
            nav(-1)
            return
        }
        setLoading(true)
        DateGuardService.getSingleGroup(params.groupId)
            .then(res => {
                setGroupDetails(res)
            })
            .catch(error => {
                console.log(error)
                toast.error(error?.response?.data?.error || error?.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const handleInputChange = (e) => {
        setGroupDetails({ ...groupDetails, name: e.target.value })
        debouncedvalue(e.target.value, groupDetails)
    }

    if (loading) {
        return (
            <div className='min-h-[calc(100vh-160px)] flex flex-col justify-center items-center'>
                <div className='text-white h-full flex justify-center items-center'>
                    <div className='mt-5 flex items-center justify-center'>
                        <span
                            data-te-loading-icon-ref
                            class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffffff7d] border-r-[#405fc4] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"></span>
                        <p className='font-bold text-[14px] text-white change-font-family ml-4'>Loading...</p>
                    </div>
                </div>
            </div>
        )
    }
    if (redirectToSelectGroup) {
        nav(`/dateguard/add-member/${params.groupId}`)
        // return <DateGuardSelectGroup />;
    }

    return (
        <div className='min-h-[calc(100vh-160px)]'>
            <div className='w-full mx-auto flex flex-col justify-center items-center pt-2'>
                <div className='w-full mx-auto flex items-center justify-center'><span className='font-bold text-[30px] text-[#05B7FD] change-font-family'>Date Guard</span></div>
                <div className='w-full mx-auto flex items-center justify-center mt-4'><div className='w-[67px] h-[82px]'><img src={'/images/DateGuardMask.png'} alt="Date Guard Mask" /></div></div>
                <div className='w-full mx-auto flex items-center justify-center mt-4'><span className='font-bold text-[20px] text-[#D9D9D9] change-font-family'>Edit Groups Name Group</span></div>
                <div style={{ marginBottom: '200px' }} className='w-full mx-auto flex flex-col justify-center items-center mt-4'>
                    <div className='relative'>
                        <div style={{ left: '2px' }} className='absolute w-[44px] z-20'>
                            <Button text="+" className='font-bold text-[35px] rounded-[50%] bg-[#05B7FD] h-[44px] flex items-center justify-center pb-2' size="44px" />
                        </div>
                        <div className='relative w-[196px] h-[45px] bg-[#40355C] rounded-[25px] border-2 border-[#4200FF]'>
                            <input
                                disabled={updateNameLoading}
                                value={groupDetails.name}
                                onChange={handleInputChange}
                                type='text'
                                className='text-center leading-[45px] font-bold text-[24px] text-white relative change-font-family w-full bg-transparent transparent-input'
                            />
                        </div>
                        {updateNameLoading && (
                            <div className='mt-5 flex items-center justify-center'>
                                <span
                                    data-te-loading-icon-ref
                                    class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffffff7d] border-r-[#405fc4] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"></span>
                                <p className='font-bold text-[14px] text-white change-font-family ml-4'>Loading..</p>
                            </div>
                        )}
                    </div>
                    {/* <div className='relative mt-5'><div style={{ left: '2px' }} className='absolute w-[44px] z-20'><Button text="+" className='font-bold text-[35px] rounded-[50%] bg-[#05B7FD] h-[44px] flex items-center justify-center pb-2' size="44px" /></div><div className='relative w-[245px] h-[45px] bg-[#4200FF] rounded-[25px] border-2 border-[#4200FF]'><span style={{ left: '20px' }} className='font-bold text-[24px] text-white relative change-font-family'>Add/Members</span></div></div> */}
                </div>
            </div>
        </div>
    );
}