import { asynchandeler } from "../utils/asynchandeller.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { UploadFileOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.GenerateAccessToken()
        const refreshToken = user.GenerateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(401, "Unable to generate Tokens")
    }
}

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
    console.log(userName, email, fullName, password);

    let registerUser
    try {
        registerUser = await User.create({
            userName: userName.toLowerCase(),
            avatar: avatar.url,
            coverImage: cover?.url || "",
            email,
            fullName,
            password

        });
    } catch (error) {
        if (error.code === 11000) {
            console.log(error);

            return res.status(409).json(new ApiResponse(409, null, "Duplicate entry detected"));

        }
        // handle other errors
        throw new ApiError(500, "An error occurred while creating the user");
    }



    const createduser = await User.findById(registerUser._id).select(
        "-password "
    )
    if (!createduser) {
        throw new ApiError(300, "Something went wrong!! User not created")
    }

    // api response
    return res.status(200).json(
        new ApiResponse(200, createduser, "user Registered Successfully")
    )

})
const login = asynchandeler(async (req, res) => {
    //get data from frontend 
    // validate the data
    // check for user existance
    // check for password 
    // generate access and refresh tolken
    // send token to cookies


    const { userName, email, password } = req.body;
    console.log(userName, email, password);

    if (userName === "" || email === "") {
        throw new ApiError("Please enter username or email");
    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (!user) {
        throw new ApiError(401, "No such user exists")
    }

    const passwordCheck = await user.IsPasswordCorrect(password)

    if (!passwordCheck) {
        throw new ApiError(401, "Incorrect Password")
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    console.log(accessToken, refreshToken)
    const logginedUser = await User.findOne(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: logginedUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})
const logout = asynchandeler(async (req, res) => {
    console.log(req.user);
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: null
                }
            },
            {
                new: true
            }
        )
    } catch (error) {
        console.log(error);

    }
   

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export {
    registeruser,
    login,
    logout
}       