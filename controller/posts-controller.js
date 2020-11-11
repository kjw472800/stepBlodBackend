const mongoose= require('mongoose');
const { MongoClient, ObjectID } = require('mongodb');
const Post=require('../models/post');
const User=require('../models/user');
const HttpError = require('../models/http-error');
const place = require('../models/place');
const fs= require('fs');
const {validationResult}= require('express-validator');
///return {post, creator:user.userName};
const getPostByUserId= async(req,res,next)=>{
    const userId = req.userData.userId; //{pid:'p1'}
    
    let posts;
    try{
        posts= await Post.find({creator:userId}).populate('steps').populate('creator');
    }catch(err){
        const error= new HttpError('Could not fetch posts',500);
        next(error);
        return;
    }
    
    let response;
    const postsWithCreator= posts.map(p=>p.toObject({getters:true}));

    response= postsWithCreator.map((p)=>{         
        
        return {...p,creator:p.creator.userName}
    })
    res.json({ posts: response });
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

const getAllPosts= async(req,res,next)=>{
    
    let posts;
    try{
        posts= await Post.find().populate('steps').populate('creator');
    }catch(err){
        const error= new HttpError('Could not fetch posts',500);
        next(error);
        return;
    }
    
    let response;
    const postsWithCreator= posts.map(p=>p.toObject({getters:true}));
    //console.log(postsWithCreator);
    response= postsWithCreator.map((p)=>{         
        
        return {...p,creator:p.creator.userName}
    })
    //console.log(response);
    res.json({ posts: response });
}

const createPost = async (req, res, next) => {
    const errors=validationResult(req);
    
    if(!errors.isEmpty()){
        const error= new HttpError('Invalid post creation',422);
        next(error);
        return;
    }

    let {title,description,steps,subtitle}= req.body;
    const creator=req.userData.userId;
    steps=steps.split(",");

    const newPost = new Post({
        title,
        description,
        steps,
        creator,
        subtitle,
        imageUrl:req.file.path
    })
    
    let user;    
    try{
        user=await User.findById(creator);
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

const deletePost =async (req, res, next) => {
    const postId = req.params.pid;

    let post;
    try{
        post = await Post.findById(postId).populate('creator');
    }
    catch(err){
        const error= new HttpError("Could not delete a post by a id",500);
        next(error);
        return;
    }  

    if (!post) {
        const error= new HttpError("Could not find a post which you want to delete with this id",500);
        return next(error);
    }

    if(post.creator.id!==req.userData.userId){
        const error= new HttpError("Unauthorized",401);
        return next(error);
    }

    const imagePath= post.imageUrl; 
    try{
        const sess= await mongoose.startSession();
        sess.startTransaction();
        await post.remove({session:sess});
        post.creator.postIds.pull(post);
        await post.creator.save({session:sess});
        await sess.commitTransaction();

    }catch(err){
        const error= new HttpError("Could not delete",500);
        return next(error);
    };
    console.log(imagePath);
    fs.unlink(imagePath,err=>{
        console.log(err);
    })
    res.status(200).json({ message: "Successfully delete!" });
}

exports.getPostByPostId=getPostByPostId;
exports.getPostByUserId=getPostByUserId;
exports.createPost=createPost;
exports.getAllPosts=getAllPosts;
exports.deletePost=deletePost;