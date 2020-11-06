const mongoose= require('mongoose');
const address2coords=require('../util/address2coords');

const User=require('../models/user');
const Place=require('../models/place');

const HttpError = require('../models/http-error');


const createPlace = async (req, res, next) => {

    let coordinates;
    /*const { title, description, address } = req.body;
    creator=req.userData.userId;*/
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
        title:'testTitle',
        description:'testDescription',
        imageUrl: './test/testUrl',
        address,
        location:coordinates,
        creator:testUserId.id
    })
    
    let user;    
    console.log(coordinates);
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

    console.log(newPlace);
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

exports.createPlace=createPlace;