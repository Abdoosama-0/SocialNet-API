const storage= require('./cloudinary')
const multer = require("multer");
const upload = multer({ storage });
module.exports=upload
