const initialState = {
  error: {},
  services: {},
  getservices: [],
  selectServices: [],
  getschedule: [],
  getsettings: {},
};

export const HandleCalendarSchedule = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_SERVICES":
      return {
        ...state,
        services: action.payload?.data,
      };
    case "GET_SCHEDULE":
      return {
        ...state,
        getschedule: action.payload,
      };
    case "SELECT_SERVICES":
      return {
        ...state,
        selectServices: action?.payload,
      };
    case "GET_SETTINGS":
      return {
        ...state,
        getsettings: action?.payload,
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
