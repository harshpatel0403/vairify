const initialState = {
    error: {},
    userGallary: [],
    loading: false,
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
                loading: true,
                userGallary: action.payload
            };
        case "GET_USER_GALLARY_DATA_FAILURE":
            return {
                ...state,
                loading: true,
                error: action?.payload?.response
            };
        default:
            return state;
    }
};