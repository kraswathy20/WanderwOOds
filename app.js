// if(process.env.NODE_ENV !== "production"){
//     require('dotenv').config()
// }

require('dotenv').config()

// console.log(process.env.CLOUDINARY_SECRET);
// console.log(process.env.CLOUDINARY_CLOUD_NAME);

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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// const dbUrl = process.env.DB_URL ||' 'mongodb://127.0.0.1:27017/wanderWoods'
// console.log(dbUrl);
const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/user')
const MongoDBStore = require("connect-mongo")(session)




const dbUrl =process.env.DB_URL
// 'mongodb://127.0.0.1:27017/wanderWoods'
mongoose.connect(dbUrl)
.then(()=>{
    console.log('Mongoose connection established');
})
.catch((err)=>{
    console.log('Oops!! Connetion Error when connecting with Mongoose!! Try Again :(', err);
})

app.engine('ejs', ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/Views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith: '_',
  }));

//   const secret = process.env.SECRET  || 'thisshouldbeabettersecret';
  const store = new MongoDBStore({
    url:dbUrl,
    secret:'thisshouldbeabettersecret',
    touchAfter: 24 * 60 * 60,
  })

  store.on("error",function(e){
    console.log('SESSION STORE ERROR',e)
  })

const configSession = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true, only during production
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(configSession))
app.use(flash())
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
];
const connectSrcUrls = [
   
    "https://api.maptiler.com/", 
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://api.maptiler.com/",
                "https://res.cloudinary.com/dyebwfniv/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    console.log(req.query);
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