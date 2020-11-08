const express= require('express');
const placeControllers= require('../controller/places-controller');
const checkAuth= require('../middleware/check-auth');

const router=express.Router();

router.get('/getallplaces',placeControllers.getAllPlace);
router.get('/getplacebyid',placeControllers.getPlaceById);


router.use(checkAuth);
router.post('/createplace',placeControllers.createPlace);
router.get('/getplacesbyuserid',placeControllers.getPlacesByUserId);


module.exports=router;