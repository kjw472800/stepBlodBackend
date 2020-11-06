const express= require('express');
const placeControllers= require('../controller/places-controller');


const router=express.Router();



router.post('/createPlace',placeControllers.createPlace);


module.exports=router;