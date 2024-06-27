const mongoose = require('mongoose')
const Campground = require('../model/campground')
const cities = require('./cities');
const {descriptors,places} = require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/wanderWoods')
.then(()=>{
    console.log('Mongoose connection established');
})
.catch((err)=>{
    console.log('Oops!! Connetion Error when connecting with Mongoose!! Try Again :(');
})

const sample = arr => arr[Math.floor(Math.random() * arr.length)];
const camp = async()=>{
   await Campground.deleteMany({});
    for(i=0;i<50;i++){
        const randCityIndex = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1000)
        const campground = new Campground({
            location: `${cities[randCityIndex].city}, ${cities[randCityIndex].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            price,
            geometry: {
              type: 'Point',
              coordinates: [ 
                cities[randCityIndex].longitude, 
                cities[randCityIndex].latitude
                ],
               
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dyebwfniv/image/upload/v1718739341/WanderWoodsCamp/mg5c7disxqu3kcsjgu3v.jpg',
                  filename: 'WanderWoodsCamp/mg5c7disxqu3kcsjgu3v',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dyebwfniv/image/upload/v1718739343/WanderWoodsCamp/ttq26lr7mnncvbklkxcp.jpg',
                  filename: 'WanderWoodsCamp/ttq26lr7mnncvbklkxcp',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dyebwfniv/image/upload/v1718739345/WanderWoodsCamp/bzs9g3eohjbymroxjzux.jpg',
                  filename: 'WanderWoodsCamp/bzs9g3eohjbymroxjzux',
                
                }
              ],
            author:'664daef8695460426a862798',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos suscipit tenetur, error harum inventore dolorum rerum. Ea debitis voluptas cupiditate ut, iusto accusamus aperiam alias harum atque dolores tempora corporis.'
        });
        await campground.save()
    }
    
}
camp().then(()=>{
    console.log('closed');
    mongoose.connection.close();

})


    

