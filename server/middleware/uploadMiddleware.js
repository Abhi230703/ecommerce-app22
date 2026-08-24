const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"products",
        allowed_formats: ["jpg","png","jpeg","webp","avif"]
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => cb(null, /^image\/(jpeg|png|webp|avif)$/.test(file.mimetype)),
});

module.exports = upload;
