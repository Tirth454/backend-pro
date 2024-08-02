import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs';
import { ApiError } from './ApiError.js';

cloudinary.config({
    cloud_name: 'duo7p1mkp',
    api_key: 594949741422287,
    api_secret: 'qHaUfwoYOr-X8MojsTI6MmgO_Is'
});


const UploadFileOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) {
            throw new ApiError(400, "local file path not found");

        }
        const response = await cloudinary.uploader
            .upload(localfilepath,
                {
                    resource_type: "auto"

                })
                fs.unlinkSync(localfilepath)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)
        console.log(error);
        return null
    }
}

export { UploadFileOnCloudinary }
