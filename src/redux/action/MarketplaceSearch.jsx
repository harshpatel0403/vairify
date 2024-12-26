import BaseAPI from "../../BaseAPI";
import { instance as axios } from "../../services/httpService";

export const HandleCreateMarketPlace = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/market/create`,
        data
      );
      return dispatch({
        type: "CREATE_MARKETPLACE",
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
export const HandleEditMarketPlace = (id, data) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `/market/edit/${id}`,
        data
      );
      return dispatch({
        type: "CREATE_MARKETPLACE",
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
export const HandleResultMarketPlace = (id, status) => {
  return async (dispatch) => {
    try {
      const apiUrl = status
        ? `/market/get/${id}?status=${status}`
        : `/market/get/${id}`;

      const response = await axios.get(apiUrl);
      return dispatch({
        type: "RESULT_MARKETPLACE",
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

export const HandleGetMarketPlace = (data, inquiry) => {
  return async (dispatch) => {
    try {
      // Check if 'inquiry' is defined before including it in the URL
      const apiUrl = inquiry
        ? `/market/get-market/${data}?inquiry=${inquiry}`
        : `/market/get-market/${data}`;

      const response = await axios.get(apiUrl);

      return dispatch({
        type: "GET_MARKETPLACE",
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

export const HandleInvitation = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/market/invitation`,
        data
      );
      return dispatch({
        type: "SEND_INVITATION",
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

export const HandleMarketplaceInvitation = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/market/marketplaceInvitation`,
        data
      );
      return dispatch({
        type: "SEND_INVITATION",
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

export const HandleSearchWithVaiId = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `/market/get-vairify/${id}`);
      return dispatch({
        type: "SEARCH_WITH_VAIID",
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

export const HandleDeleteInvitation = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `/market/delete/${data}`
      );
      return dispatch({
        type: "DELETE_INVITATION",
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

export const HandleUpdateInvitationStatus = (inviteId, userId, status) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `/market/edit/${inviteId}`,
        {
          inviteeId: userId,
          inviteeStatus: status
        }
      );
      return dispatch({
        type: "MY_INVITATION_STATUS_UPDATE",
        payload: { inviteId, userId, status },
      });
    } catch (err) {
      return dispatch({
        type: "SET_LOADING",
        payload: err.response,
      });
    }
  };
};

export const HandleMyInvitation = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `/market/invitation/${data}`
      );
      return dispatch({
        type: "MY_INVITATION",
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

export const HandleCreateNewPost = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `/market/post/create`,
        data
      );
      return dispatch({
        type: "CREATE_POST",
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
export const HandleGetNewPost = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `/market/post/get/${data}`
      );
      return dispatch({
        type: "GET_POST",
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

export const HandleDeletePost = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `/market/post/delete/`, {
        params: data
      }
      );
      return dispatch({
        type: "DELETE_POST",
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
export const HandleGetAllPost = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/market/post/getallpost`);
      return dispatch({
        type: "GETALL_POST",
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

export const HandleCommentsPost = (postId, data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/market/post/comment/${postId}`, data);
      return dispatch({
        type: "CREATE_POST_COMMENT",
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
export const HandleLikePost = (postId, data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/market/post/like/${postId}`, data);
      return dispatch({
        type: "CREATE_POST_LIKE",
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

export const HandleGetCommentsPost = (postId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/market/post/get/comment/${postId}`);
      return dispatch({
        type: "GETALL_POST_COMMENT",
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