import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfilePermissionsServices from "../../../services/ProfilePermissionsServices";
import { HandleUpdateUser } from "../../../redux/action/Auth";
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";

const ProfilePermissions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState(false);
  const [selectedGalleryAccess, setSelectedGalleryAccess] = useState(false);
  const [selectedRates, setSelectedRates] = useState(false);

  const fetchProfilePermissions = async () => {
    setLoading(true);
    if (UserDetails?._id) {
      setSelectedServices(UserDetails?.allowUserToAccessServices);
      setSelectedGalleryAccess(UserDetails?.allowUserToAccessGallery);
      setSelectedRates(UserDetails?.allowUserCanRates);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleServicesAccess = async () => {
    try {
      await ProfilePermissionsServices.updateProfilePermissions(
        UserDetails?._id,
        {
          allowUserToAccessServices: !selectedServices,
        }
      );
      setSelectedServices(!selectedServices);
      await dispatch(HandleUpdateUser(UserDetails?._id));

      toast.success("Sucessfully update permissions!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to allow services access!");
    }
  };

  const handleGalleryAccess = async () => {
    try {
      await ProfilePermissionsServices.updateProfilePermissions(
        UserDetails?._id,
        {
          allowUserToAccessGallery: !selectedGalleryAccess,
        }
      );
      setSelectedGalleryAccess(!selectedGalleryAccess);
      await dispatch(HandleUpdateUser(UserDetails?._id));

      toast.success("Sucessfully update permissions!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to allow gallery access!");
    }
  };

  const handleRatesAccess = async () => {
    try {
      await ProfilePermissionsServices.updateProfilePermissions(
        UserDetails?._id,
        {
          allowUserCanRates: !selectedRates,
        }
      );
      setSelectedRates(!selectedRates);
      await dispatch(HandleUpdateUser(UserDetails?._id));

      toast.success("Sucessfully update permissions!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to allow gallery access!");
    }
  };

  useEffect(() => {
    fetchProfilePermissions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container h-full rounded-2xl">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Profile Permissions"} />
      </div>
      <div className="sm:mx-5">
        <div className="sm:p-[16px] rounded-[16px] block text-white">
          <div className="sm:mx-5">
            <div className="flex flex-row justify-between items-center social-border fav-follow bg-[#FFFFFF14] rounded-[12px] sm:p-[12px] p-[8px] mb-5">
              <div className="sm:text-[18px] text-sm text-lef sub-title-class">
                Allow users to access services
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="notify-post" className="sr-only peer"
                    checked={selectedServices}
                    onChange={handleServicesAccess} />
                  <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
                </label>
              </div>

            </div>
            <div className="flex flex-row justify-between items-center social-border fav-follow bg-[#FFFFFF14] rounded-[12px] sm:p-[12px] p-[8px] mb-5">
              <div className="sm:text-[18px] text-sm text-left sub-title-class">
                Allow users to access gallery
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="notify-trurevu" className="sr-only peer"
                    checked={selectedGalleryAccess}
                    onChange={handleGalleryAccess} />
                  <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
                </label>
              </div>

            </div>
            <div className="flex flex-row justify-between items-center social-border bg-[#FFFFFF14] rounded-[12px] sm:p-[12px] p-[8px] mb-5">
              <div className="sm:text-[18px] text-sm text-left sub-title-class">
                Allow users can TruRevu
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="notify-gallery-post" className="sr-only peer"
                    checked={selectedRates}
                    onChange={handleRatesAccess} />
                  <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePermissions;
