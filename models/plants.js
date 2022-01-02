const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')


const imageSchema = new Schema(
  {
    url: String,
    filename : String
  }
);
imageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_150')
})
const PlantSchema = new Schema({
  name : String,
  images : [imageSchema],
  price: Number,
  description: String,
  author : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : 'Review'
    }
  ]
});

PlantSchema.post('findOneAndDelete', async function(doc){
  if(doc){
    await Review.deleteMany({
      _id :{
        $in : doc.reviews
      }
    })
  }
});

module.exports = mongoose.model('Plants',PlantSchema);
