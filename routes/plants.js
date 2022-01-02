const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const plants = require('../controllers/plants');
const {isLoggedIn,isAuthor,validatePlant,isAdmin} = require('../middleware');

const{storage} = require('../cloudinary');
const multer  = require('multer');
const upload = multer({ storage });



router.get('/',catchAsync(plants.index));

router.get('/new',isLoggedIn,plants.renderNewForm);

router.post('/',isLoggedIn,upload.array('image') ,validatePlant,catchAsync(plants.createNewPlant));

// router.post('/',upload.array('image'),(req,res) =>{
//   console.log(req.body,req.files);
//   res.send('it worked!!');
// });

router.get('/:id',catchAsync(plants.showPlant));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(plants.rendereditForm));

router.put('/:id',isLoggedIn,isAuthor,upload.array('image') ,validatePlant,catchAsync(plants.editPlant));

router.delete('/:id', isAuthor,catchAsync(plants.deletePlant));

module.exports = router;
