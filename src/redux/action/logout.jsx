import { persistor } from "../store";
import * as serviceWorker from "../../serviceWorker.js"
import { unsubscribeUser } from "../../subscription.js";

export const logout = () => (dispatch) => {
  // Dispatch actions to reset relevant parts of the state
  dispatch({ type: "LOGIN" });
  dispatch({ type: "CREATE_USER" });
  dispatch({ type: "VERIFY_OTP" });
  dispatch({ type: "LANGUAGE_STATE" });
  dispatch({ type: "GET_COUNTRY" });
  dispatch({ type: "CREATE_MARKETPLACE" });
  dispatch({ type: "RESULT_MARKETPLACE" });
  dispatch({ type: "GET_MARKETPLACE" });
  dispatch({ type: "SEND_INVITATION" });
  dispatch({ type: "MY_INVITATION" });
  dispatch({ type: "CREATE_POST" });
  dispatch({ type: "CREATE_PROFILE" });
  dispatch({ type: "GET_PROFILE" });
  dispatch({ type: "CREATE_SERVICES" });
  dispatch({ type: "GET_SERVICES" });
  dispatch({ type: "SELECT_SERVICES" });
  dispatch({ type: "DISCOUNT_COUPON" });
  dispatch({ type: "GENERATE_COUPON" });
  dispatch({ type: "RESET_SELECT_SERVICES" });

  // ...

  // Purge the Redux Persist store
  persistor.purge();
  
  unsubscribeUser();
  serviceWorker.unregister();
};
