import requests from "./httpService";

const UserService = {
  createStaff(body) {
    return requests.post(`/business/createStaffProfile`, body);
  },
  fetchStaff(body) {
    return requests.post(`/business/listStaff`, body);
  },
  fetchStaffPermission(body, staffid) {
    return requests.post(`/business/getPermissions/${staffid}`, body);
  },
  updateStaffPermission(body) {
    return requests.post(`/business/assignPermissions`, body);
  },
};

export default UserService;
