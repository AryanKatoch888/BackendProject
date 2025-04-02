import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploatOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already checked: username, email
  // check for images, check for avator
  // upload them to cloudniary, avator
  // create user object - create entry in db
  // remove passowrd - refresh token field from response
  // check from user creation
  // return res
  // res.status(200).json({
  //   message: "User is successfully register",
  // });

  const { fullName, email, username, password } = req.body;
  console.log({ fullName, email });

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { password }],
  } )   

  if(existedUser){
    throw new ApiError(409, "Credentials are already ")
  }
  
  const avatorLocalPath = req.files?.avatar[0]?.path
  // console.log(files)
  const coverImageLocalPath = req.files?.coveredImage[0]?.path;

  if(!avatorLocalPath) {
    throw new ApiError(400, "Avator is required")
  }
  
  const avatar = await uploatOnCloudinary(avatorLocalPath);
  const coverImage = await uploatOnCloudinary(coverImageLocalPath);

    const hashedPassword = await bcrypt.hash(password, 10);

  if(!avatar) throw new ApiError(400, "avator file is required")

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registration of user")
  }
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
  )
});

export { registerUser };
