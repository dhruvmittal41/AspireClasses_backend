const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require("dotenv");
dotenv.config();



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
        const filename = file.originalname.split(".")[0];
        const timestamp = Date.now();
        return {
            folder: `Aspire`,
            public_id: `${filename}-${timestamp}`,
            resource_type: "image",
        };
    },
});

// 2. This creates the middleware INSTANCE by calling the library
const upload = multer({ storage });

// 3. You MUST export the INSTANCE (upload), NOT the library (multer)
module.exports = upload;