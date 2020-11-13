require('dotenv').config();
const express= require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
let cors = require('cors')
const fs= require('fs');
const path=require('path');

const placesRoutes= require('./routes/places-route');
const usersRoutes= require('./routes/users-route');
const postsRoutes= require('./routes/posts-route');
const HttpError = require('./models/http-error')


const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads','images')));
// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin",'*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requseted-With, Content-Type, Accept, Authorization');
//     res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
//     next();
// });
app.use('/uploads/images', express.static(path.join('uploads','images')));

app.use(cors());

app.use('/api/users', usersRoutes);
app.use('/api/places',placesRoutes);
app.use('/api/posts',postsRoutes);

app.use((req, res, next) => {
    
    const error = new HttpError('Could not find this route', 404);
     next(error);
});

app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path,(err)=>{
            console.log(err);
        });
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured!" });
});


mongoose
    .connect(
        process.env.DB_HOST
        ,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})
    .then(()=>{
        app.listen(process.env.PORT || 5000);
        console.log("Connected to Database");
    })
    .catch((err)=>{
        console.log((err));
    })
