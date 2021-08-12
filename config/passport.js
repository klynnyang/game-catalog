const passport = require("passport");
const bcrypt = require("bcrypt")
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
    },
    async function(accessToken, refreshToken, profile, cb){
        try{
            console.log(profile)
            let user = await User.findOne({"googleId": profile.id})
            if(user){
                return cb(null, user);
            } else {
                let newUser = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id
                })
                await newUser.save()
                return cb(null, newUser);
            }
        }
        catch(err){
            cb(err)
        }
    }
));

async function validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username}, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: "The username you entered is not registered" });
        }
        if (!validatePassword(password, user.password)) {
          return done(null, false, { message: "The password you entered is incorrect" });
        }
        return done(null, user);
      });
    }
  ));


passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    })
})

