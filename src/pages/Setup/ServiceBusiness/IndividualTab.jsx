import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

import Button from '../../../components/Button'
import StaffService from "../../../services/StaffService";
import { useNavigate } from 'react-router-dom';

const individualOptions = [
    {
        id: 1,
        title: 'Calendar',
        name: "calendarActivity",
        status: false
    },
    {
        id: 2,
        title: 'Chat/Voice',
        name: "callsActivity",
        status: false
    },
    {
        id: 3,
        title: 'VAIRIPAY',
        name: "varipayActivity",
        status: false
    },
    {
        id: 4,
        title: 'Gallery Photo',
        name: "socialPostActivity",
        status: false
    },
    {
        id: 5,
        title: 'Advertisement',
        name: "advertisementActivity",
        status: false
    },
    {
        id: 6,
        title: 'DateGaurd',
        name: "dateGuardActivity",
        status: false
    },
    {
        id: 7,
        title: 'Messages',
        name: "messagesActivity",
        status: false

    },
    {
        id: 8,
        title: 'Virtual Market Place',
        name: "marketPlaceActivity",
        status: false
    },
    {
        id: 9,
        title: 'Tokens',
        name: "tokensActivity",
        status: false
    },
    {
        id: 10,
        title: 'Facial Verification',
        name: "inAppFacialVerificationActivity",
        status: false
    }];


const IndividualTab = () => {
    const navigate = useNavigate();
    const { staffid } = useParams();
    const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        getStaffPermission()
    }, [])

    const getStaffPermission = () => {
        StaffService.fetchStaffPermission({ userId: UserDetails?._id }, staffid)
            .then((res) => {
                setPermissions(res.permissions)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updatePermission = (name, status) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [name]: status,
        }));
    };

    const handleSubmitPermission = () => {
        const body = {
            userId: UserDetails._id,
            staffId: staffid,
            features: permissions
        }

        StaffService.updateStaffPermission(body)
        .then((res) => {
            navigate("/service-business/user-list");
            toast("Permission assigned successfully", {
                hideProgressBar: true,
                autoClose: 1000,
                type: "success",
            });
        })
        .catch((err) => {
            toast(err?.response?.data?.data, {
                hideProgressBar: true,
                autoClose: 1000,
                type: "error",
            });
        })
    }

    return (
        <div className='pb-5'>
            <div className='px-6 pt-6'>
                {individualOptions?.map((individual) => (
                    <div className='flex flex-row pb-4 gap-4 items-center' key={individual.id}>
                        <div>
                            <label className="cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={permissions[individual.name]}
                                    onChange={(e) => updatePermission(individual.name, e.target.checked)}
                                />
                                <div className={`p-[8px] w-[54px] h-[32px] rounded-[72px] transition-colors duration-300 bg-gradient-to-b ${permissions[individual?.name] ? 'from-[#02227E] to-[#0247FF]' : 'from-[#02227E] to-[#0247FF]'}`}>
                                    <div className={`bg-[#b9bacc] w-4 h-4 rounded-full shadow-md ${permissions[individual?.name] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </label>
                        </div>
                        <div className='shadow-[0px 15px 20px 0px #00000040] border-2 !border-[#ccc] text-left py-2 px-5 w-full rounded-full justify-left items-center bg-gradient-to-b from-[#02227E] to-[#0247FF]'>
                            <span className='font-semibold text-white text-[20px]'>{individual.title}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center mx-4 mt-3 mb-5">
                <Button
                    className={
                        "flex items-center py-3 !w-auto px-10 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[23.4px] rounded-xl shadow-[0px_9px_20px_rgba(0,0,0,0.5)]"
                    }
                    text={"Submit"}
                    size="40px"
                    onClick={handleSubmitPermission}
                />
            </div>
        </div>
    )
}
export default IndividualTab;