import { BadRequestError } from "../errors/index.js";

// If the guest user login tries to change values that we have restricted on the routes
const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Guest User. Read Only!");
  }
  next()
};

export default testUser