import React, { useReducer, useContext, useEffect } from "react";
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
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from "./actions";

// DON'T NEED ANYMORE --> USING COOKIES
// const token = localStorage.getItem("token");
// const user = localStorage.getItem("user");
// const userLocation = localStorage.getItem("location");

// The initial states of each / Default values
const initialState = {
  // Runs when the user refreshes the page
  userLoading: true,
  isLoading: false,
  showAlert: false,
  //   What will show when the error pops up
  alertText: "",
  //   Which alert will show up
  alertType: "",
  user: null, // --> Changed to null
  // token: token,
  userLocation: "",
  showSidebar: false,
  isEditing: false,
  // Our "Add Jobs" page states
  editJobId: "",
  position: "",
  company: "",
  jobLocation: "",
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
  stats: {},
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  // Dropdown menu
  searchType: "all",
  sort: "latest",
  // Dropdown menu
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
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
  // ----- DON'T NEED ANYMORE --> USING COOKIES -----------
  // authFetch.interceptors.request.use(
  //   (config) => {
  //     config.headers["Authorization"] = `Bearer ${state.token}`;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  // Response Axios
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) {
        console.log("AUTH ERROR");
        logoutUser()
      }
      return Promise.reject(error);
    }
  );

  // -------- DO NOT NEED HAVE COOKIES NOW ------------
  // Adds the three variables into local storage
  // const addUserToLocalStorage = ({ user, token, location }) => {
  //   localStorage.setItem("user", JSON.stringify(user));
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("location", location);
  // };

  // -------- DO NOT NEED HAVE COOKIES NOW ------------
  // Removes the variables from local storage
  // const removeUserFromLocalStorage = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("location");
  // };

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
      const { user, location } = response.data;
      // After we got all three --> dispatch that it was successful with the payloads
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user,

          location,
        },
      });
      // addUserToLocalStorage({ user, token, location }); // COOKIES NOW
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

      // console.log(data);
      // We want back the three credentials
      const { user, location } = data;
      // After we got all three --> dispatch that it was successful with the payloads
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
          user,

          location,
        },
      });
      // Adds it to the storage to save it on page refresh
      // addUserToLocalStorage({ user, token, location }); // COOKIES NOW
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
  const logoutUser = async() => {
    await authFetch.get("/auth/logout")
    dispatch({ type: LOGOUT_USER });
    // removeUserFromLocalStorage(); DON'T NEED ANYMORE
  };

  const updateUser = async (currentUser) => {
    // Our Loading
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      // Using the Global Axios Instance above --> This doesn't carry the Bearer token across
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);

      // The three values we want back from the axios fetch above
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        // Add this into our payload
        payload: { user, location },
      });

      // Adds the data to the local storage for refresh saves
      // addUserToLocalStorage({ user, location, token }); DON'T NEED ANYMORE
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
      dispatch({ type: CLEAR_VALUES });
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
    // Pulled to add into our url for search params
    const { search, searchStatus, searchType, sort, page } = state;

    // Our endpoint of the route
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

    // If the search is not empty --> Add into the search params
    if (search) {
      url = url + `&search=${search}`;
    }

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
      // console.log(error.response);
      logoutUser();
    }
    clearAlert();
  };

  // Allows us to edit the job from all jobs page
  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      // Grab these values from the state
      const { position, jobLocation, company, jobType, status } = state;

      await authFetch.patch(`/jobs/${state.editJobId}`, {
        // Pass in the data just in case the values are different to the ones on the server
        company,
        status,
        jobLocation,
        jobType,
        position,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      // If everything is correct we want to set it back to default
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const deleteJob = async (jobId) => {
    // Fire our state values and isLoading animation
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      // Fetch the jobs and delete the one with that id
      await authFetch.delete(`/jobs/${jobId}`);
      // After we delete a job --> We want to make a request to get the LATEST JOBS
      getJobs();
    } catch (error) {
      // Handles the errors when we try to delete job
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      // Fetching the stats from axios to backend
      const { data } = await authFetch.get("/jobs/stats");

      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          // Pass through these two into our payload
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      // console.log(error.response);
      logoutUser();
    }
  };

  // Clears all changed data in the Search Form
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  // Changes the page
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });

    try {
      // Fetching the currentUser from the backend
      const { data } = await authFetch.get("/auth/getCurrentUser");

      // Destructuring the user and location from the data
      const { user, location } = data;
      dispatch({ type: GET_CURRENT_USER_SUCCESS, payload: { user, location } });
    } catch (error) {
      if (error.response.status === 401) return;
      // If we somehow pass the error return --> Logout the user
      logoutUser();
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  //  Returning our spread out (iteration over all) initialState to the whole application
  //  This lets us use these across the whole project on the frontend
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        getCurrentUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
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
