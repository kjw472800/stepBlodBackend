const mongoose= require('mongoose');


const postSchema= new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    imageUrl:{type:String, required:true},
    creator:{type:mongoose.Types.ObjectId, required:true, ref:'User'}
}, {
    timestamps: {  }
  }
);

module.exports=mongoose.model('Post',postSchema);