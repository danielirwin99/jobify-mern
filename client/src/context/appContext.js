import React, { useReducer, useContext } from "react";
import axios from "axios";

import reducer from "./reducer";

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

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("location");

// The initial states of each / Default values
const initialState = {
  userLoading: true,
  isLoading: false,
  showAlert: false,
  //   What will show when the error pops up
  alertText: "",
  //   Which alert will show up
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || "",
  showSidebar: false,
  isEditing: false,
  // Our "Add Jobs" page states
  editJobId: "",
  position: "",
  company: "",
  jobLocation: userLocation || "",
  // Dropdown menu
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  // Default Value
  jobType: "full-time",
  // Dropdown menu
  statusOptions: ["interview", "declined", "pending"],
  // Default value
  status: "pending",
  // These are for our "All Jobs" page on the dashboard
  jobs: [],
  totalJobs: 0,
  page: 1,
  numOfPages: 1,
};

const AppContext = React.createContext();

// Pass in children which will be the values we are changing in the components etc
const AppProvider = ({ children }) => {
  // Pass in our reducer function from reducer.js and our initialState
  // Our State set to default
  const [state, dispatch] = useReducer(reducer, initialState);

  // Axios Setup
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  // Request Axios
  authFetch.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${state.token}`;
      console.log(config.headers["Authorization"]);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Axios
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) {
        console.log("AUTH ERROR");
      }
      return Promise.reject(error);
    }
  );

  // Adds the three variables into local storage
  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  // Removes the variables from local storage
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("location");
  };

  //   Dispatches the alert function
  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    // Clears the alert from the function below
    clearAlert();
  };

  //  Our Clear alert function that dispatches with a timer of 3 seconds
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      });
    }, 10000);
  };

  // Our function to register
  const registerUser = async (currentUser) => {
    // Dispatch this action straight away
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      // Post the response to the backend with currentUser credentials that they filled in
      const response = await axios.post("/api/v1/auth/register", currentUser);
      console.log(response);
      // We want back the three credentials
      const { user, token, location } = response.data;
      // After we got all three --> dispatch that it was successful with the payloads
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    // Clear the alert after three seconds (see above)
    clearAlert();
  };

  // Login in user functionality
  // ---- Its basically the same as registerUser but we change the API path and the actions
  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      // We are looking for the data that the response gave in registerUser
      const { data } = await axios.post("/api/v1/auth/login", currentUser);

      console.log(data);
      // We want back the three credentials
      const { user, token, location } = data;
      // After we got all three --> dispatch that it was successful with the payloads
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      });
      // Adds it to the storage to save it on page refresh
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    // Clear the alert after three seconds (see above)
    clearAlert();
  };

  // Function for toggling the sidebar in and out
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  // Fires this action when they hit logout
  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    // Our Loading
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      // Using the Global Axios Instance above --> This doesn't carry the Bearer token across
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);

      // The three values we want back from the axios fetch above
      const { user, location, token } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        // Add this into our payload
        payload: { user, location, token },
      });

      // Adds the data to the local storage for refresh saves
      addUserToLocalStorage({ user, location, token });
    } catch (error) {
      dispatch({
        type: UPDATE_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    // Clears the alert after 3 seconds
    clearAlert();
  };

  // Global Function that handles the new inputs and stores it in the payload
  // Looking for the name and the value
  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      // We want to access the state that has all the values
      // These values are the ones we want to display in our frontend cards
      const { position, company, jobLocation, jobType, status } = state;

      // Want to get our JOB URL
      // From our URL we want to grab the values
      await authFetch.post("/jobs", {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });

      // Once we have gotten our values we want to dispatch this action
      dispatch({ type: CREATE_JOB_SUCCESS });

      // Once we have a successful request / creation of job --> Clear the values in the form
      dispatch({ CLEAR_VALUES });
    } catch (error) {
      // If the error code is equal to Status Code 401
      if (error.response.status === 401) return;
      // IF its not 401 --> Dispatch the Error payload
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    // Clears the alert after 3 seconds
    clearAlert();
  };

  const getJobs = async () => {
    // Our endpoint of the route
    let url = `/jobs`;

    dispatch({ type: GET_JOBS_BEGIN });
    try {
      // Gets the API data
      const { data } = await authFetch.get(url);
      const { jobs, totalJobs, numOfPages } = data;
      // Dispatches our payloads that carry to our localStorage
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }
    clearAlert();
  };

  //  Returning our spread out (iteration over all) initialState to the whole application
  //  This lets us use these across the whole project on the frontend
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
      }}
    >
      {/* This is our application --> This is what we are rendering */}
      {children}
    </AppContext.Provider>
  );
};

// This is our hook so we can don't have to keep importing other parts of this whole component
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
