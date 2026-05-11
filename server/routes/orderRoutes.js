const express = require("express");
const router = express.Router();

const {createOrder,
     getMyOrders,
     markAsPaid,
     markAsDelivered,
     getAllOrders,
     getTotalRevenue,
     getOrderById } = require("../controllers/orderController");
const {protect} = require("../middleware/authMiddleware");
const {admin} = require("../middleware/adminMiddleware");


router.post("/",protect,createOrder);
router.get("/myorders",protect,getMyOrders);
router.get("/revenue",protect,admin,getTotalRevenue);

router.get("/",protect,admin,getAllOrders);
router.get("/:id", protect, getOrderById); 
router.put("/:id/pay",protect,admin,markAsPaid);
router.put("/:id/deliver",protect,admin,markAsDelivered);


module.exports = router;
