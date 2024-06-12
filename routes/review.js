const express = require('express')
const router = express.Router({mergeParams:true});
const CatchAsync = require('../utils/CatchAsync');
const {reviewSchema} = require('../validateForms');
const Review = require('../model/review')
const {validateReview,isLoggedin,isReviewAuthor} = require('../middleware')
const reviews = require('../Controller/Reviews')


router.post('/',isLoggedin,validateReview, CatchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedin,isReviewAuthor,CatchAsync(reviews.deleteReview))

module.exports = router;