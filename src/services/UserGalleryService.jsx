import requests from "./httpService";

const UserGalleryService = {
  uploadImages(body) {
    return requests.post(`/usergallery/upload`, body);
  },
  getUserGallery(userId, body) {
    return requests.get(`/usergallery/${userId}`, body);
  },
  addComments(body) {
    return requests.post(`/usergallery/add-comment`, body);
  },
  getSpeficComments(usserID, imageID, body) {
    return requests.get(
      `/usergallery/${usserID}/images/${imageID}/comments`,
      body
    );
  },
};

export default UserGalleryService;
