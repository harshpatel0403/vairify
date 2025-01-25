import requests from "./httpService";

const KycService = {
  addDoc(body) {
    return requests.post(`/kyc/addDoc`, body);
  },
  uploadFrontDoc(body) {
    return requests.post(`/kyc/uploadfrontDoc`, body);
  },
  uploadBackDoc(body) {
    return requests.post(`/kyc/uploadBackDoc`, body);
  },
  uploadSelfie(body) {
    return requests.post(`/kyc/livePhoto`, body);
  },
  runCheck(body) {
    return requests.post(`/kyc/runCheck`, body);
  },
  checkResult(body) {
    return requests.post(`/kyc/getResults`, body);
  },
  validateDocument(body) {
    return requests.post(`/kyc/validateDocument`, body);
  },
  DocCheckstatus(documentCheckId) {
    return requests.get(`/kyc/DocCheckstatus?documentCheckId=${documentCheckId}`);
}
  
};

export default KycService;
