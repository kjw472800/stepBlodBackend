const express= require('express');
const postsControllers= require('../controller/posts-controller');
const checkAuth= require('../middleware/check-auth');


const router=express.Router();

router.use(checkAuth);
router.post('/createpost',postsControllers.createPost);



module.exports=router;