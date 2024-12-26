import requests from "./httpService";

const VaripayService = {
  addUserVaripay(body) {
    return requests.post(`/uservaripays/add-varipays`, body);
  },
  getUserVariapys(id, body) {
    return requests.get(`/uservaripays/${id}`, body);
  },
  userVariapayRequests(id, body) {
    return requests.get(`/uservaripayRequest/${id}`, body);
  },
  createUserVaripayRequest(body) {
    return requests.post(`/uservaripayRequest/create`, body);
  },
  comapareUserVaripays(user1Id, user2Id, body) {
    return requests.get(`/uservaripays/compare/${user1Id}/${user2Id}`, body);
  },
  deleteUserVaripayRequest(requestId, body) {
    return requests.delete(`/uservaripayRequest/${requestId}`, body);
  },
  updateUserVairipayRequest(requestId, body) {
    return requests.patch(`/uservaripayRequest/${requestId}`, body);
  },
};

export default VaripayService;
