const initialState = {
  discountCoupon: {},
  error: {},
  geberateCoupon: {},
  kycuserPlan: {},
  membershipUserPlan: {},
};

export const HandleVAI = (state = initialState, action) => {
  switch (action.type) {
    case "DISCOUNT_COUPON":
      return {
        ...state,
        discountCoupon: action.payload,
      };
    case "GENERATE_COUPON":
      return {
        ...state,
        geberateCoupon: action.payload?.data,
      };
    case "GET_KYC_USER_PLAN":
      return {
        ...state,
        kycuserPlan: action.payload,
      };
    case "GET_MEMBERSHIP_USER_PLAN":
      return {
        ...state,
        membershipUserPlan: action.payload,
      };
    case "SET_LOADING":
      return { ...state, error: action?.payload?.response };
    default:
      return state;
      break;
  }
};
