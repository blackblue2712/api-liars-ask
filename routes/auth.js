const router = require("express").Router();
const {
    postSignup
} = require("../controllers/auth");

const {
    handlePassword,
} = require("../middlewares/userHandleError");

const { check } = require("express-validator");

router.post("/signup", [
        check('email').isEmail().withMessage("Email not vaild"),
        check('password').isLength({ min: 6 }).withMessage("Password must have at least 6 characters"),
        check('password').matches(/\d/).withMessage("Password must have at least 1 number")
    ]
, handlePassword, postSignup);

module.exports = router;