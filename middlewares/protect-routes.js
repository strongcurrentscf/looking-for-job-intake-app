function protectRoutes(req, res, next) {
  if (req.path.startsWith("/lookingforjob") && !res.locals.isAuth) {
    return res.redirect("/403");
  }

  next();
}

module.exports = protectRoutes;
