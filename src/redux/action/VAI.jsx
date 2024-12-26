import BaseAPI from "../../BaseAPI";
import { instance as axios } from "../../services/httpService";
console.log("🚀 ~ file: Auth.jsx:3 ~ BaseAPI:", BaseAPI);

export const HandleDiscountCoupon = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/coupons/apply-coupon`,
        data
      );
      return Promise.resolve(dispatch({
        type: "DISCOUNT_COUPON",
        payload: response.data,
      }));
    } catch (err) {
      return Promise.reject(dispatch({
        type: "SET_LOADING",
        payload: err.response,
      }));
    }
  };
};
export const HandleGenerateCoupon = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/coupons/generate-coupons`,
        data
      );
      return dispatch({
        type: "GENERATE_COUPON",
        payload: response,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};


export const HandlegetKycUserPlan = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/plans/getKycPlanByUserType?userType=${data}`);
      return dispatch({
        type: "GET_KYC_USER_PLAN",
        payload: response?.data,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};

export const HandlegetVairifyMembershipPlans = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/plans/getMemberShipPlanByUserType?userType=${data}`);
      return dispatch({
        type: "GET_MEMBERSHIP_USER_PLAN",
        payload: response?.data,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};

