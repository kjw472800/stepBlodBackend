const mongoose= require('mongoose');


const postSchema= new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    steps:[{type:mongoose.Types.ObjectId, required:true, ref:'Place'}],
    creator:{type:mongoose.Types.ObjectId, required:true, ref:'User'},
    imageUrl:{type:String, required:true},
    imageKey:{type:String, required:true}
}, {
    timestamps: {  }
  }
);

module.exports=mongoose.model('Post',postSchema);