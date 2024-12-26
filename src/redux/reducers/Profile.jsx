const initialState = {
  error: {},
  profileservices: {},
  profiledata: {},
};

export const HandleProfile = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_PROFILE":
      return {
        ...state,
        profileservices: action.payload?.data,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        profileservices: action.payload?.data,
      };
    case "SET_LOADING":
      return {
        ...state,
        error: action?.payload?.response
      };

    case "GET_PROFILE_DATA_REQUEST":
      return {
        ...state,
        profiledata: action.payload,
      };
    case "GET_PROFILE_DATA_SUCCESS":
      return {
        ...state,
        loading: true,
        profiledata: action.payload,
      };
    case "GET_PROFILE_DATA_FAILURE":
      return {
        ...state,
        loading: true,
        error: action?.payload?.response

      };
    default:
      return state;
      break;
  }
};
