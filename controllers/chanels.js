const formidable = require("formidable");
const cloudinary = require('cloudinary');
const Chanel = require("../models/chanels");

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME2, 
    api_key: process.env.API_KEY2, 
    api_secret: process.env.API_SECRET2
});

module.exports.getChanels = (req, res) => {
    try {
        Chanel
        .find({})
        .sort([["created", -1]])
        .exec( (err, chanels) => {
            if(err || !chanels) return res.status(200).json( {message: "error occur (get chanels)"} )
            return res.status(200).json(chanels);
        });
    } catch (e) { console.log(e) }
    
}

module.exports.getSingleChanel = (req, res) => {
    try {
        let { cid } = req.params;
        Chanel
        .findById(cid)
        .populate("chanelMessages.sender", "_id fullname email photo")
        .exec( (err, chanel) => {
            console.log(err)
            if(err || !chanel) return res.status(200).json( {message: "error occur (get single chanel)"} )
            return res.status(200).json(chanel);
        });
    } catch (e) { console.log(e) }
}

module.exports.postCreateChanelServer = (req, res) => {
    try {
        let chanel = new Chanel();
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
    
        form.parse(req, function(err, fields, files) {
            console.log(fields)
            let { chanelName, chanelDescription } = fields;
            chanel.chanelName = chanelName;
            chanel.chanelDescription = chanelDescription;
            if(files.photoBackground) {
                cloudinary.v2.uploader.upload(files.photoBackground.path, function(error, result) {
                    if(error) return res.status(400).json( {message: "error occur (photo chanel)"} )
                    chanel.chanelPhoto.photoBackground = result.secure_url;
                    chanel.chanelPhoto.photoIcon = result.secure_url;
                }).then( () => {
                    chanel.save( (err, result) => {
                        if(err) {
                            return res.status(400).json( {message: "Error occur (create chanel)"} )
                        }
                        return res.status(200).json( {message: `Chanel created`} );
                    });
                });
            } else {
                return res.status(400).json( {message: "No file choose"} )
            }
        })
    } catch(e) { console.log(e) } 
}

module.exports.postSaveChanelMessage = (req, res) => {
    try {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
    
        form.parse(req, function(err, fields, files) {
            let { cid, uid, content } = fields;
            console.log("***SEND***", { cid, uid, content })
            Chanel
            .findById(cid)
            .exec( (err, chanel) => {
                if(err || !chanel) {
                    return res.status(200).json( {message: "error occur (save chanel message)"} );
                }
                if(files.photo) {
                    cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
                        if(error) return res.status(400).json( {message: "error occur (photo chanel)"} )
                        chanel.chanelMessages.push({photo: result.secure_url, sender: uid, content});
                        this.urlContainImage = result.secure_url;
                    }).then( () => {
                        chanel.save();
                        return res.status(200).json( {urlContainImage: this.urlContainImage} );
                    });
                } else {
                    chanel.chanelMessages.push({content, sender: uid});
                    chanel.save();
                    return res.json({});
                }
            });
        });
    } catch(e) { console.log(e) } 

    
    
}