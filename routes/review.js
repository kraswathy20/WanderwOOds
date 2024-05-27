const express = require('express')
const router = express.Router({mergeParams:true});
const CatchAsync = require('../utils/CatchAsync');
const {reviewSchema} = require('../validateForms');
const Campground = require('../model/campground')
const Review = require('../model/review')

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
console.log(error);
if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new AppError(msg,404)
}
else{
    next();
}
}

router.post('/',validateReview, CatchAsync(async(req,res)=>{
    console.log(req.params);
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.reviews);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully created new Review')
    res.redirect(`/campground/${campground._id}`);
}))
router.delete('/:reviewId',CatchAsync(async(req,res)=>{
    const {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash('success','Successfully deleted the Review')
    res.redirect(`/campground/${id}`)
}))

module.exports = router;