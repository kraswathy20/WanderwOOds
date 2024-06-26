const Joi = require('joi');

module.exports.campSchema = Joi.object({
    campground:Joi.object({
        title: Joi.string().required(),
        price:Joi.number().required().min(0),
        // image:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = Joi.object({
    reviews:  Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required()
    }).required()
})