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
    const { username, email, fullName, password } = req.body;


    // validating the entered data
    if (
        [username, email, fullName, password].some((fields) => {
            fields?.trim() === ""
        })
    ) {
        throw new ApiError(401, "All Fields Required")
    }
    else {
        console.log("All Fields Entered")
    }


    // check if user already exist or not 
    const existeduser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existeduser) {
        throw new ApiError(409, "User already exists")
    }

    console.log("1");
    // check for coverimage and avatar
    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coverimagelocalpath = req.files?.coverImage[0]?.path;

    if (!avatarlocalpath) {
        throw new ApiError(409, "Avatar is required")
    }
    console.log(avatarlocalpath);
    // upload coverimage and avatar to cloudinary
    const avatar = await UploadFileOnCloudinary(avatarlocalpath);
    const cover = await UploadFileOnCloudinary(coverimagelocalpath);
    console.log(avatar);
    console.log(cover);
    console.log("2");
    if (!avatar) {
        throw new ApiError(409, "avatar is required")
    }

    console.log("3");
    // creating user and database entry 
    const user = await User.create({
        username: username.tolowercase(),
        avatar: avatar.url,
        coverimage: cover?.url || "",
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

    console.log("4");
    // api response
    return res.status(500).json(
        new ApiResponse(501, createduser, "user Registered Successfully")
    )
    console.log("5");
})

export { registeruser }     