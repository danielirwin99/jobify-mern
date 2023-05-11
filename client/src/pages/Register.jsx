import React, { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/RegisterPage";
import { Logo, FormRow, Alert } from "../components";

// Initial State of the forms
const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
  showAlert: false,
};

const Register = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [values, setValues] = useState(initialState);

  // Global State and useNavigate

  // Function handles toggling between registering and logging in
  const toggleMember = () => {
    // Iterate over the values and spread them out
    // Looking for the isMember value --> If its false --> Fire this function
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    console.log(e.target);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
  };

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {/* Display the Alert if boolean = true */}
        {values.showAlert && <Alert />}
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
