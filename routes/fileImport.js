const router = require('express').Router();
const isAuth = require('../middleware/is-auth');

router.get('/profile', isAuth, (req,res,next)=>{

    
    res.render('profile', {
        name: req.user.username
    })
})


module.exports = router;