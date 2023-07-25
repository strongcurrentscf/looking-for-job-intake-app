const express = require("express");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get("/login", adminController.getAdminLoginForm);

router.post("/login", adminController.loginAdmin);

router.post("/logout", adminController.logoutAdmin);

router.get("/lookingforjob", adminController.getAdminPortal);

router.get("/lookingforjob/:id", adminController.getUserFile);

router.delete("/lookingforjob/:id/delete", adminController.deleteUser);

module.exports = router;