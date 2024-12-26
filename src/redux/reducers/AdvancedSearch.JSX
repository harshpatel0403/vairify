const initialState = {
    error: {},
    services: [],
  };
  
  export const HandleAdvanceServices = (state = initialState, action) => {
    switch (action.type) {
      case "ADVANCE_SERVICES":
        return {
          ...state,
          services: action.payload,
        };
      case "SET_LOADING":
        return { ...state, error: action?.payload?.response };
  
      default:
        return state;
        break;
    }
  };
  