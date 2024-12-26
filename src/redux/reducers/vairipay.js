const initialState = {
  vairipayData: [],
};

export const TotalVairipay = (state = initialState, action) => {
  switch (action.type) {
    case "VAIRIPAY_STATE":
      return {
        ...state,
        vairipayData: [...state.vairipayData, action.payload], 
      };
    default:
      return state;
      break;
  }
};
