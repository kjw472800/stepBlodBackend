const mongoose= require('mongoose');
const address2coords=require('../util/address2coords');

const User=require('../models/user');
const Place=require('../models/place');

const HttpError = require('../models/http-error');


const getAllPlace = async (req, res, next) => {
    let place;
    try{
        place = await Place.find();
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
    res.json({ places: place.map( p => p.toObject({getters:true})) });
};

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
    if (!userWithPlaces || userWithPlaces.placeIds.length === 0) {
        const error = new HttpError('Sorry, this user has no place to share', 404);
        return next(error);
    }
    res.json({ places: userWithPlaces.placeIds.map(place=>place.toObject({getters:true})) });
}

const createPlace = async (req, res, next) => {

    let coordinates;
    const { title, subtitle,description } = req.body;
    creator=req.userData.userId;
    const address= 'Taipei 101';
    try {
        coordinates = await address2coords(address);
    } catch (error) {
        next(error);
        return;
    };

    let testUserId;

    try{
        testUserId=await User.findOne({email:'test1@test.com'});
    }catch(error){
        next(error);
        return ;   
    }

    const newPlace = new Place({
        title,
        description,
        subtitle,
        imageUrl:'./test/testUrl',
        address,
        location:coordinates,
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

    res.status(201).json({ place: newPlace });
}
exports.getAllPlace=getAllPlace;
exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;