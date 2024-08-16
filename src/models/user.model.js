import  { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      minlength: 6,
      maxlength: 20,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudnary url
      required: true,
    },
    coverImage: {
      type: String, // cloudnary url
      // required:true,
      // default:''
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password must be provided"],
      // minlength: 8,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const User = model("User", userSchema);
