import { v2 as cloudinary } from "cloudinary"
// cloudinary.uploader.upload
import fs from "fs"
import { extractPublicId } from "cloudinary-build-url"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloud = async (localFilePath, resource_type) => {
    try {
        if (!localFilePath) return null;

        const isVideo = resource_type === 'video';

        const options = {
            resource_type,
            quality: "auto",
            format: isVideo ? "mp4" : "jpg",
            chunk_size: 6000000,
            eager: isVideo
                ? [
                    {
                        width: 1280,
                        height: 720,
                        crop: "limit",
                        format: "mp4",
                        quality: "auto",
                    },
                ]
                : [
                    {
                        width: 300,
                        height: 300,
                        crop: "thumb",
                        gravity: "auto",
                        format: "jpg",
                        quality: "auto",
                    },
                ],
        };

        const response = await cloudinary.uploader.upload(localFilePath, options);

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        if (localFilePath) fs.unlinkSync(localFilePath);
        return error;
    }

}
// Its Take time to understand 
const deleteFromCloud = async (filePath, resource_type) => {
    try {
        if (!filePath) return null;
        const publicId = extractPublicId(filePath)
        const response = await cloudinary.uploader.destroy(publicId,
            {
                resource_type: resource_type
            }
        )
        return response
    } catch (error) {
        return null;
    }
}

export {
    uploadOnCloud,
    deleteFromCloud,


}