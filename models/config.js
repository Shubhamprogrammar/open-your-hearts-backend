const mongoose = require("mongoose");
const process = require('process');
const dotenv = require('dotenv')

dotenv.config();

const mongoURI = process.env.mongoURI;

const connectToMongo = async ()=>{
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true
    });
    console.log("Mongoose connected successfully");
}

module.exports = connectToMongo;