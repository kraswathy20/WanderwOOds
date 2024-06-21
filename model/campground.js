const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')


https://res.cloudinary.com/dyebwfniv/image/upload/w_300/WanderWoodsCamp/pf3yuue3ummareeonouy.JPG


imageSchema = new Schema({
    url:String,
    filename:String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})
const campgroundSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    location:String,
    images:[imageSchema],
    author:
        {
            type:Schema.Types.ObjectId,
            ref:'User' 
        }
    , 
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