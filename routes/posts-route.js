const express= require('express');
const postsControllers= require('../controller/posts-controller');



const router=express.Router();
router.post('/createPost',postsControllers.createPost);



module.exports=router;