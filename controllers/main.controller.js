const User = require("../models/user.model");

const validationUtil = require("../util/validation");
const sessionFlash = require("../util/session-flash");

const adminReg = require("../admin-register/adminreg");

function getIntakeForm(req, res) {
  // ...
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
  // ...
  const enteredData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    email: req.body.email,
    resume: req.file.filename,
    resumeFilePath: this.resumeFilePath,
    position: req.body.position,
  };

  function getCurrentDateTime() {
    const currentDate = new Date();

    // Format the date
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    // Format the time
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours %= 12;
    hours = hours || 12;

    // Create the formatted date and time string
    const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes
      .toString()
      .padStart(2, "0")}${ampm}`;

    return formattedDateTime;
  }

  const dateTime = getCurrentDateTime(); // Output: "7/13/2023 11:03PM" (based on the current date and time)

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
      req.body.position
    )
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Please make sure all fields are filled and a desired position option is selected.",
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
