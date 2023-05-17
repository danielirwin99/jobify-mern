import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
} from "./actions";

// Pulling this through for the logout functionality
import { initialState } from "./appContext";

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

  // If we attempt to create a user / register a user fire off this
  if (action.type === REGISTER_USER_BEGIN) {
    return { ...state, isLoading: true };
  }

  // If the user successfully registers fire all of these payloads / actions
  if (action.type === REGISTER_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.userLocation,
      jobLocation: action.payload.jobLocation,
      showAlert: true,
      alertType: "success",
      alertText: "User Created! Redirecting...",
    };
  }

  // If we fail to register then fire these off
  if (action.type === REGISTER_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  // If we attempt to create a user / register a user fire off this
  if (action.type === LOGIN_USER_BEGIN) {
    return { ...state, isLoading: true };
  }

  // If the user successfully registers fire all of these payloads / actions
  if (action.type === LOGIN_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.userLocation,
      jobLocation: action.payload.jobLocation,
      showAlert: true,
      alertType: "success",
      alertText: "Login Successful!! Redirecting...",
    };
  }

  // If we fail to register then fire these off
  if (action.type === LOGIN_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  // If we click the sidebar
  if (action.type === TOGGLE_SIDEBAR) {
    return {
      ...state,
      isLoading: false,
      // We are showing whatever is the opposite of the current value
      showSidebar: !state.showSidebar,
    };
  }

  // If we click the logout button
  if (action.type === LOGOUT_USER) {
    return {
      // The default values from appContext.js INSTEAD of ...state
      ...initialState,
      // These three values override the localStorage data before it updates and returns it to these
      user: null,
      userLocation: "",
      jobLocation: "",
    };
  }

  throw new Error(`No such action : ${action.type}`);
};

export default reducer;
