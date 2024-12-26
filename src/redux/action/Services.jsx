import BaseAPI from "../../BaseAPI";
import { instance as axios } from "../../services/httpService";

export const HandleServices = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/services/create`,
        data
      );
      return dispatch({
        type: "CREATE_SERVICES",
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
export const HandleEditServices = (id, data) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `/services/edit/${id}`,
        data
      );
      return dispatch({
        type: "EDIT_SERVICES",
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
export const HandleGetServices = (data, inquiry) => {
  return async (dispatch) => {
    try {
      const apiUrl = inquiry
        ? `/services/get-services/${data}?usertype=${inquiry}`
        : `/services/get-services/${data}`;

      const response = await axios.get(apiUrl);
      return dispatch({
        type: "GET_SERVICES",
        payload: response.data,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};

export const HandleSelectServices = (data) => {
  console.log(
    "🚀 ~ file: Services.jsx:44 ~ HandleSelectServices ~ data:",
    data
  );
  return async (dispatch) => {
    try {
      return dispatch({
        type: "SELECT_SERVICES",
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
