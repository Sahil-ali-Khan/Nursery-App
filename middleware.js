const Plant = require('./models/Plants');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const {joiPlantSchema,joiReviewsSchema} = require('./schemas.js');

module.exports.isLoggedIn = (req,res,next) =>{
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error', "Log in First");
    return res.redirect('/login');
  }
  next();
}

module.exports.isAuthor = async(req,res,next) =>{
  const {id} = req.params;
  const plant = await Plant.findById(id);
  if(!plant.author.equals(req.user._id)) {
    req.flash('error','You do not have permissions to do that!');
    return res.redirect(`/plants/${plant._id}`);
  }
  next();
}

module.exports.validateReview = (req,res,next) =>{
  const{error} = joiReviewsSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}

module.exports.validatePlant = (req,res,next) =>{
  const {error} = joiPlantSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el =>el.message).join(',')
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}

module.exports.isReviewAuthor = async(req,res,next) =>{
  const {id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)) {
    req.flash('error','You do not have permissions to do that!');
    return res.redirect(`/plants/${plant._id}`);
  }
  next();
}
