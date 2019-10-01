const express = require("express");
const router = express.Router();

const {
    getUsers,
    requrestRelatedUserId,
    updateStoryUser,
    updateInfoUser,
    getInfoLoggedUser
} = require("../controllers/users");

const { requireSignin } = require("../controllers/auth");

router.get("/", (req, res) => {
    res.send( {message: "user controllers"} );
});

router.get("/:userId", requireSignin, getInfoLoggedUser);
router.put("/story/:userId", updateStoryUser);
router.put("/info/:userId", updateInfoUser);

router.param("userId", requrestRelatedUserId);
module.exports = router;