import requests from "./httpService";

const ProfilePermissionsServices = {
  getMyProfilePermissions(id) {
    return requests.get(`/users/user/${id}`);
  },

  updateProfilePermissions(id, body) {
    return requests.post(`/profile/update_profile_permission/${id}`, body);
  },
};

export default ProfilePermissionsServices;
