import jwt from "jsonwebtoken";
import { ErrorHandler } from "./error.js";

export const VerifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(ErrorHandler(401, "Unauthorized")); // No token found
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(ErrorHandler(403, "Token is not valid"));

    req.user = decoded; // { id: 'userId' }
    next();
  });
};
