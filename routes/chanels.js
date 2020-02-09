const router = require("express").Router();

const {
    getChanels,
    getSingleChanel,
    postCreateChanelServer,
    postSaveChanelMessage
} = require("../controllers/chanels");

const  { requireSignin, isAdmin } = require("../controllers/auth");

router.get("/", getChanels);
router.get("/:cid", getSingleChanel);
router.post("/create", requireSignin, isAdmin, postCreateChanelServer);

router.post("/new-message", requireSignin, postSaveChanelMessage);

module.exports = router;