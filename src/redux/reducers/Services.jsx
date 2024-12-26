const initialState = {
  error: {},
  services: {},
  getservices: [],
  selectServices: [],
};

export const HandleServices = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_SERVICES":
      return {
        ...state,
        services: action.payload?.data,
      };
    case "GET_SERVICES":
      return {
        ...state,
        getservices: action.payload,
      };
    case "SELECT_SERVICES":
      return {
        ...state,
        selectServices: action?.payload,
      };
      case "RESET_SELECT_SERVICES":
      return {
        ...state,
        selectServices: [], // Reset to an empty array
      };
    case "SET_LOADING":
      return { ...state, error: action?.payload?.response };

    default:
      return state;
      break;
  }
};
