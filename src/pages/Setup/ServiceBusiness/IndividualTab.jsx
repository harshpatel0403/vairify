import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

import Button from '../../../components/Button'
import StaffService from "../../../services/StaffService";
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading/Index';

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
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
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
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <>
            <div className="p-[16px] rounded-[16px] lg:block hidden text-white">
                <div className="mx-5">
                    {individualOptions?.map((individual) => (
                        <div className="flex flex-row justify-between items-center social-border fav-follow bg-[#FFFFFF14] rounded-[12px] p-[12px] mb-5">
                            <div className="text-[18px] text-lef sub-title-class">
                                {individual.title}
                            </div>
                            <div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="notify-post" className="sr-only peer"
                                        checked={permissions[individual.name]}
                                        onChange={(e) => updatePermission(individual.name, e.target.checked)}
                                    />
                                    <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
                                </label>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center w-full max-w-[500px] mx-auto mb-[80px]">
                <Button
                    text={
                        !loading ? (
                            "Submit"
                        ) : (
                            <div className="flex items-center	justify-center pt-[6px]">
                                <Loading />
                            </div>
                        )
                    }
                    disabled={loading}
                    onClick={handleSubmitPermission}
                />
            </div>
        </>
    )
}
export default IndividualTab;