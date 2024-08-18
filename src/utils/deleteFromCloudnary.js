import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to delete a file from Cloudinary
const deleteFromCloudinary = async publicId => {
  try {
    if (!publicId) return null;

    // delete the file from Cloudinary using its public ID
    const response = await cloudinary.uploader.destroy(publicId);

    if (response.result === "ok") {
      console.log("File deleted successfully from Cloudinary");
      return response;
    } else {
      console.error("Failed to delete file from Cloudinary", response);
      return null;
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary", error);
    return null;
  }
};

export default deleteFromCloudinary;
