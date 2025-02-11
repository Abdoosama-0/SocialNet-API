// npm install cloudinary@1.25.0 multer-storage-cloudinary@4.0.0
require("dotenv").config();


const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");



// إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// إعداد التخزين في Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // اسم المجلد في Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // الصيغ المدعومة
  },
});

module.exports=storage