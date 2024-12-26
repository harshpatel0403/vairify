import requests from "./httpService";

const SocialServices = {
  addUserSocial(body) {
    return requests.post(`/usersocials/add-socials`, body);
  },
  getUserSocial(id, body) {
    return requests.get(`/usersocials/${id}`, body);
  },
};

export default SocialServices;
