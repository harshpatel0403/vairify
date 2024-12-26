export const HandleAdvancedSelectServices = (data) => {
    return async (dispatch) => {
      try {
        return dispatch({
          type: "ADVANCE_SERVICES",
          payload: data,
        });
      } catch (err) {
        return dispatch({
          type: "SET_LOADING",
          payload: err.response,
        });
      }
    };
  };