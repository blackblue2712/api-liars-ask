const PM = require("../models/private-chat");
const formidable = require("formidable");
const cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME2, 
    api_key: process.env.API_KEY2, 
    api_secret: process.env.API_SECRET2
});


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
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
    
        form.parse(req, function(err, fields, files) {
            let { sender, receiver, content } = fields;
            pm.sender = sender;
            pm.receiver = receiver;
            pm.content = content;
            if(files.photo) {
                cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
                    if(error) return res.status(400).json( {message: "error occur (photo pm)"} )
                    pm.photo = result.secure_url;
                    this.urlContainImage = result.secure_url;
                }).then( () => {
                    pm.save( () => {
                        return res.status(200).json( {urlContainImage: this.urlContainImage} );
                    });
                });
            } else {
                pm.save( () => {
                    return res.json({});
                });
            }
        })
    } catch(e) { console.log(e) } 
}

