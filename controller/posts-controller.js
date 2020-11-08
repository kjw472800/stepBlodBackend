const mongoose= require('mongoose');
const { MongoClient, ObjectID } = require('mongodb');
const Post=require('../models/post');
const User=require('../models/user');
const HttpError = require('../models/http-error');
const place = require('../models/place');


const getPostByUserId= async(req,res,next)=>{
    const userId = req.params.uid; //{pid:'p1'}

    let userWithPosts;
    try{
        //get cursor by Mongo, array by Mongoose
        // User.find({creator:userId})
        userWithPosts = await User.findById(userId).populate('posts');
    }
    catch(err){
        const error= new HttpError("Could not get a post by this user id",500);
        next(error);
        return;
    }  

    if (!userWithPosts || userWithPosts.posts.length === 0) {
        const error = new HttpError('Sorry, this user has no place to share', 404);
        return next(error);
    }
    res.json({ places: userWithPosts.posts.map(post=>post.toObject({getters:true})) });
};

const getPostByPostId= async(req,res,next)=>{  
    
    const postId =req.params.uid;
    //let postId;
    let post;
    try{
         post= await Post.findById(postId);
    }catch(err){
        const error =new HttpError('Fetch post failed',500);
        next(error);
        return;
    }

    if(!post){
        const error =new HttpError('Could not find a post by the id',500);
        next(error);
        return;
    }
    
    res.json({place: post.toObject({getters:true})})
}

const createPost = async (req, res, next) => {

    let testUserId;

    try{
        testUserId=await User.findOne({email:'test1@test.com'});
    }catch(error){
        next(error);
        return ;   
    }

    const newPost = new Post({
        title:'testTitle',
        description:'testDescription',
        steps: [],
        creator:testUserId.id
    })
    
    let user;    
    try{
        user=await User.findById(testUserId.id);
    }catch(err){
        const error= new HttpError("Creating place failed,Sorry about system errors",500);
        return next(error);
    }

    if(!user){
        const error= new HttpError("Creating place failed,Could not find this user",500);
        return next(error);
    }

    // save place and update user,so we have to do a transaction
    try{
        //await newPost.save();
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await newPost.save({session:sess});
        user.postIds.push(newPost);
        await user.save({session:sess});
        await sess.commitTransaction();

    }catch(err){
        const error= new HttpError("Creating place failed",500);
        return next(err);
    }

    res.status(201).json({ post: newPost });
}

exports.getPostByPostId=getPostByPostId;
exports.getPostByUserId=getPostByUserId;
exports.createPost=createPost;