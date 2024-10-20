const mongoose = require('mongoose')
const mongodb = require('mongodb')
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, 
        socketTimeoutMS: 45000,          
        family: 4
    }).then(
        console.log("database connected")
    ).catch((err) => {
        console.log(err);
    })

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
        console.log('Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected from DB');
    });

};


module.exports = connectDB;