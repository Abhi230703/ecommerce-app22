const express = require("express");
const router = express.Router();

const {createOrder,
     getMyOrders,
     markAsPaid,
     markAsDelivered,
     getAllOrders,
     getTotalRevenue } = require("../controllers/orderController");
const {protect} = require("../middleware/authMiddleware");
const {admin} = require("../middleware/adminMiddleware");


router.post("/",protect,createOrder);
router.get("/myorders",protect,getMyOrders);
router.put("/:id/pay",protect,markAsPaid);
router.put("/:id/deliver",protect,admin,markAsDelivered);
router.get("/",protect,admin,getAllOrders);
router.get("/revenue",protect,admin,getTotalRevenue);

module.exports = router;
