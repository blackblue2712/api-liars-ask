const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const privateChatSchema = new Schema({
    sender: {
        type: ObjectId,
        ref: "Users",
        require: true
    },
    receiver: {
        type: ObjectId,
        ref: "Users",
        require: true
    },
    content: {
        type: String,
        require: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

const privateChat = mongoose.model("privateChat", privateChatSchema);
module.exports = privateChat;