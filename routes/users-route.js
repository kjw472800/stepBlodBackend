const { Router } = require('express');
const express= require('express');
const usersControllers= require('../controller/users-controller');
const checkAuth= require('../middleware/check-auth');
const {check}=require('express-validator');

const router=express.Router();

const signupValidators=[check('userName').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({min:6})];
router.post('/signup',signupValidators,usersControllers.signup);
router.post('/login',usersControllers.login);


module.exports=router;