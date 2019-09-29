const express = require("express");
const router = express.Router();

const {
    getUsers
} = require("../controllers/users");

router.get("/", (req, res) => {
    res.send( {message: "user controllers"} );
});

router.get("/get", getUsers);

module.exports = router;