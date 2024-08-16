import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
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
  console.log(fullName, email, username)
  if ([fullName, email, username, password].some(filed => filed?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  if (email.includes("@")) {
    throw new ApiError(400, "Invalid email format");
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "Username or email already exists");
  }
  const avatarLocalPath = res.files?.avatar[0]?.path;
  const coverImageLocalPath = res.files?.coverImage[0]?.path;

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
    password: await User.hashPassword(password),
    avatar: avatarRes.secure_url,
    coverImage: coverImageRes?.secure_url || "",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong creating the user");
  }
  return res.status(200).json(new ApiResponse(200, createdUser, "User created successfully"));
});

export default registerUser;
