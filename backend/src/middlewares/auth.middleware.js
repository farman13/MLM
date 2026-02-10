import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized - Token missing");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        throw new ApiError(401, "Invalid token");
    }
});

export const verifyAdmin = AsyncHandler(async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Admin access required");
    }
    next();
});
