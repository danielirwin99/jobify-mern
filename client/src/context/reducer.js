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
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  DELETE_JOB_ERROR,
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
      // Sets the page back to one when we make a change in the search function
      page: 1,
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

  // When we click on All Jobs tab
  if (action.type === GET_JOBS_BEGIN) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }

  // If it is a successful fetch
  if (action.type === GET_JOBS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
      numOfPages: action.payload.numOfPages,
    };
  }

  // If we click on edit job
  if (action.type === SET_EDIT_JOB) {
    // Searches to see if our job._id matches the one we clicked
    const job = state.jobs.find((job) => job._id === action.payload.id);

    // Once we have the job we want to pull out the following values
    const { _id, position, company, jobLocation, jobType, status } = job;

    // Return all the values that we passed through
    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
      status,
    };
  }

  // If we click delete on our frontend to delete a job
  if (action.type === DELETE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === DELETE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === EDIT_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === EDIT_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Successfully Edited Job",
    };
  }

  if (action.type === EDIT_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === SHOW_STATS_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }

  if (action.type === SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyApplications: action.payload.monthlyApplications,
    };
  }

  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      search: "",
      searchStatus: "all",
      searchType: "all",
      sort: "latest",
      sortOptions: ["latest", "oldest", "a-z", "z-a"],
    };
  }

  // If we click dispatch change page function we fire off this
  if (action.type === CHANGE_PAGE) {
    return { ...state, page: action.payload.page };
  }

  throw new Error(`No such action : ${action.type}`);
};

export default reducer;
