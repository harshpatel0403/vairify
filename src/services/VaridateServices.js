import requests from "./httpService";

const VaridateService = {
  getServices(userId) {
    return requests.get(`/services/get-services/${userId}`);
  },
  getUserVariapys(id, body) {
    return requests.get(`/uservaripays/${id}`, body);
  },
  userVariapayRequests(id, body) {
    return requests.get(`/uservaripayRequest/${id}`, body);
  },
  createAppointment(body, options = {}) {
    return requests.post(`/varidate/add-appointment`, body, options);
  },
  comapareUserVaripays(user1Id, user2Id, body) {
    return requests.get(`/uservaripays/compare/${user1Id}/${user2Id}`, body);
  },
  deleteUserVaripayRequest(requestId, body) {
    return requests.delete(`/uservaripayRequest/${requestId}`, body);
  },
  getAppointments(userId, query = '') {
    return requests.get(`/varidate/appointments/${userId}${query}`)
  },
  getPastAppointments(userId) {
    return requests.get(`/varidate/appointment/history/${userId}`)
  },
  getVaiNowAppointments(userId) {
    return requests.get(`/varidate/vai-now/appointments/${userId}`)
  },
  getVaiCheckAppointments(userId) {
    return requests.get(`/varidate/vai-check/appointments/${userId}`)
  },
  updateAppointment(userId, appointmentId, body, options = {}) {
    return requests.put(`/varidate/appointment/${userId}/${appointmentId}`, body, options)
  },
  fetchUserDetails(userId) {
    return requests.get(`/users/fetch/${userId}`)
  },

  fetchMarketPlaceUserDetails(userId) {
    return requests.get(`/users/fetch/marketplace/${userId}`)
  },
  fetchReviews(userId) {
    return requests.get(`/varidate/reviews/${userId}`)
  },
  getAppointmentsCount(userId) {
    return requests.get(`/varidate/appointments-count/${userId}`)
  },
  postReview(revieweeId, appointmentId, userId, body) {
    return requests.post(`/varidate/review/${revieweeId}/${appointmentId}/${userId}`, body)
  },

  vairifyNowSearch(payload) {
    return requests.post('/vairifynow/invitation', payload)
  },

  vairifyNowRequestLocation(userId, profileId) {
    return requests.post(`/vairifynow/request-location/${userId}/${profileId}`, {})
  },

  vairifyNowUpdateLocationRequest(notificationId, payload) {
    return requests.put(`/vairifynow/request-location/update/${notificationId}`, payload)
  },
  vairifyNowFetchLocationRequests(userId) {
    return requests.get(`/vairifynow/request-location/${userId}`)
  }
};

export default VaridateService;
