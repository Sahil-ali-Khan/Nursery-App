const mongoose = require('mongoose');
const Plant = require('../models/Plants')

mongoose.connect('mongodb://localhost:27017/nursery',{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",() =>{
  console.log("Database connected");
});

const seedDB = async () =>{
  await Plant.deleteMany({});
  const p1 = new Plant({
                          name: 'white flower',
                          description: 'very costly!!',
                          price: 2000 ,
                          author : '601d2b0ac5c5de271c2ce6cc',
                          image:'https://content3.jdmagicbox.com/comp/def_content/plant_nurseries/default-plant-nurseries-4.jpg'});
  const p2 = new Plant({
                          name: 'rose ',
                          description: 'cheap!!',
                          price: 20,
                          author : '601d2b0ac5c5de271c2ce6cc',
                          image: 'https://lh3.googleusercontent.com/VE4rFifM9nKO-Ip2AdV1DzjepmB3M-1t2NAC5hCOEsbbEjvygHKg71LoysWlHdvK4i6_ZKjBvFAaG0Mc=w1080-h608-p-no-v0'});
  await p1.save();
  await p2.save();
}

seedDB().then(() =>{
  mongoose.connection.close();
});
