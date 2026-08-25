const getRazorpayInstance = require("../config/razorpay");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");

const createPaymentOrder = async(req,res)=>{

    try {
        const { orderId } = req.body;
        if (!mongoose.isObjectIdOrHexString(orderId)) return res.status(400).json({ message: "A valid order ID is required" });

        const order = await Order.findOne({ _id: orderId, user: req.user._id });
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.isPaid) return res.status(400).json({ message: "Order is already paid" });

        const razorpay = getRazorpayInstance(); 

        const options = {
            amount:Math.round(order.totalPrice * 100),
            currency:"INR",
            receipt:`order_${order._id}`,
        }

        const paymentOrder = await razorpay.orders.create(options);
        order.paymentResult = { orderId: paymentOrder.id, status: "created" };
        await order.save();
        res.json(paymentOrder);
 
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
        
    };
    
};

module.exports = {createPaymentOrder};