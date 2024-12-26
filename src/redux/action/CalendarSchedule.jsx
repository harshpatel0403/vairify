import BaseAPI from "../../BaseAPI";
import { instance as axios } from "../../services/httpService";

export const HandleCreateCalendarSchedule = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/calendar/create`,
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
export const HandleEditCalendarSchedule = (id, data) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `/calendar/edit/${id}`,
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
export const HandleGetCalendarSchedule = (data, inquiry) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `/calendar/get-calendar/${data}`
      );
      return dispatch({
        type: "GET_SCHEDULE",
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
export const HandleDeleteCalendarSchedule = (id, data) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `/calendar/delete/${id}`
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

export const HandleCreateCalendarSetting = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/calendar/create/setting`,
        data
      );
      return dispatch({
        type: "CREATE_SETTING",
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

export const HandleGetCalendarSettings = (data, inquiry) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `/calendar/get/settings/${data}`
      );
      return dispatch({
        type: "GET_SETTINGS",
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