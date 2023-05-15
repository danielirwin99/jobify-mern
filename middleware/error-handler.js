import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err.message);
  const defaultError = {
    // If the statusCode is present, use that ONE --> If not, use the GENERIC one
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    // If there is a specific error then display that --> Otherwise show generic response
    msg: err.message || "Something went wrong, try again later",
  };

  // If our error response includes this
  if (err.name === "ValidationError") {
    // Displays the BAD_REQUEST error code
    defaultError.statusCode = StatusCodes.BAD_REQUEST;

    // Maps over the input values and pushes which one is not shown but required
    // i.e. if we forget to input the email --> "Please provide an email"
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  // 11000 Code = Unique email entered in again
  if (err.code && err.code === 11000) {
    // Setup the status error code
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    // This stops new information being registered with the same email
    // Targets the keyValue object --> The email
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });

};

export default errorHandlerMiddleware;
