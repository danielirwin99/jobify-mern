import React, { useReducer } from "react";
import { useContext } from "react";
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
} from "./actions";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("location");

// The initial states of each / Default values
const initialState = {
  isLoading: false,
  showAlert: false,
  //   What will show when the error pops up
  alertText: "",
  //   Which alert will show up
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || "",
  jobLocation: userLocation || "",
  showSidebar: false,
};

const AppContext = React.createContext();

// Pass in children which will be the values we are changing in the components etc
const AppProvider = ({ children }) => {
  // Pass in our reducer function from reducer.js and our initialState
  // Our State set to default
  const [state, dispatch] = useReducer(reducer, initialState);

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
    }, 3000);
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
    removeUserFromLocalStorage()
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
