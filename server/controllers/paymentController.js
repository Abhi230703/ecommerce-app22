const getRazorpayInstance = require("../config/razorpay");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");
const crypto = require("crypto");

const verifyWebhookSignature = (body, signature) => {
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
    return typeof signature === "string" && signature.length === expectedSignature.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

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

const paymentWebhook = async (req, res) => {
    try {
        if (!process.env.RAZORPAY_WEBHOOK_SECRET || !verifyWebhookSignature(req.body, req.get("x-razorpay-signature"))) {
            return res.status(400).json({ message: "Invalid webhook signature" });
        }

        const event = JSON.parse(req.body.toString("utf8"));
        if (event.event !== "payment.captured") return res.sendStatus(200);

        const payment = event.payload?.payment?.entity;
        if (!payment?.order_id || !payment?.id) return res.sendStatus(200);

        await Order.updateOne(
            { "paymentResult.orderId": payment.order_id, isPaid: false },
            { $set: { isPaid: true, paidAt: new Date((payment.created_at || Date.now() / 1000) * 1000), paymentResult: { orderId: payment.order_id, id: payment.id, status: payment.status, update_time: new Date().toISOString(), email_address: payment.email } } }
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: "Webhook processing failed" });
    }
};

module.exports = {createPaymentOrder, paymentWebhook, verifyWebhookSignature};
