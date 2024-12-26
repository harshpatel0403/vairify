import { instance as axios } from "../../services/httpService";

export const HandleUserCurrentLocation = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_GEOLOCATION_URL}`
      );
      return dispatch({
        type: "USER_LOCATION",
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
