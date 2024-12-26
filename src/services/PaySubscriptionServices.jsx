import requests from "./httpService";

const PaySubscriptionServices = {
  paySubScription(body) {
    return requests.post(`/transaction/pay_subscription`, body);
  },
  createTransaction(body) {
    return requests.post(`/transaction/create`, body);
  },
  subscribeMembership(body) {
    return requests.post(`/stripe/subscribe-membership`, body);
  },

  cancelVairifyMemberShip(id, body) {
    return requests.post(`/profile/cancelled_membership/${id}`, body);
  },
  cancelVAIMemberShip(id, body) {
    return requests.post(`/profile/cancelled_kyc/${id}`, body);
  },

  renewVairifyMembership(body) {
    return requests.post(`/transaction/renew_membership_plan`, body);
  },
  renewVAIMembership(body) {
    return requests.post(`/transaction/renew_kyc_plan`, body);
  },

  getUserTransactions(id) {
    return requests.get(`/transaction/getUserTransactions/${id}`);
  },
};

export default PaySubscriptionServices;
