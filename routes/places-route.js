const express= require('express');
const placeControllers= require('../controller/places-controller');
const checkAuth= require('../middleware/check-auth');
const fileUpload=require('../middleware/file-upload');
const {check}=require('express-validator');

const router=express.Router();

router.get('/',placeControllers.getAllPlace);
router.use(checkAuth);

const postValidators=[check('title').not().isEmpty(), check('description').isLength({min:5}), check('address').not().isEmpty()];
router.post('/',fileUpload.single('image'),postValidators,placeControllers.createPlace);
router.get('/user',placeControllers.getPlacesByUserId);


module.exports=router;