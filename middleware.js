const Campground = require('./model/campground')
const Review = require('./model/review')
const AppError = require('./utils/AppError');
const {campSchema, reviewSchema} = require('./validateForms')


module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
      // store the url that searched for..
      req.session.returnTo = req.originalUrl;
        req.flash('error','You must Login first')
      return  res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req,res,next)=>{
  if(req.session.returnTo){
    res.locals.returnTo = req.session.returnTo
  }
  next();
}

module.exports.validateForm = (req,res,next)=>{
  console.log('Validating:', req.body);
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


module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id) 
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campground/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
  const {id,reviewId} = req.params;
  const review = await Review.findById(reviewId) 
  if(!review.author.equals(req.user._id)){
      req.flash('error','You do not have permission to do that')
      return res.redirect(`/campground/${id}`)
  }
  next();
}
module.exports.validateReview = (req,res,next)=>{
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