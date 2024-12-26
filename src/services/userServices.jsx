import requests from "./httpService";

const UserService = {
  generateToekn(body) {
    return requests.post(`/coupons/generate-coupons`, body);
  },
  getUserCoupons(id, body) {
    return requests.get(`/coupons/${id}`, body);
  },
  createPaymentContent(body) {
    return requests.get(`/create-payment-intent-customers`, body);
  },
  getUserTokens(id, body) {
    return requests.get(`/users/tokens/${id}`, body);
  },
  addUserTokens(id, body) {
    return requests.post(`/users/tokens/${id}`, body);
  },
  uploadProfileImage(body) {
    return requests.post(`/users/profileUpload`, body);
  },
  uploadFaceVerificationImage(body) {
    return requests.post(`/users/upload-face-verification-image`, body);
  },
  generateSdkToken(body) {
    return requests.post(`/users/sdk-token`, body);
  },

  // get incall addresses
  getIncallAddresses(userId) {
    return requests.get(`/users/incall-addresses/${userId}`);
  },

  // save incall addresses
  saveIncallAddresses(userId, body) {
    return requests.post(`/users/incall-addresses/${userId}`, body);
  },

  // update incall addresses
  updateIncallAddresses(userId, id, body) {
    return requests.put(`/users/incall-addresses/${userId}/${id}`, body);
  },

  // get available status
  getAvailableStatus(userId) {
    return requests.get(`/users/available-status/${userId}`);
  },

  // update available status
  updateAvailableStatus(userId, body) {
    return requests.post(`/users/available-status/${userId}`, body);
  },

  // get incall addresses
  getFavLocations(userId) {
    return requests.get(`/users/favourite-locations/${userId}`);
  },

  updateUserPreferences(userId, body) {
    return requests.post(`/users/update-preferences/${userId}`, body);
  },

  signContract(userId) {
    return requests.post(`/users/sign-contract/${userId}`);
  },

  changePassword(userId, payload) {
    return requests.post(`/users/change-password/${userId}`, payload);
  },

  getPublicUser(vaiId) {
    return requests.get(`/public/${vaiId}`);
  },
};

export default UserService;
