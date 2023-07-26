const express = require("express");

const mainController = require("../controllers/main.controller");
const imageUploadMiddleware = require("../middlewares/resume-upload");

const router = express.Router();

router.get("/", mainController.getIntakeForm);

router.post("/intake",imageUploadMiddleware ,mainController.intakeUser);

router.get("/thankyou", mainController.getThankYouConfirmation);

router.get("/403", function (req, res) {
  res.status(403).render("shared/403");
});

module.exports = router;
