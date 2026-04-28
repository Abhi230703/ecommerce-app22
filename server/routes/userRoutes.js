const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/userController");
const {protect}  = require("../middleware/authMiddleware");
const {getAllUser} = require("../controllers/userController");
const {admin} = require("../middleware/adminMiddleware");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",protect,(req,res) =>{    res.json(req.user);  });
router.get("/",protect,admin,getAllUser);

module.exports = router;