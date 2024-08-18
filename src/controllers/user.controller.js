import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import validator from "validator";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async userId => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    // handling the error in generating access and refresh tokens
    throw new ApiError(500, "Error in generating access and refresh tokens");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  // first get the data from the body and validate the data
  // then check the existence of the user in the DB
  // check for images and check for avatar
  // upload the images to the cloudinary , avatar
  // create user object - create entry in db
  // remove the password and refresh token filed from the response
  // check for user creation
  // return the response to the frontend

  const { fullName, email, username, password } = req.body;
  console.log(fullName, email, username);
  if ([fullName, email, username, password].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "Username or email already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload an avatar");
  }
  const avatarRes = await uploadOnCloudinary(avatarLocalPath);
  let coverImageRes;
  if (coverImageLocalPath) {
    coverImageRes = await uploadOnCloudinary(coverImageLocalPath);
  }

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatarRes.secure_url,
    coverImage: coverImageRes?.secure_url || "",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong creating the user");
  }
  return res.status(200).json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  // console.log(email)

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .json(new ApiResponse(200, null, "User Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }
  try {
    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedRefreshToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expired");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("access_token", accessToken, options)
      .cookie("refresh_token", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "User access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});



export { registerUser, loginUser, logoutUser ,refreshAccessToken};
