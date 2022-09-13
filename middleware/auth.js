//Middleware code to not allow access to to the site if they have not logged in and to not be asked to login again after logging in already

module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        else {
            res.redirect('/')
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        }
        else {
            return next()
        }
    }
}