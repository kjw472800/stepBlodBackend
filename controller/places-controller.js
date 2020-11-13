const mongoose= require('mongoose');
const address2coords=require('../util/address2coords');

const User=require('../models/user');
const Place=require('../models/place');

const HttpError = require('../models/http-error');
const {validationResult}= require('express-validator');

///return {place, creator:user.userName};


const getAllPlace = async (req, res, next) => {
    let place;
    try{
        place = await Place.find().populate('creator');
    }
    catch(err){
        const error= new HttpError("Could not fetch places",500);
        next(error);
        return;
    }  

    const placeObjs=place.map( p => p.toObject({getters:true}));
    
    const response= placeObjs.map((p)=>{
        
        return {...p,creator:p.creator.userName};
    })
    //console.log(response);
    res.status(200).json({places:response});
};

const getPlacesByUserId = async(req, res, next) => {
    const userId =req.userData.userId; //{pid:'p1'}
    let userWithPlaces;
    try{
        //get cursor by Mongo, array by Mongoose
        // User.find({creator:userId})
        userWithPlaces = await User.findById(userId).populate('placeIds');
    }
    catch(err){
        const error= new HttpError("Could not get a place by a user id",500);
        next(error);
        return;
    }  
    //console.log(userWithPlaces);
    if (!userWithPlaces || userWithPlaces.placeIds.length === 0) {
        res.json({
            places:[]
        }
        );
    }
    else{
        res.json({ places: userWithPlaces.placeIds.map(place=>{
            let response=place.toObject({getters:true}) ;
            response= {...response, creator:userWithPlaces.userName};
            return response;
        }) });
    }
    
}



const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid; //{pid:'p1'}
    let place;
    try{
        place = await Place.findById(placeId);
    }
    catch(err){
        const error= new HttpError("Could not find a place by a id",500);
        next(error);
        return;
    }  
    if (!place) {
        const error= new HttpError("Could not find a place by a id",500);
        return next(error);
    }
    res.json({ place: place.toObject({getters:true}) });
};



const createPlace = async (req, res, next) => {
    const errors=validationResult(req);
    
    if(!errors.isEmpty()){
        const error= new HttpError('Invalid place creation',422);
        next(error);
        return;
    }

    let coordinates;
    const { title, subtitle,description,address } = req.body;
    creator=req.userData.userId;
    try {
        coordinates = await address2coords(address);
    } catch (error) {
        next(error);
        return;
    };
    

    const newPlace = new Place({
        title,
        description,
        subtitle,
        imageUrl:req.file.path,
        address,
        location:coordinates,
        creator
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
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await newPlace.save({session:sess});
        user.placeIds.push(newPlace);
        await user.save({session:sess});
        await sess.commitTransaction();

    }catch(err){
        const error= new HttpError("Creating place failed",500);
        return next(err);
    }
    //console.log(newPlace);
    res.status(201).json({ place: newPlace });
}

const deletePlace =async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try{
        /// link to user and save it as place.creator
        place = await Place.findById(placeId).populate('creator');
    }
    catch(err){
        const error= new HttpError("Could not delete a place by a id",500);
        next(error);
        return;
    }  

    if (!place) {
        const error= new HttpError("Could not find a place which you want to delete with this id",500);
        return next(error);
    }

    if(place.creator.id!==req.userData.userId){
        const error= new HttpError("Unauthorized",401);
        return next(error);
    }

    const imagePath= place.imageUrl; 
    try{
        const sess= await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session:sess});
        place.creator.placeIds.pull(place);
        await place.creator.save({session:sess});
        await sess.commitTransaction();

    }catch(err){
        const error= new HttpError("Could not delete",500);
        return next(error);
    };
    fs.unlink(imagePath,err=>{
        console.log(err);
    })
    res.status(200).json({ message: "Successfully delete!" });
}
exports.getAllPlace=getAllPlace;
exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;