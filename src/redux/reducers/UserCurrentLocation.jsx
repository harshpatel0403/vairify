const initialState = {
  error: {},
  currentLocation: {},
};

export const HandleCurrentLocation = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOCATION":
      return {
        ...state,
        currentLocation: action?.payload,
      };
    case "SET_LOADING":
      return { ...state, error: action?.payload?.response };

    default:
      return state;
      break;
  }
};
