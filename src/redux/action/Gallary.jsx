import BaseAPI from "../../BaseAPI";
import { instance as axios } from "../../services/httpService";
console.log("🚀 ~ file: Gallary.jsx:3 ~ BaseAPI:", BaseAPI);


export const HandleGallaryData = (data) => {
  return async (dispatch) => {
    dispatch({ type: "GET_USER_GALLARY_DATA_REQUEST" });
    try {
      const response = await axios.get(`/usergallery/${data}`);
      return dispatch({
        type: "GET_USER_GALLARY_DATA_SUCCESS",
        payload: response?.data,
      });
    } catch (err) {
      return dispatch({
        type: "GET_USER_GALLARY_DATA_FAILURE",
        payload: err.response,
      });
    }
  };
};

