import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs';
import { ApiError } from './ApiError.js';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRETS_CLOUDINARY
});


const UploadFileOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) {
            throw new ApiError(400, "local file path not found");

        }
        await cloudinary.v2.uploader
            .upload(localfilepath,
                {
                    resource_type: "auto"
                    
                })
            .then(result => console.log(result));
    } catch (error) {
        fs.unlinkSync(localfilepath)

    }
}

export { UploadFileOnCloudinary }
