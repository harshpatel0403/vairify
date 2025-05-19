import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../../components/Button';
import DateGuardService from '../../../services/DateGuardService';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';
import DateGuardSelectGroup from "../../../pages/Setup/Dateguard/DateGuardSelectGroup";
import Header from '../../../components/Header/Header';
import Loading from '../../../components/Loading/Index';
import PageTitle from '../../../components/PageTitle';
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
            <div className="flex justify-center align-center items-center h-[50vh]">
                <Loading />
            </div>
        )
    }
    if (redirectToSelectGroup) {
        nav(`/dateguard/add-member/${params.groupId}`)
        // return <DateGuardSelectGroup />;
    }

    return (
        <>
            <div className="container">
                <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                    <PageTitle title={"Date Guard"} />
                </div>
                <div className="flex items-center justify-center">
                    <img src="/images/setup/Disarm.svg" alt="guard" />
                </div>
                <div>
                    <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white my-[24px]">Edit Group Name</h3>
                </div>

                <div className='flex justify-center w-full'>
                    <input
                        disabled={updateNameLoading}
                        value={groupDetails.name}
                        onChange={handleInputChange}
                        placeholder='Edit Group Name'
                        type="text"
                        className=" border border-[#919EAB33] p-[16px] text-white text-[14px] font-normal bg-transparent rounded-lg w-full max-w-[500px]"
                    />
                </div>
                {updateNameLoading && (
                    <div className='mt-5 flex items-center justify-center'>
                        <Loading />
                        {/* <span
                            data-te-loading-icon-ref
                            class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffffff7d] border-r-[#405fc4] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"></span>
                        <p className='font-bold text-[14px] text-white  ml-4'>Loading..</p> */}
                    </div>
                )}
            </div>
        </>

    );
}