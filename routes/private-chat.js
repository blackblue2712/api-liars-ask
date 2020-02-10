const router = require("express").Router();
const {
    priveateChat,
    postSavePrivateMessage,
    getMessageIndividualUser
} = require("../controllers/private-chat");
const  { requireSignin } = require("../controllers/auth");

router.get("/", priveateChat);
router.get("/messages", requireSignin, getMessageIndividualUser);
router.post("/new-message", requireSignin, postSavePrivateMessage);

module.exports = router;