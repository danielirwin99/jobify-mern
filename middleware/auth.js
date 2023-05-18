// Middleware that Authenticates the User --> Protects the server from attacks

import { UnAuthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

UnAuthenticatedError;
const auth = async (req, res, next) => {
  // Targets the Authorization Header so we can use it for the Bearer Token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
  // If it passes the above condition use this :
  const token = authHeader.split(" ")[1]; // This removes the "Bearer" from the token and grabs the token [1]

  try {
    // Verifies to see if the bearer token matches
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);

    req.user = { userId: payload.userId };
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }

  next();
};

export default auth;
