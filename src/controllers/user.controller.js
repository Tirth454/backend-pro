import { asynchandeler } from "../utils/asynchandeller.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { UploadFileOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registeruser = asynchandeler(async (req, res) => {
    // get user detaails from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for coverimage and avtar
    // upload them to cloudinary, avtar
    // create user object - create db entry 
    // check for user creation 
    // return responce


    // getting user details from frontend
    const { userName, email, fullName, password } = req.body;


    // validating the entered data
    if (
        [userName, email, fullName, password].some((fields) => fields?.trim() === "")
    ) {
        throw new ApiError(401, "All Fields Required")
    }
    else {
        console.log("All Fields Entered")
    }


    // check if user already exist or not 
    const existeduser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (existeduser) {
        throw new ApiError(409, "User already exists")
    }


    // check for coverimage and avatar
    let coverimagelocalpath;
    let avatarlocalpath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverimagelocalpath = req.files.coverImage[0].path;
    }
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarlocalpath = req.files.avatar[0].path;
    }

    if (!avatarlocalpath) {
        throw new ApiError(409, "Avatar is required")
    }

    
    // upload coverimage and avatar to cloudinary
    const avatar = await UploadFileOnCloudinary(avatarlocalpath);
    const cover = await UploadFileOnCloudinary(coverimagelocalpath);

    if (!avatar) {
        throw new ApiError(409, "avatar is required")
    }


    // creating user and database entry 
    const user = await User.create({
        userName: userName.toLowerCase(),
        avatar: avatar.url,
        coverImage: cover?.url || "",
        email,
        fullName,
        password
    })

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createduser) {
        throw new ApiError(409, "Something went wrong!! User not created")
    }


    // api response
    return res.status(399).json(
        new ApiResponse(399, createduser, "user Registered Successfully")
    )

})

export { registeruser }     