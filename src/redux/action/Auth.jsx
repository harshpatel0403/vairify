import { instance as axios } from "../../services/httpService";

export const HandleSignUp = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/users/create`, data);
      return dispatch({
        type: "CREATE_USER",
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

export const HandleLogIn = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/users/login`, data);

      return dispatch({
        type: "LOGIN",
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

export const HandleUpdateUser = (userId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/users/updated-information/${userId}`);
      // localStorage.setItem("authorization", response.data.token);
      return dispatch({
        type: "UPDATE_USER",
        payload: response?.data,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};

export const HandleUpdateFollowers = (userId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/profile/get_my_followers/${userId}`);
      // localStorage.setItem("authorization", response.data.token);
      return dispatch({
        type: "GET_MY_FOLLOWERS",
        payload: response?.data,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};

export const HandleUpdateFavourites = (userId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/profile/get_my_favourites/${userId}`);
      // localStorage.setItem("authorization", response.data.token);
      return dispatch({
        type: "GET_MY_FAVOURITES",
        payload: response?.data,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};

export const HandleUser = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/users/user/${data}`);
      return dispatch({
        type: "UPDATE_USER",
        payload: response?.data?.user,
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};

export const SendOTP = (data) => {
  console.log("🚀 ~ file: Auth.jsx:43 ~ SendOTP ~ data:", data);
  return async (dispatch) => {
    try {
      const response = await axios.post(`/users/sendOtpCode`, {
        email: data,
      });
      response.email = data;
      return dispatch({
        type: "SEND_OTP",
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

export const VerifyOTP = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/users/verifyOtpCode`, data);
      localStorage.setItem("authorization", response.data.token);

      return dispatch({
        type: "VERIFY_OTP",
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

export const ResetPassword = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/users/forgotpassword`, {
        email: data?.email,
      });
      return dispatch({
        type: "RESET_PASSWORD",
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

export const VerifyResetPassword = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/users/verifypassword`, data);
      return dispatch({
        type: "VERIFY_RESET_PASSWORD",
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

export const HandleLanguage = (data) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "LANGUAGE_STATE",
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
export const HandleCountry = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/country/all`);
      return dispatch({
        type: "GET_COUNTRY",
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

export const HandleSaveLocation = (data, userId) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/users/save-location/${userId}`, data);
      return dispatch({
        type: "USER_LOCATION_SAVED",
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

export const HandleSaveNotificationCount = (data) => {
  return async (dispatch) => {
    return dispatch({
      type: "GET_NOTIFICATION_COUNT",
      payload: data,
    });
  };
};
