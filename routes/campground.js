const express = require('express')
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const Campground = require('../model/campground')
const AppError = require('../utils/AppError');
const {campSchema} = require('../validateForms');
const {isLoggedin} = require('../middleware')

const validateForm = (req,res,next)=>{
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

router.get('/', CatchAsync(async(req,res,next)=>{
    const camps = await  Campground.find()
    res.render('campgrounds/homepage',{camps})
}))

router.get('/new',isLoggedin,CatchAsync(async(req,res,next)=>{
    res.render('campgrounds/addcamps')
}))

router.post('/',isLoggedin,validateForm, CatchAsync(async(req,res,next)=>{
    // if(!req.body.campground) throw new AppError('Invalid Campground Data',400)
   const Camp =  new Campground(req.body.campground)
   await Camp.save();
   req.flash('success','Successfully created a new Campground')
   res.redirect(`/campground/${Camp._id}`)
}))

router.get('/:id/edit',isLoggedin, CatchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const camp =await Campground.findById(id)
    res.render('campgrounds/update',{camp})
}))

router.put('/:id',validateForm,isLoggedin, CatchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const camp =await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true,new:true});
    req.flash('success','Successfully updated the Campground')
    res.redirect(`/campground/${camp._id}`)
}))

router.get('/:id',CatchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id).populate('reviews');  
    if(!camp){
        req.flash('error','uh-Oh! Your Search Campground is missing')
        return res.redirect('/campground')
    } else{
        res.render('campgrounds/details',{camp})
    }
    
}))
router.delete('/:id',isLoggedin,CatchAsync(async (req,res,next)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground')
}))

module.exports = router;