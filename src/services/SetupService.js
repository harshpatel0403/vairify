import requests from "./httpService";

const SetupService = {
  allLanguages(body) {
    return requests.get(`/country/alllangauges`, body);
  },
  getGrtPackages(body) {
    return requests.get(`/grtPackage/all`, body);
  },
  
};

export default SetupService;
