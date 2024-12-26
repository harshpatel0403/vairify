import requests from "./httpService";

const MyVairifyService = {
  getMyVairifyList(id) {
    return requests.get(`/profile/get_my_vairify/${id}`);
  },
  getMyFollowers(id) {
    return requests.get(`/profile/get_my_followers/${id}`);
  },
  addFollow(follower_id, body) {
    return requests.post(`/profile/follow/${follower_id}`, body);
  },
  removeFollow(follower_id, body) {
    return requests.post(`/profile/unfollow/${follower_id}`, body);
  },
  addFavorite(id, body) {
    return requests.post(`/profile/favourite/${id}`, body);
  },
  removeFavorite(id, body) {
    return requests.post(`/profile/unfavourite/${id}`, body);
  },
  updateWhenToNotify(id, body) {
    return requests.post(`/profile/update_notify/${id}`, body);
  },
  getNotifyRules(userId, followerId) {
    return requests.get(`/profile/notify_rules/${userId}/${followerId}`);
  },
};

export default MyVairifyService;
