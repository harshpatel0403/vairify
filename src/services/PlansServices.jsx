import requests from "./httpService";

const PlansServices = {
  getPlansByUserType(userType) {
    return requests.get(`/plans/getKycPlanByUserType?userType=${userType}`);
  },
  getMigrationByUserType(userType) {
    return requests.get(`/plans/getMigrationPlanByUserType?userType=${userType}`);
  },
  getVairifyMembershipPlans(userType) {
    return requests.get(
      `/plans/getMemberShipPlanByUserType?userType=${userType}`
    );
  },
};

export default PlansServices;
