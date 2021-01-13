const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../model/user');




//Passport's serializeUser method should define 
//what pieces of information we need to persist into the session 
//in order to be able to retrieve the 
//full user later by passing it to serializeUser's done callback. 
//here user is req.user came from the callback
passport.serializeUser((user, done) => done(null, {
    id: user.user._id,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken
}))
//☝️this object will end up in req.user and req.session.passport.user
// for subsequent requests to use.





// Now for deserializeUser, this function will receive the user data present in the 
// session(req.session.passport.user) and use it to get all of the user's data from our DB
//fires on every request
passport.deserializeUser((user, done) => {
    User.findById(user.id)
    .then(user=>{
        done(null,user);
    })
    .catch(e=>{console.log(e);})
})
//Whatever gets passed to done here will be available in req.user




passport.use(
    new GoogleStrategy({
        //options for using this 
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // console.log('accessToken', accessToken);
        // console.log('refreshToken', refreshToken);
        // console.log('profile', profile);
        User.findOne({ googleId: profile.id })
            .then(user => {
                if (!user) {
                    return new User({
                        username: profile.displayName,
                        googleId: profile.id
                    }).save()
                }
                return user
            })
            .then(user => {
                done(null, { accessToken, refreshToken, user });
                //And finally, Passport will execute its very own req.login() 
                //which will save that user into req.user for further use.
                //variableName as key name and value id variable's data
                // console.log(user);
                // req.user = {
                //     refreshToken : 'value for refreshToken',
                //     accessToken : 'value for refreshToken',
                //     user : {
                //         'same user data'
                //     }
                // }
            })
            .catch(e => { console.log(e); })
    })
)