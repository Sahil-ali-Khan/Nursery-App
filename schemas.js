const Joi = require('joi');

module.exports.joiPlantSchema = Joi.object({
  plant: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    description: Joi.string().required()
  }).required(),
  deleteImages : Joi.array()
});

module.exports.joiReviewsSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
});
