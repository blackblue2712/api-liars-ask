const User = require("../models/users");
const formidable = require("formidable");
const cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

module.exports.getUsers = (req, res) => {
    User.find( {}, (err, users) => {
        if(err) return res.status(400).json( {message: "Error occur"} );
        return res.status(200).json(users);
    });
}

module.exports.getSingleUser = (req, res) => {
    console.log("getUsers controller called");
}

module.exports.getInfoLoggedUser = (req, res) => {
    console.log(req.payload)
    req.userPayload.hashed_password = undefined;
    req.userPayload.salt = undefined;

    return res.json( req.userPayload )
}

module.exports.requrestRelatedUserId = async (req, res, next, id) => {
    await User.findById(id, (err, user) => {
        if(err || !user) {
            return res.status(400).json( {message: "Can not find user with that id"} );
        } else {
            req.userPayload = user;
            next();
        }
    });
}

module.exports.updateStoryUser = (req, res) => {
    let user = req.userPayload;
    let { bioUpdate, fquotes } = req.body;
    user.bio = bioUpdate;
    user.quotes = fquotes;

    user.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur when update story user, please try again"} );
        return res.status(200).json( {message: "Story updated"} );
    })
}

module.exports.updateInfoUser = (req, res) => {
    let user = req.userPayload;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    console.log("parse");
    form.parse(req, function(err, fields, files) {
        console.log(fields)
        const { id, fullname, currentPassword } = fields;
        console.log(files.photo);
        if(user.authenticate(currentPassword)) {
            user.fullname = fullname;
            if(files.photo) {
                
                if(user.photo) {
                    const fileName = user.photo.split("/")[user.photo.split("/").length - 1].split(".")[0];
                    cloudinary.v2.uploader.destroy(fileName);
                }
                cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
                    user.photo = result.secure_url;
                    }).then( () => {
                        user.save( (err, result) => {
                            if(err) {
                                return res.status(400).json( {message: "Error occur. Please try again"} )
                            }
                            return res.status(200).json( {message: `Info updated!`} );
                        })
                    })
            } else {
                user.save( (err, result) => {
                    if(err) {
                        return res.status(400).json( {message: "Error occur. Please try again"} )
                    }
                    return res.status(200).json( {message: `Info updated!`} );
                })
            }
        } else {
            res.status(400).json( {message: "Password do not match"} );
        }
    })
}

module.exports.postUploadImage = (req, res) => {
    let user = req.userPayload;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files) {
        cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
            user.galleries = [...user.galleries, result.secure_url];
            req.imageURL = result.secure_url;
        }).then( () => {
            user.save( (err, result) => {
                if(err) {
                    return res.status(400).json( {message: "Error occur (post upload)"} )
                }
                return res.status(200).json( {message: `Image uploaded`, imageURL: req.imageURL} );
            })
        })
    })
}