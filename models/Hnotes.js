const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const HNotesSchema = new mongoose.Schema({
    "user":{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    "title": {
        type: String,
        required: true
    },
    "heart":{
        type:String,
        required:true
    },
    comments: [CommentSchema] // Add comments as an array
})

module.exports = mongoose.model("heartnotes",HNotesSchema);