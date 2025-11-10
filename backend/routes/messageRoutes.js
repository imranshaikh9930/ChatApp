
const express = require("express");
const arcjetProtection = require("../middleware/arcjet.middleware");
const protectRoute = require("../middleware/auth.middleware");
const { getAllContact, getMessageByUserId, sendMessage, getChatPartners } = require("../controllers/message.control");

const router = express.Router();


router.use(arcjetProtection,protectRoute);

router.get("/contacts",getAllContact);
router.get("/chats",getChatPartners);
router.get("/:id",getMessageByUserId);
router.post("/send/:id",sendMessage);


module.exports = router;