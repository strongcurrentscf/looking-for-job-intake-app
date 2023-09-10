const multer = require("multer");
const uuid = require("uuid").v4;

const upload = multer({
  storage: multer.diskStorage({
    destination: "lookingforjob/user-data/pdf",
    filename: function (req, file, cb) {
      cb(null, uuid() + "-" + file.originalname);
    },
  }),
});

const configuredMulterMiddleware = upload.single("resume");

// Uploads image file to Cloudinary

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});
console.log(cloudinary.config());

const cloudinaryUploadImageMiddleware = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
    
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
      return result;
    // return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  configuredMulterMiddleware: configuredMulterMiddleware,
  cloudinaryUploadImageMiddleware: cloudinaryUploadImageMiddleware,
};
