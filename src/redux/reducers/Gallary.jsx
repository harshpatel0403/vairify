const initialState = {
    error: {},
    userGallary: [],
    loading: true,
};

export const HandleGallary = (state = initialState, action) => {
    switch (action.type) {
        case "GET_USER_GALLARY_DATA_REQUEST":
            return {
                ...state,
                error: null,
            };
        case "GET_USER_GALLARY_DATA_SUCCESS":
            return {
                ...state,
                loading: false,
                userGallary: action.payload
            };
        case "GET_USER_GALLARY_DATA_FAILURE":
            return {
                ...state,
                loading: false,
                error: action?.payload?.response
            };
        default:
            return state;
    }
};