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
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
} from "./actions";

// Pulling this through for the logout functionality
import { initialState } from "./appContext";

// -------------
// State is the current values that are in the reducer NOT the initial/default values
// -------------

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

  if (action.type === UPDATE_USER_BEGIN) {
    return { ...state, isLoading: true };
  }

  // If the user successfully updates --> It will fire these
  if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.userLocation,
      jobLocation: action.payload.jobLocation,
      showAlert: true,
      alertType: "success",
      alertText: "Update Profile Updated!",
    };
  }

  // If we fail to register then fire these off
  if (action.type === UPDATE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      // This will dynamically access the property based on the name
      [action.payload.name]: action.payload.value,
    };
  }

  if (action.type === CLEAR_VALUES) {
    const initialState = {
      // If the user is editing the job and at some point they decide that they're not going to do that
      // We should set it back to the default state
      isEditing: false,
      editJobId: "",
      position: "",
      company: "",
      // The value is in the actual state
      jobLocation: state.userLocation,
      jobType: "full-time",
      status: "pending",
    };
    return { ...state, ...initialState };
  }

  // When the user hits submit on add job
  if (action.type === CREATE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }

  // If the user creates a successful job
  if (action.type === CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "New Job Created",
    };
  }

  // If we fail to create a job then fire these off
  if (action.type === CREATE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === GET_JOBS_BEGIN) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }

  if (action.type === GET_JOBS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
      numOfPages: action.payload.numOfPages,
      alertType: "success",
      alertText: "Jobs loaded successfully",
    };
  }

  // throw new Error(`No such action : ${action.type}`);
};

export default reducer;
