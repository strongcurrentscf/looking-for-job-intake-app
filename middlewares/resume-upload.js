const multer = require("multer");
const uuid = require("uuid").v4;

const upload = multer({
    storage: multer.diskStorage({
        destination: "user-data/pdf",
        filename: function (req, file, cb) { 
            cb(null, uuid() + "-" + file.originalname )
        }
    })
});

const configuredMulterMiddleware = upload.single("resume");

module.exports = configuredMulterMiddleware;