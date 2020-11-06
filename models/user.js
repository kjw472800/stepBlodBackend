const mongoose=require('mongoose');

const userSchenma= new mongoose.Schema({
    email:{type:String,require:true,unique:true},
    userName:{type:String,require:true},
    password:{type:String, required:true, minlength:6},
    postIds:[{type:mongoose.Types.ObjectId,ref:'Post',required:true}],
    placeIds:[{type:mongoose.Types.ObjectId,ref:'Place',required:true}]
}, {
    timestamps: {  }
});

module.exports=mongoose.model('User',userSchenma)