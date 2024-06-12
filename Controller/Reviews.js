const Review = require('../model/review')
const Campground = require('../model/campground')

module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.reviews);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully created new Review')
    res.redirect(`/campground/${campground._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash('success','Successfully deleted the Review')
    res.redirect(`/campground/${id}`)
}