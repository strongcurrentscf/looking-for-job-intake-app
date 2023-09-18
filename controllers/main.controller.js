const User = require("../models/user.model");

const validationUtil = require("../util/validation");
const sessionFlash = require("../util/session-flash");

const adminReg = require("../admin-register/adminreg");

function getIntakeForm(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      position: "",
    };
  }

  res.render("intake/intake-form.ejs", { inputData: sessionData });
}

async function intakeUser(req, res) {
  const enteredData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    email: req.body.email,
    // resume: req.file.filename,
    // resumeFilePath: this.resumeFilePath,
    position: req.body.position,
  };

  if (req.file) {
    enteredData.resume = req.file.filename; // Assign the uploaded file to enteredData
    enteredData.resumeFilePath = this.resumeFilePath; // Assign the file path
  } else {
    enteredData.resume = "";
    enteredData.resumeFilePath = "";
  }

  // console.log(enteredData);

  function getCurrentDateTime() {
    const currentDate = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    return currentDate;
  }

  const dateTime = getCurrentDateTime();

  const user = new User({
    ...enteredData,
    dateTime,
  });

  if (
    !validationUtil.userDetailsAreValid(
      req.body.firstname,
      req.body.lastname,
      req.body.phone,
      req.body.email,
      enteredData.resume,
      req.body.position
    )
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Please make sure all fields are filled, a PDF file of your CV/Resume is uploaded, and a Desired Position option is selected.",
        ...enteredData,
      },
      function () {
        res.redirect("/");
      }
    );
    return;
  }

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage:
            "Seems like you have already submitted contact information with this E-mail address! No further action is needed from you at this time. Thanks!",
          ...enteredData,
        },
        function () {
          res.redirect("/");
        }
      );
      return;
    }

    await user.intakeUser();

    res.redirect("/thankyou");
  } catch (error) {
    next(error);
    console.log(error);
    return;
  }
}

function getThankYouConfirmation(req, res) {
  // ...
  res.render("confirm/thank-you.ejs");
}

module.exports = {
  getIntakeForm: getIntakeForm,
  intakeUser: intakeUser,
  getThankYouConfirmation: getThankYouConfirmation,
};
