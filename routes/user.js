const express = require('express')
const router = express.Router();
const User = require('../model/user');
const CatchAsync = require('../utils/CatchAsync');
const passport = require('passport')

router.get('/register', (req,res)=>{
    res.render('users/register')
})
router.post('/register',CatchAsync( async(req,res,next)=>{
    try{
    const {username,email,password} = req.body;
    const user = new User({email,username})
    const registeredUser = await User.register(user,password)
    req.login(registeredUser,(err)=>{
        if(err) return next(err);
        req.flash('success','welcome to campground!!')
        res.redirect('/campground')
    })
    
}catch(e){
    req.flash('error',e.message)
    res.redirect('/register')
}
}))

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) ,async(req,res)=>{
req.flash('success','Welcome Back');
res.redirect('/campground')
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campground');
    });
}); 
module.exports = router;