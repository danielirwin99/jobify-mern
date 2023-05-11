import React from "react";

const FormRow = ({ name, labelText, value, handleChange, type }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {/* If the labelText value is passed in --> Use that, otherwise use the name */}
        {labelText || name}
      </label>

      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
};

export default FormRow;
