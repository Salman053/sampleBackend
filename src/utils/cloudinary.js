import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Initialize Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload video to cloudinary
const uploadOnCloudinary = async localFilePath => {
  try {
    if (!localFilePath) return null;

    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    
    //file has been uploaded successfully
    console.log("File uploaded successfully on cloudinary", response.url);
    // returning data to the user
    return response;
  } catch (error) {
    //handling the file upload error

    fs.unlinkSync(localFilePath); // remove the temporary file from the temp directory

    return null;
  }
};

export { uploadOnCloudinary };
