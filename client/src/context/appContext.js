import React, { useReducer } from "react";
import { useContext } from "react";

import reducer from "./reducer";

import { CLEAR_ALERT, DISPLAY_ALERT } from "./actions";

// The initial states of each
const initialState = {
  isLoading: false,
  showAlert: false,
  //   What will show when the error pops up
  alertText: "",
  //   Which alert will show up
  alertType: "",
};

const AppContext = React.createContext();

// Pass in children which will be the values we are changing in the components etc
const AppProvider = ({ children }) => {
  // Pass in our reducer function from reducer.js and our initialState
  // Our State set to default
  const [state, dispatch] = useReducer(reducer, initialState);

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

  //  Returning our spreaded out (iteration over all) initialState to the whole application
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
      }}
    >
      {/* This is our application --> This is what we are rendering */}
      {children}
    </AppContext.Provider>
  );
};

// This is our hook so we can dont have to keep importing other parts of this whole component
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
