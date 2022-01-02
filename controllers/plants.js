const Plant = require('../models/Plants');
const {cloudinary} = require('../cloudinary');

module.exports.index = async(req,res) =>{
  const plants = await Plant.find({});
  res.render('plants/index',{plants});
};

module.exports.renderNewForm = (req,res) =>{
  res.render('plants/new');
};

module.exports.createNewPlant = async(req,res,next) =>{
  const plant = new Plant(req.body.plant);
  plant.images = req.files.map(f => ({ url: f.path, filename: f.filename}));
  plant.author = req.user._id;
  await plant.save();
  req.flash('success','successfully made a new plant!');
  res.redirect(`/plants/${plant._id}`)
};

module.exports.showPlant = async(req,res) =>{
  const plant = await Plant.findById(req.params.id).populate({
    path:'reviews',
    populate : {
      path : 'author'
    }
  }).populate('author');
  if(!plant){
    req.flash('error','Cannot find that plant');
    return res.redirect('/plants');
  }
  res.render('plants/show',{plant});
};

module.exports.rendereditForm = async(req,res) =>{
  const plant = await Plant.findById(req.params.id);
  if(!plant){
    req.flash('error','Cannot find that plant');
    return res.redirect('/plants');
  }
  res.render('plants/edit',{plant});
};

module.exports.editPlant = async(req,res) => {
  const{id} = req.params
  const plant = await Plant.findByIdAndUpdate(id,{...req.body.plant});
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
  plant.images.push(...imgs);
  await plant.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await plant.updateOne({$pull : {images : {filename : {$in : req.body.deleteImages}}}});
  }
  req.flash('success','Successfully updated plant!');
  res.redirect(`/plants/${plant._id}`)
};

module.exports.deletePlant = async(req,res) => {
  const{id} = req.params;
  await Plant.findByIdAndDelete(id);
  req.flash('success','Successfully Deleted plant!');
  res.redirect('/plants');
};
