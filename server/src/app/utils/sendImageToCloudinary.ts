
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';
import fs from 'fs';

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true,
});

/**
 * Uploads a file to Cloudinary and deletes the local file after upload.
 * @param imageName - The public_id to use in Cloudinary
 * @param path - The local file path
 */
export const sendToCloudinary = (
  imageName: string,
  path: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName.trim() },
      function (error, result) {
        fs.unlink(path, () => {}); // Always delete local file
        if (error) {
          reject(error);
        } else {
          resolve(result as UploadApiResponse);
        }
      },
    );
  });
};

// Multer disk storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage });
