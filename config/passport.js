const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('./models/User')





//Using passport to authenticate against google
module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,          //defining how the database will store google user data
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }

            try {
                let user = await User.findOne({ googleId: profile.id })

                if (user) {         //Checking if user exists
                    done(null, user)
                }
                else {
                    user = await User.create(newUser)    //Adding new user if they dont exist in database
                    done(null, user)
                }
            } catch (err) {
                console.error(err)
            }
        }))


    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {                                              //Chunks of code copied from google authenticate website
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })
}
