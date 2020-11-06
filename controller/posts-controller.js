const Post=require('../models/post');
const User=require('../models/user');
const HttpError = require('../models/http-error');


const getPostByUserId= async(req,res,next)=>{
    
};

const getPostByPostId= async(req,res,next)=>{
    
}

const post=async(req,res,next)=>{

    const newPost= new Post({
        title:"testTitle",
        description: 'testDescription',
        imageUrl: './test/url',
        creator:"5fa456548b6ffe830099a2d5"
    });

    try{
        await newPost.save();
    }
    catch(err){
        const error=new HttpError('Post failed',500);
        next(error);
        return;
    }

    res.status(201).json({msg:'successful post'});

}

exports.getPostByPostId=getPostByPostId;
exports.getPostByUserId=getPostByUserId;
exports.post=post;