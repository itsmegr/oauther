const router = require('express').Router();
const passport = require('passport');


// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logOut();
    res.redirect('/');
});

// auth with google+
router.get('/google', passport.authenticate('google',{
    accessType: 'offline', prompt: 'consent',
    scope:['profile','https://www.googleapis.com/auth/drive']
}));

router.get('/google/redirect', passport.authenticate('google') ,(req,res,next)=>{
    console.log(req.user);
    res.redirect('/profile');
})
module.exports = router;
