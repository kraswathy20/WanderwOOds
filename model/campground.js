const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')
const campgroundSchema = new Schema({
    title:String,
    image:String,
    description:String,
    price:Number,
    location:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})



campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports =  mongoose.model('Campground',campgroundSchema)