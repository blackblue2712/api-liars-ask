const router = require("express").Router();
const { priveateChat } = require("../controllers/private-chat") 

router.get("/private-chat", priveateChat);

module.exports = router;