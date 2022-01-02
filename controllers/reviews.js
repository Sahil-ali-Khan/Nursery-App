const Review = require('../models/review');
const Plant = require('../models/Plants');

module.exports.addReview = async(req,res)=>{
  const plant = await Plant.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  plant.reviews.push(review);
  await review.save();
  await plant.save();
  req.flash('success','Successfully Created Review!');
  res.redirect(`/plants/${plant._id}`);
};

module.exports.deleteReview = async(req,res)=>{
  const {id,reviewId} = req.params;
  await Plant.findByIdAndUpdate(id,{$pull : {reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success','Successfully Deleted Review!');
  res.redirect(`/plants/${id}`);
};
