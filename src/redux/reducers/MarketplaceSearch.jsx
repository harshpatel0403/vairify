const initialState = {
  error: {},
  marketplace: {},
  marketplacedata: [],
  results: [],
  sendInvitation: [],
  vaiIdResult:{},
  deleteInvitation: {},
  myInvitation: [],
  getpost: [],
  getAllPost: [],
  getAllPostComment: []
};

export const HandleMarketplace = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_MARKETPLACE":
      return {
        ...state,
        marketplace: action.payload?.data,
      };
    case "GET_MARKETPLACE":
      return {
        ...state,
        marketplacedata: action.payload,
      };
    case "RESULT_MARKETPLACE":
      return {
        ...state,
        results: action.payload,
      };
    case "SEND_INVITATION":
      return {
        ...state,
        sendInvitation: action.payload,
        results: action.payload,
      };
    case "SEARCH_WITH_VAIID":
      return {
        ...state,
        vaiIdResult: action.payload
      };
    case "DELETE_INVITATION":
      return {
        ...state,
        deleteInvitation: action.payload,
      };
    case "MY_INVITATION":
      return {
        ...state,
        myInvitation: action.payload,
      };
    case "MY_INVITATION_STATUS_UPDATE": {
      state.myInvitation = state.myInvitation.map(item => {
        if(item._id === action.payload.inviteId) {
          item.invitee = item.invitee.map(invitee => {
            if(invitee.id === action.payload.userId) {
              invitee.status = action.payload.status
            }
            return invitee
          })
        }
        return item
      })
      return state
    }
    case "GET_POST":
      return {
        ...state,
        getpost: action.payload,
      };
    case "GETALL_POST":
      return {
        ...state,
        getAllPost: action.payload,
      };
    case "GETALL_POST_COMMENT":
      return {
        ...state,
        getAllPostComment: action.payload,
      };
    case "SET_LOADING":
      return { ...state, error: action?.payload?.response };

    default:
      return state;
      break;
  }
};
