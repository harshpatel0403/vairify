import axios from "axios";

export const HandleVairipay = (data) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "VAIRIPAY_STATE",
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
