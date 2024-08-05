import { ApiError } from "../utils/ApiError.js";
import { asynchandeler } from "../utils/asynchandeller.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";

export const verifyJWT = async function (req, res, next) {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")
        if (!token) {
            throw new ApiError(409, "unable to access Cookie")
        }
        let decodedToken
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        } catch (error) {
            console.log(error);
        }
        const user = await User.findById(decodedToken?._id).select("-password ");
        if (!user) {
            throw new ApiError(409, "Unable to access user through Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(409, "token was unable to verify")
    }
}
