import React, { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/RegisterPage";
import { Logo, FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";

// Initial State of the forms
const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

const Register = () => {
  const [values, setValues] = useState(initialState);

  // Global State and useNavigate
  // Importing it from appContext.js and make it equal to a state --> Should be the intialState as Default
  // We are controlling these from our GLOBAL context rather than LOCAL context
  const { isLoading, showAlert, displayAlert } = useAppContext();

  // Function handles toggling between registering and logging in
  const toggleMember = () => {
    // Iterate over the values and spread them out
    // Looking for the isMember value --> If its false --> Fire this function
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    // Looping over all the values --> Then making event.target.name equal to what we enter inside the form
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Looking for these avalues
    const { name, email, password, isMember } = values;
    // If these values are not present display the alert and return it (stop the fucntionality)
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    console.log(values);
  };

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {/* Display the Alert if boolean = true */}
        {showAlert && <Alert />}
        {/* Name Input */}
        {/* If isMember is false --> Show the name input */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}

        {/* Email Input */}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* Password Input */}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />

        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>
          {/* If user is a member --> Show "Not a member yet" otherwise show the other */}
          {values.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {/* If the user is a member --> Show "Register", otherwise show "Login" */}
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
