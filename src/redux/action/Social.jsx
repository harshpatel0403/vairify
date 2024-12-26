import BaseAPI from "../../BaseAPI";
import { instance as axios } from "../../services/httpService";
console.log("🚀 ~ file: Auth.jsx:3 ~ BaseAPI:", BaseAPI);

export const HandlegetUserSocial = (data) => {
    return async (dispatch) => {
      dispatch({ type: "GET_SOCIAL_LINKS_REQUEST" });

      try {
        const response = await axios.get(`/usersocials/${data}`);
        return dispatch({
          type: "GET_SOCIAL_LINKS_SUCCESS",
          payload: response?.data,
        });
      } catch (err) {
        return dispatch({
          type: "GET_SOCIAL_LINKS_FAILURE",
          payload: err.response,
        });
      }
    };
  };