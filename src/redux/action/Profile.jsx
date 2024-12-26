import BaseAPI from "../../BaseAPI";
import { instance as axios } from "../../services/httpService";

export const HandleProfile = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/profile/create`, data);
      return dispatch({
        type: "CREATE_PROFILE",
        payload: response,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};
export const UpdateProfile = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`/profile/${data.userId}/update`, data);
      return dispatch({
        type: "UPDATE_PROFILE",
        payload: response,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};
export const HandleGetProfile = (data) => {
  return async (dispatch) => {
    dispatch({ type: "GET_PROFILE_DATA_REQUEST" });
    try {
      const response = await axios.get(`/profile/get-profile/${data}`, data);
      return dispatch({
        type: "GET_PROFILE_DATA_SUCCESS",
        payload: response.data,
      });
    } catch (err) {
      return dispatch({
        type: "GET_PROFILE_DATA_FAILURE",
        payload: err.response,
      });
    }
  };
};
