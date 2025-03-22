const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        required:true        
    },
    feedback:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("feedback",ContactSchema);