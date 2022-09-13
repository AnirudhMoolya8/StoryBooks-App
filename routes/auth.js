const express = require('express')
const passport = require('passport')
const router = express.Router()

//@desc Authenticate with Google  --> BASICALLY route for google authorization
//@route GET /auth/gogle
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@desc Google authenticate callback  --> BASICALLY route for google callback
//@route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {                   //if login fails, send them back. If its successfull, send them to dashboard
    res.redirect('/dashboard')
})


//@desc  Logout the user
//@route /auth/logout
//MAJOR UPDATE Passport requires logout to be async
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.redirect('/')
    })
})



module.exports = router  //Assignment of constant router