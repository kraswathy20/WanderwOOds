const Campground = require('../model/campground')
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const {cloudinary} = require('../cloudinary')

module.exports.homepage = async(req,res,next)=>{
    const camps = await  Campground.find()
    res.render('campgrounds/homepage',{camps})
}

module.exports.addCamps = async(req,res,next)=>{
    res.render('campgrounds/addcamps')
}

module.exports.createNewCamp = async(req,res,next)=>{
   const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
   const Camp =  new Campground(req.body.campground)
   Camp.geometry = geoData.features[0].geometry
   Camp.images = req.files.map(f =>({url:f.path,filename:f.filename}))
   Camp.author = req.user._id;
   await Camp.save();
   req.flash('success','Successfully created a new Campground')
   res.redirect(`/campground/${Camp._id}`)
}

module.exports.editCamp = async(req,res,next)=>{
    const {id} = req.params;
    const camp =await Campground.findById(id)
    if(!camp){
        req.flash('error','Cannot Find that campground')
        return res.redirect('/campground')
    }
    if(!camp.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campground/${id}`)
    } else{
        res.render('campgrounds/update',{camp})
    }
}

module.exports.updateCamp = async(req,res,next)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true,new:true});
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    camp.geometry = geoData.features[0].geometry;
    const img =  (req.files.map(f=>({url:f.path,filename:f.filename})))
    camp.images.push(...img)
    await camp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename)
        }
      await  camp.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
    }
    req.flash('success','Successfully updated the Campground')
    res.redirect(`/campground/${camp._id}`)
}

module.exports.viewCamp = async(req,res,next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id)
    .populate({
        path:'reviews',
    populate:({
        path:'author'
    })
}).populate('author')  
    if(!camp){
        req.flash('error','Cannot Find that campground')
        return res.redirect('/campground')
    } else{
        res.render('campgrounds/details',{camp})
    }
}

module.exports.deleteCamp = async (req,res,next)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground')
}