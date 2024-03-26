require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const {logger} = require('./middleware/logger');
const {errorHandler} = require('./middleware/errorHandler');
const cookieParser = require("cookie-parser");
const cors= require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require("mongoose");
const {logEvents} = require('./middleware/logger');
connectDB();
app.use(cors(corsOptions));
app.use(logger);
app.use(cookieParser());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/root'));
app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
            res.sendFile(path.join(__dirname, 'public/views/404.html'));
    }
    else if(req.accepts('json')){
        res.json({error: 'Not found'});
    }
    else{
        res.type('txt').send('Not found');
    }
});
app.use(errorHandler);

mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

});

mongoose.connection.on('error', (err) => {
    console.error(err);
    logEvents(`${err}`,'error.log');
});
