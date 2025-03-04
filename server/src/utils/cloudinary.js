import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { logger } from './logger.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const upload = multer({ dest: 'uploads/' });

export const uploadToCloudinary = async (file) => {
  try {
    if (!file || !file.path) {
      throw new Error('File not provided or path is missing');
    }

    console.log('Uploading file:', file.path); 
    const result = await cloudinary.uploader.upload(file.path);

    console.log('Upload successful:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

