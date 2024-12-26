import requests from "./httpService";

const NotificationServices = {
  getAllNotifications(userId) {
    return requests.get(`/notification/${userId}`);
  },
  markNotification(notificationId) {
    return requests.patch(`/notification/${notificationId}`);
  },
  getUserVariapys(id, body) {
    return requests.get(`/uservaripays/${id}`, body);
  },
};

export default NotificationServices;
