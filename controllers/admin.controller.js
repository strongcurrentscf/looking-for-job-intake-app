const Admin = require("../models/admin.model");
const User = require("../models/user.model");

const sessionFlash = require("../util/session-flash");
const authUtil = require("../util/authentication");

// const adminReg = require("../admin-register/adminreg");

function getAdminLoginForm(req, res) {
  let sessionData = sessionFlash.getSessionData(req, {
    errorMessage: "",
    adminuser: "",
    password: "",
  });

  res.render("admin/login.ejs", { inputData: sessionData });
}

async function loginAdmin(req, res, next) {
  let sessionData = {
    adminuser: req.body.adminuser,
    password: req.body.password,
  };
  sessionFlash.flashDataToSession(req, sessionData, function () {
    return;
  });

  const admin = new Admin(req.body.adminuser, req.body.password);
  let existingAdmin;
  try {
    existingAdmin = await admin.getAdminWithSameName();
  } catch (error) {
    next(error);
    return;
  }

  if (!existingAdmin) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Administrator not recognized.",
        ...sessionData,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  const passwordIsCorrect = await admin.hasMatchingPassword(
    existingAdmin.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Check password.",
        ...sessionData,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  authUtil.createAdminSession(req, existingAdmin, function () {
    res.redirect("/lookingforjob");
  });
}

function logoutAdmin(req, res) {
  authUtil.destroyAdminAuthSession(req);
  res.redirect("/login");
}

async function getAdminPortal(req, res, next) {
  const sortingParameter = req.params.position;
  // console.log("Will be sorting for:", sortingParameter);

  if (sortingParameter === undefined || sortingParameter === null) {
    try {
      const candidates = await Admin.getAllCandidates();
      const candidatePositions = ["Pizza Maker", "Porter", "Prep", "Counter"];

      res.render("admin/portal", {
        candidates: candidates,
        candidatePositions: candidatePositions,
      });
    } catch (error) {
      console.error("Error getting all candidates:", error);
      return next(error);
    }
  } else {
    try {
      const candidates = await Admin.getSortedCandidates(sortingParameter);
      const candidatePositions = ["Pizza Maker", "Porter", "Prep", "Counter"];

      // console.log("Sorted candidates:", candidates);

      res.render("admin/portal", {
        candidates: candidates,
        candidatePositions: candidatePositions,
      });
    } catch (error) {
      console.error("Error getting sorted candidates:", error);
      return next(error);
    }
  }
}

async function getUserFile(req, res, next) {
  let user;
  try {
    user = await User.findUserById(req.params.id);

    // console.log(user);

    res.render("admin/user-file", { candidate: user });
  } catch (error) {
    next(error);
    return;
  }
}

async function deleteUser(req, res, next) {
  let user;
  try {
    user = await User.findUserById(req.params.id);
    await user.removeUser();
  } catch (error) {
    next(error);
    return;
  }

  res.json({ message: "Deleted candidate!" });
}

// Register New Admin by hard-coding user/pw into Reg function
// adminReg.registerAdmin("Christian", "Greenone?27!");
// adminReg.registerAdmin("Miranda", "zazzys73!");

module.exports = {
  getAdminLoginForm: getAdminLoginForm,
  loginAdmin: loginAdmin,
  logoutAdmin: logoutAdmin,
  getAdminPortal: getAdminPortal,
  getUserFile: getUserFile,
  deleteUser: deleteUser,
};
