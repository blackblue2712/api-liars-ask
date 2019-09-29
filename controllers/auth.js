const User = require("../models/users");

module.exports.postSignup = (req, res) => {
    const { email, password } = req.body;
    User.findOne( { email }, (err, user) => {
        if(err || user) {
            res.status(400).json( {message: `User with that email was exist`} );
        } else {
            let user = new User();
            user.email = email;
            user.password = password;
            user.save( (err, obj) => {
                if(err) {
                    return res.status(400).json( {message: `Error occur when create user, please try again`} );
                }
                user.salt = undefined;
                user.hashed_password = undefined;
                return res.status(200).json( {message: 'Congratulation! Signup sucessfully', payload: user} )
            })
        }
    })
}

module.exports.postSignin = (req, res) => {
    const { email, password } = req.body;
    User.findOne( { email }, (err, user) => {
        if(err || !user) {
            return res.status(400).json( {message: "User with that email is not exist"} )
        } else {
            if(user.authenticate(password)) {
                return res.status(200).json( {message: "Signin successfully"} );
            } else {
                return res.status(400).json( {message: "Password do not match"} )
            }
        }
    })
}