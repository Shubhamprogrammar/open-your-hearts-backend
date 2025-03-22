const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/Hearts"

const connectToMongo = async ()=>{
    mongoose.connect(mongoURI);
    console.log("Mongoose connected successfully");
}

module.exports = connectToMongo;