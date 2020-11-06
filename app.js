require('dotenv').config();
const express= require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');

const placesRoutes= require('./routes/places-route');
const usersRoutes= require('./routes/users-route');
const postsRoutes= require('./routes/posts-route');
const HttpError = require('./models/http-error')


const app = express();


app.use(bodyParser.json());
app.use('/api/users', usersRoutes);
app.use('/api/places',placesRoutes);
app.use('/api/posts',postsRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
     next(error);
});

app.use((error, req, res, next) => {

    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured!" });
});


mongoose
    .connect(
        process.env.DB_HOST
        ,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})
    .then(()=>{
        app.listen(5000);
        console.log("Connected to Database");
    })
    .catch((err)=>{
        console.log((err));
    })
