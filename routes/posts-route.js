const express= require('express');
const postsControllers= require('../controller/posts-controller');
const checkAuth= require('../middleware/check-auth');
const fileUpload=require('../middleware/file-upload')
const {check}=require('express-validator');


const router=express.Router();

router.get('/',postsControllers.getAllPosts);
router.use(checkAuth);
const postValidators=[check('title').not().isEmpty(), check('description').isLength({min:10})];
router.post('/',fileUpload.single('image'),postValidators,postsControllers.createPost);
router.get('/user',postsControllers.getPostByUserId);
router.delete('/:pid',postsControllers.deletePost);


module.exports=router;