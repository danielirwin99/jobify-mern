import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

// Pulls the CustomAPIError's functionality across
// This handles the errors that
class UnAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnAuthenticatedError;
