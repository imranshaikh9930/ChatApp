const express = require("express");
const router = express.Router();
const {signup, login, logout,updateProfile} = require("../controllers/auth.control")
const protectRoute = require("../middleware/auth.middleware");
const arcjetProtection = require("../middleware/arcjet.middleware");


router.use(arcjetProtection)


router.post("/signup",signup)
router.post("/login",login);
router.post("/logout",logout);
router.put("/update-profile",protectRoute,updateProfile)
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));


module.exports = router;