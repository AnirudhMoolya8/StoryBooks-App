const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')            //bring in multiple items and do the same process

const Story = require('../models/Story')

//@desc login/landing page  --> BASICALLY route for login page
//@route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

//@desc dashboard page  --> BASICALLY route for dashboard page
//@route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()                //Take everything in story and find user data which will then render into handlebar page.
        console.log(req.user)                                                         //lean() method converts data to JSON so handlebars can understand
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }



})




module.exports = router  //Assignment of constant router