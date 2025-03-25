import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploatOnCloudinary = async (localFilePath) => {
    try{
        if (!localFilePath) return null
        // upload file on clooudinary
        const response =  await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log("Files is uploaded in cloudinary", response.url);
        return response;

    } catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporiy file as the upload option got failed
        return null;
    }
};

export {uploatOnCloudinary}
