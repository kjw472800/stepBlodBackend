const { Router } = require('express');
const express= require('express');
const usersControllers= require('../controller/users-controller');
const checkAuth= require('../middleware/check-auth');


const router=express.Router();
router.post('/signup',usersControllers.signup);
router.post('/login',usersControllers.login);


module.exports=router;