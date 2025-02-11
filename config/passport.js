const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User')

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password', session: false },async (username, password, done) => {
    try {
        let user = await User.findOne({ username: username })
        if (!user) {
            return done(null, false, { message: "incorrect username" })
        }
        const isMatch = await user.verifyPassword(password)
        if (!isMatch) {
            return done(null, false, { message: "wrong password" })
        }
        return done(null, user)
    } catch (err) {
        return done(err,false)
    }
}))

passport.use(new GoogleStrategy(
    {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
},async (accessToken, refreshToken, profile, done) => {
    // console.log("111111111111111111111111111111111111111\n");console.log(profile);console.log("111111111111111111111111111111111111111\n")
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.emails[0].value.split("@")[0],
               
            });
            await user.save();
        }





        return done(null, { user });
    } catch (err) {
        return done(err, false);
    }
}));

module.exports=passport