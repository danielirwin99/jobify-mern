import { CLEAR_ALERT, DISPLAY_ALERT } from "./actions";

const reducer = (state, action) => {
  // If this action is fired --> Spread over the values and display them
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: "Danger",
      alertText: "Please provide all values",
    };
  }

  //   If this action is fired --> Set the values to these
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: "",
      alertText: "",
    };
  }

  throw new Error(`No such action : ${action.type}`);
};

export default reducer;
