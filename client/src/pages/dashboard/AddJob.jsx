import React from "react";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { FormRow, Alert, FormRowSelect } from "../../components";

const AddJob = () => {
  const {
    isLoading,
    // Did we click on edit job (boolean)
    isEditing,
    // Boolean
    showAlert,
    // Displays the Alert if showAlert is true
    displayAlert,
    // Values Stored
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
  } = useAppContext();

  // Our Button Function
  const handleSubmit = (e) => {
    e.preventDefault();

    // If all three values provided or not
    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }

    // By default isEditing is false
    if (isEditing) {
      editJob();
      return;
    }
    createJob();
  };

  // Our Input Forms Function
  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // Handles the change in the input to store it in the reducer
    handleChange({ name, value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "Edit Job" : "Add Job"}</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          {/* Position */}
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
          />
          {/* Company */}
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleJobInput}
          />
          {/* Location */}
          <FormRow
            type="text"
            labelText="Job Location"
            name="jobLocation"
            value={jobLocation}
            handleChange={handleJobInput}
          />
          {/* Job Status */}
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />
          {/* Job Type */}
          <FormRowSelect
            labelText="type"
            name="jobType"
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          />
          <div className="btn-container">
            {/* Submit Button */}
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
              // Prevents user from submitting the form again in the middle of a request
              disabled={isLoading}
            >
              Submit
            </button>
            {/* Clear Values Button */}
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
