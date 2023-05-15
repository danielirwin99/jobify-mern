import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const defaultError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: "Something went wrong, try again later",
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
  if(err.code && err.code === 11000) {
    // Setup the status error code
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys} field has to be unique`
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
