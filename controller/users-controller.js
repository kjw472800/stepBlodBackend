require('dotenv').config();

const User=require('../models/user');
const HttpError = require('../models/http-error');

const bycrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

// post /api/users/signup
// post /api/users/login


const signup = async (req,res,next)=>{
    
    const {name,email,password}= req.body;
    
    let hashedPassword;
    try{
        hashedPassword= await bycrypt.hash(password,Number(process.env.SALT_ROUND));

    }catch(err){
        const error= new HttpError('Signup failed here');
        next(error);
        return;
    }
    
    const newUser= new User({
        name,
        email,
        password:hashedPassword,
        postIds:[]
    })

    try{
        await newUser.save();
    }catch(err){
        const error= new HttpError('Signup failed',500);
        next(error);
        return;
    }
    let token;
    try {
        token=await jwt.sign({userId:newUser.id,email:newUser.email},process.env.jwtKey, {expiresIn: '1h'});
    }catch(err){
        const error= new HttpError('Please log in!!',500);
        next(error);
        return;
    }
    
    res.status(201).json({msg:"signup ok",token:token});
}


const login = async (req,res,next)=>{
    const {email,password}= req.body;
    
    let user;
    try{
        user= await User.findOne({email:email});
    }catch(err){
        const error= new HttpError('Login falied',500);
        next(error);
        return;
    }

    if(!user){
        next( new HttpError('Invaild email',401));
        return;
    }
 
    let isValidPassword;
    try{
        isValidPassword = await bycrypt.compare(password,user.password);
    }catch(err){
        const error= new HttpError("Invaild password",401);
        return next(error);
    } 
    
    if(!isValidPassword){
        next( new HttpError('Invaild passwordQQ',401));
        return;
    }

    let token;
    try {
        token=await jwt.sign({userId:user.id,email:user.email},process.env.jwtKey, {expiresIn: '1h'});
    }catch(err){
        const error= new HttpError('Login failed',500);
        next(error);
        return;
    }
    
    res.status(201).json({msg:"login ok",token:token});
    

}

exports.signup=signup;
exports.login=login;