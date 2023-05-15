import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

// Pulls the CustomAPIError's functionality across
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
