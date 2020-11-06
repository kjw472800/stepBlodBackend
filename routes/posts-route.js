const { Router } = require('express');
const express= require('express');
const postsControllers= require('../controller/posts-controller');



const router=express.Router();
router.post('/',usersControllers.post);



module.exports=router;