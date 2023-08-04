const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const notFoundMiddleware = require("./middlewares/not-found");
const mainRoutes = require("./routes/main.route");
const adminRoutes = require("./routes/admin.route");

// let port = 3000;
let port = mongodb+srv://zazzys:zazzys73!@looking-for-job-app.tetsdac.mongodb.net/?retryWrites=true&w=majority;

if (process.env.PORT) {
  port = process.env.PORT;
}
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.static("lookingforjob"));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(mainRoutes);
app.use(protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(port);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
