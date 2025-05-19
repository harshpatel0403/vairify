const initialState = {
  SignUp: {},
  Auth: {},
  notificationCount: 0,
  OTPEmail: {},
  ResetPassword: {},
  language: "",
  country: [],
  savedLocations: [],
  loading: true,
};

export const HandleAuth = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_USER":
      return {
        ...state,
        Auth: action.payload,
      };
    case "LOGIN":
      return {
        ...state,
        Auth: action.payload,
      };
    case "VERIFY_OTP":
      return {
        ...state,
        Auth: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        loading: false,
        Auth: {
          ...state?.Auth,
          data: {
            ...state?.Auth?.data,
            user: action.payload,
          },
        },
      };

    case "UPDATE_FACE_VERIFICATION_IMAGE":
      return {
        ...state,
        loading: false,
        Auth: {
          ...state?.Auth,
          data: {
            ...state?.Auth?.data,
            user: {
              ...state?.Auth?.data?.user,
              faceVerificationImage: action.payload,
            },
          },
        },
      };

    case "PURCHASE_MEMBERSHIP":
      return {
        ...state,
        loading: false,
        Auth: {
          ...state?.Auth,
          data: {
            ...state?.Auth?.data,
            user: {
              ...state?.Auth?.data?.user,
              subscription: action?.payload?.subscription,
              kyc: action?.payload?.kyc
            },
          },
        },
      };

      case "IS_KYC_COMPLETED_STATUS":
      return {
        ...state,
        loading: false,
        Auth: {
          ...state?.Auth,
          data: {
            ...state?.Auth?.data,
            user: {
              ...state?.Auth?.data?.user,
              isKycCompleted: action.payload,
            },
          },
        },
      };

    case "GET_MY_FOLLOWERS":
      return {
        ...state,
        Auth: {
          ...state?.Auth,
          data: {
            ...state?.Auth?.data,
            user: {
              ...state?.Auth?.data?.user,
              followers: action.payload,
            },
          },
        },
      };
    case "GET_MY_FAVOURITES":
      return {
        ...state,
        Auth: {
          ...state?.Auth,
          data: {
            ...state?.Auth?.data,
            user: {
              ...state?.Auth?.data?.user,
              favourites: action.payload,
            },
          },
        },
      };
    case "SEND_OTP":
      return {
        ...state,
        OTPEmail: action.payload?.email,
      };
    case "RESEND_OTP":
      return {
        ...state,
        OTPEmail: action.payload,
      };
    case "RESET_PASSWORD":
      return {
        ...state,
        ResetPassword: action.payload,
      };
    case "LANGUAGE_STATE":
      return {
        ...state,
        language: action.payload,
      };
    case "GET_COUNTRY":
      return {
        ...state,
        country: action.payload,
      };

    case "USER_LOCATION_SAVED":
      return {
        ...state,
        Auth: {
          ...state.Auth,
          data: {
            ...state.Auth.data,
            user: {
              ...state.Auth.data.user,
              savedLocations: action?.payload,
            },
          },
        },
      };
    case "GET_NOTIFICATION_COUNT":
      return {
        ...state,
        notificationCount: action.payload,
      };

    case "SET_LOADING":
      return { ...state, loading: false, error: action?.payload?.response };
    default:
      return state;
      break;
  }
};
