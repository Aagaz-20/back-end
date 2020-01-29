const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();


//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//routes
const userRoute = require('./routes');
app.use(userRoute);


//api listening on port 3000
//database connection (localhost --> salozone)
mongoose
    .connect(process.env.MONGO_URI)
    .then( result => {
        app.listen(process.env.PORT || 3000);
        console.log('connected');
    })
    .catch( err => {
        console.log(err);
    });