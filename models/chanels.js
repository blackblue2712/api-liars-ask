const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const chanelSchema = new Schema({
    chanelName: {
        type: String,
        require: true
    },
    chanelDescription: String,
    chanelPhoto: 
        {
            photoBackground: String,
            photoIcon: String
        }
    ,
    members: [
        {
            type: String,
            ref: "users"
        }
    ],
    chanelMessages: [
        {
            sender: {
                type: ObjectId,
                ref: "users",
                require: true
            },
            content: {
                type: String,
                require: true
            },
            created: {
                type: Date,
                default: Date.now
            }
        }
    ],
    chanelCreated: {
        type: Date,
        default: Date.now
    }

});

const chanels = mongoose.model("chanels", chanelSchema);
module.exports = chanels;