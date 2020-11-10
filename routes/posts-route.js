const express= require('express');
const postsControllers= require('../controller/posts-controller');
const checkAuth= require('../middleware/check-auth');
const fileUpload=require('../middleware/file-upload')


const router=express.Router();

router.get('/',postsControllers.getAllPosts);
router.use(checkAuth);
router.post('/',fileUpload.single('image'),postsControllers.createPost);
router.get('/user',postsControllers.getPostByUserId);



module.exports=router;