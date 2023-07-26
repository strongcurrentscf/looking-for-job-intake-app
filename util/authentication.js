function createAdminSession(req, user, action) {
  req.session.uid = user._id.toString();
  req.session.save(action);
}

function destroyAdminAuthSession(req) { 
  req.session.uid = null;
}

module.exports = {
    createAdminSession: createAdminSession,
    destroyAdminAuthSession: destroyAdminAuthSession,
};
