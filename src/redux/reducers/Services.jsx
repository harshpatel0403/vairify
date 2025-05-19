const initialState = {
  error: {},
  services: {},
  getservices: [],
  selectServices: [],
  loading: true,
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
        loading: false,
      };
    case "SELECT_SERVICES":
      return {
        ...state,
        selectServices: action?.payload,
      };
    case "RESET_SELECT_SERVICES":
      return {
        ...state,
        selectServices: [],
      };
    case "SET_LOADING":
      return {
        ...state, loading: false, error: action?.payload?.response
      };

    default:
      return state;
      break;
  }
};
