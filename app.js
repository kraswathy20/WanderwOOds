if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

console.log(process.env.CLOUDINARY_SECRET);
console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./model/user')
const AppError = require('./utils/AppError')




const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/user')

mongoose.connect('mongodb://127.0.0.1:27017/wanderWoods')
.then(()=>{
    console.log('Mongoose connection established');
})
.catch((err)=>{
    console.log('Oops!! Connetion Error when connecting with Mongoose!! Try Again :(');
})

app.engine('ejs', ejsMate)
app.set('view engine','ejs')
app.set('Views',path.join(__dirname,'/view'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

const configSession = {
    secret:'thisshouldbeabigsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(configSession))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentuser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})



app.get('/newuser',async(req,res)=>{
    const user = new User({email:'newuser@gmail.com',username:'newUser'})
    const newbie = await User.register(user,'nugget');
    res.send(newbie)
})

app.get('/',(req,res)=>{
    res.render('home')
})

app.use('/', userRoutes)
app.use('/campground',campgroundRoutes);
app.use('/campground/:id/reviews',reviewRoutes)
app.use(express.static(path.join(__dirname,'public')))


app.all('*',(req,res,next)=>{
     return next(new AppError('Uhh-Ohh! Sorry We Could not find the page you are Searching!!', 404))
    // res.send('Page Not Found!!')
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error',{err});
   
})

app.listen(3000,()=>{
    console.log("Serving at port 3000");
})