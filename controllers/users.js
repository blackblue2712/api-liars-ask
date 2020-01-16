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
    req.userPayload.hashed_password = undefined;
    req.userPayload.salt = undefined;
    return res.status(200).json(req.userPayload)
}

module.exports.getInfoLoggedUser = (req, res) => {
    if(req.payload._id == req.userPayload._id) {
        req.userPayload.hashed_password = undefined;
        req.userPayload.salt = undefined;
        return res.json( req.userPayload )
    } else {
        return res.status(404).json( {message: 404} );
    }
}

module.exports.requrestRelatedUserId = async (req, res, next, id) => {
    try {
        await User.findById(id, (err, user) => {
            if(err || !user) {
                console.log("reject")
                return res.status(404).json( {message: "404"} );
            } else {
                req.userPayload = user;
                next();
            }
        });
    } catch (err) {
        return res.status(404).json( {message: "404"} );
    }
}

module.exports.updateStoryUser = (req, res) => {
    let user = req.userPayload;
    console.log(req.body)
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
        if(files.photo) {
            cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
                user.galleries = [result.secure_url, ...user.galleries];
                req.imageURL = result.secure_url;
            }).then( () => {
                user.save( (err, result) => {
                    if(err) {
                        return res.status(400).json( {message: "Error occur (post upload)"} )
                    }
                    return res.status(200).json( {message: `Image uploaded`, imageURL: req.imageURL} );
                })
            })
        } else {
            return res.status(400).json( {message: "No file choose"} )
        }
    })
}

module.exports.getUploadImages = (req, res) => {
    return res.json( {images: req.userPayload.galleries} );
}

module.exports.putDeleteUploadedImage = async (req, res) => {
    let {img, photoName} = req.body;
    let user = req.userPayload;
    await cloudinary.v2.uploader.destroy(photoName);
    user.galleries = user.galleries.filter( imgURL => imgURL !== img);
    await user.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur (delete uploaded photo)"} );
        return res.status(200).json( {message: "Photo deleted"} );
    });
}


module.exports.followUser = (req, res) => {
    let { followingId } = req.body;
    let followedUser = req.userPayload;
    User.findById(followingId, (err, followingUser) => {
        if(err) return res.status(400).json( {message: "Error occur (follow user)"} );
        // Check followed or not
        if(followedUser.followers.indexOf(followingId) === -1) {
            followingUser.following.push(followedUser._id);
            followingUser.save();
            followedUser.followers.push(followingId);
            followedUser.save();
            return res.status(200).json( {message: `Following ${followedUser.fullname}`} );
        } else {
            console.log(followedUser._id, followingUser.following);
            followingUser.following = followingUser.following.filter(fl => fl != String(followedUser._id));
            followingUser.save();
            followedUser.followers = followedUser.followers.filter(fl => fl != String(followingId));
            followedUser.save();
            return res.status(200).json( {message: `UnFollow ${followedUser.fullname}`} );
        }
    })
}