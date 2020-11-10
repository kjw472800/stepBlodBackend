const express= require('express');
const placeControllers= require('../controller/places-controller');
const checkAuth= require('../middleware/check-auth');
const fileUpload=require('../middleware/file-upload');

const router=express.Router();

router.get('/',placeControllers.getAllPlace);
router.use(checkAuth);
router.post('/',fileUpload.single('image'),placeControllers.createPlace);
router.get('/user',placeControllers.getPlacesByUserId);


module.exports=router;