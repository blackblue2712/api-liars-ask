const mongoose = require("mongoose");
const crypto = require("crypto");

const Schema = mongoose.Schema;
const ObjectId =  Schema.Types.ObjectId;

const userSchema = new Schema ({
    username: String,
    email: String,
    fullname: String,
    hashed_password: String,
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    modified: Date,
    photo: String,
    registerIP: String,
    status: {
        type: Boolean,
        default: true
    },
    activeLink: String,
    bio: String,
    quotes: String
});

userSchema.virtual("password") // password is the name of the input pass to server
    .set( function(pw) { // pw is the value of password above
        this._pw = pw;
        this.salt = Math.random().toString(36).slice(-8);
        this.hashed_password = this.encryptPassword(pw);
    })
    .get( function() {
        return this._pw;
    });

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function (pw) {
        try {
            return crypto.createHmac("sha256", this.salt)
                .update(pw)
                .digest("hex")
        } catch (err) {
            return "Error hashed password"
        }
    }
}

const users = mongoose.model("users", userSchema);
module.exports = users;