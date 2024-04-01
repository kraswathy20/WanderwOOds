const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const CathchAsync = require('./utils/CatchAsync');
const AppError = require('./utils/AppError');
const {campSchema} = require('./validateForms');
const Joi = require('joi');
const mongoose = require('mongoose')
const Campground = require('./model/campground')
const CatchAsync = require('./utils/CatchAsync');

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

const validateForm = (req,res,next)=>{
    const campSchema = Joi.object({
        campground:Joi.object({
            title: Joi.string().required(),
            price:Joi.number().required().min(0),
            image:Joi.string().required(),
            description:Joi.string().required(),
            location:Joi.string().required(),
        }).required()
    })
    const {error} = campSchema.validate(req.body)
    console.log(error);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg,404)
    }
    else{
        next();
    }
}
app.get('/campground', CathchAsync(async(req,res,next)=>{
    const camps = await  Campground.find()
    res.render('campgrounds/homepage',{camps})
}))

app.get('/campground/new',CatchAsync(async(req,res)=>{
    res.render('campgrounds/addcamps')
}))

app.post('/campground',validateForm, CatchAsync(async(req,res,next)=>{
    // if(!req.body.campground) throw new AppError('Invalid Campground Data',400)
   const Camp =  new Campground(req.body.campground)
   await Camp.save();
   res.redirect(`/campground/${Camp._id}`)
}))

app.get('/campground/:id/edit', CathchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const camp =await Campground.findById(id)
    res.render('campgrounds/update',{camp})
}))

app.put('/campground/:id',validateForm, CathchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const camp =await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true,new:true});
    res.redirect(`/campground/${camp._id}`)
}))

app.get('/campground/:id',CatchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id)
    res.render('campgrounds/details',{camp})
}))
app.delete('/campground/:id',CatchAsync(async (req,res,next)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground')
}))

app.all('*',(req,res,next)=>{
     return next(new AppError('Uhh-Ohh! Sorry We Could not find the page you are Searching!!', 404))
    // res.send('Page Not Found!!')
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error',{err});
   
})

app.listen(8000,()=>{
    console.log("Serving at port 3000");
})