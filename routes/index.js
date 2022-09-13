const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')            //bring in multiple items and do the same process

//@desc login/landing page  --> BASICALLY route for login page
//@route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

//@desc dashboard page  --> BASICALLY route for dashboard page
//@route GET /dashboard
router.get('/dashboard', ensureAuth, (req, res) => {
    console.log(req.user)
    res.render('dashboard')
})




module.exports = router  //Assignment of constant router