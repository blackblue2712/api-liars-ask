const express = require("express");
const router = express.Router();

const {
    postSignup,
    getUsers
} = require("../controllers/users");

router.get("/", (req, res) => {
    res.send( {message: "user controllers"} );
});

router.get("/get", getUsers);
router.post("/signup", postSignup);

module.exports = router;