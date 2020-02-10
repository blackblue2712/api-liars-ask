const PM = require("../models/private-chat");

module.exports.getMessageIndividualUser = (req, res) => {
    try {
        let { senderId, receiverId } = req.query;
        PM.find({
            $or: [
                {
                    $and: [
                        {sender: senderId},
                        {receiver: receiverId}
                    ]
                },
                {
                    $and: [
                        {sender: receiverId},
                        {receiver: senderId}
                    ]
                }
                
            ]
            
        })
        // .sort({created: -1})
        .populate("sender", "_id fullname email photo")
        .populate("receiver", "_id fullname email photo")
        .exec( (err, messages) => {
            if(err) {
                return res.status(400).json( {message: "error occur - get message individual user"} );
            } else {
                return res.status(200).json(messages);
            }
        });
    } catch (err) {
        console.log(err)
    }
    
}

module.exports.priveateChat = (req, res) => {
    io.on("connection", function(socket) {

    })


    return res.status(200);
}

module.exports.postSavePrivateMessage = (req, res) => {
    try {
        let pm = new PM();
        let { sender, receiver, content } = req.body;
        pm.sender = sender;
        pm.receiver = receiver;
        pm.content = content;
    
        pm.save();
        res.end();
    } catch(err) {
        console.log(err)
    }
}

