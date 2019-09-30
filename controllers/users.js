const User = require("../models/users");

module.exports.getUsers = (req, res) => {
    console.log("getUsers controller called");
}

module.exports.getSingleUser = (req, res) => {
    console.log("getUsers controller called");
}

module.exports.postInfoLoggedUser = (req, res) => {
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
    console.log(req.payload)
    let user = req.userPayload;
    let { ffullname, currentPassword } = req.body;
    
    if(user.authenticate(currentPassword)) {
        user.fullname = ffullname;
        user.save( (err, result) => {
            if(err) return res.status(400).json( {message: "Error occur when update story user, please try again"} );
            return res.status(200).json( {message: "Info updated"} );
        });
    } else {
        res.status(400).json( {message: "Password do not match"} );
    }
}