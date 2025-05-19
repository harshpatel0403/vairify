const initialState = {
  error: {},
  socialData: [],
  loading: true,
};

export const HandleSocial = (state = initialState, action) => {
  switch (action.type) {
    case "GET_SOCIAL_LINKS_REQUEST":
      return {
        ...state,
        error: null,
      };

    case "GET_SOCIAL_LINKS_SUCCESS":
      return {
        ...state,
        loading: false,
        socialData: action.payload,
        error: null,
      };

    case "GET_SOCIAL_LINKS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
