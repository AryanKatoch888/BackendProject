import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploatOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

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
  console.log({ fullName, email, password });

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "Credentials are already ");
  }
  console.log(req.files);
  const avatorLocalPath = req.files?.avatar[0]?.path;

  const coverImageLocalPath = req.files?.coveredImage[0]?.path;

  if (!avatorLocalPath) {
    throw new ApiError(400, "Avator is required");
  }

  const avatar = await uploatOnCloudinary(avatorLocalPath);
  const coverImage = await uploatOnCloudinary(coverImageLocalPath);

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!avatar) throw new ApiError(400, "avator file is required");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coveredImage: coverImage?.url || "",
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registration of user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginuser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // passowrd check
  // access and refresh token
  // send secure cookies
  // reponse "you are succesfuly login"

  const { username, email, password } = req.body;
  console.log(username, email, password);

  if (!username || !email) {
    throw new ApiError(404, "username or email is required");
  }

  const user = User.findOne({
    // find first value in User modal
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "username does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user Creditals");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await user
    .findById(user._id)
    .select(-password, refreshToken);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
    "user logged in successfully")
    );
});

const logoutUser = asyncHandler(async (req, res)=> {
  User
})

export { registerUser, loginuser };
