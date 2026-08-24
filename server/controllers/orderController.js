const Order = require("../models/orderModel");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const createOrder =  async(req,res) =>{
    try {
        const { orderItems } = req.body;

        if(!Array.isArray(orderItems) || orderItems.length === 0 || orderItems.length > 100){
            return res.status(400).json({message:"Order must contain 1 to 100 items"});
        }

        if (orderItems.some(({ product, qty }) => !mongoose.isObjectIdOrHexString(product) || !Number.isInteger(qty) || qty < 1 || qty > 100)) {
            return res.status(400).json({message:"Each order item needs a product and quantity from 1 to 100"});
        }

        const products = await Product.find({ _id: { $in: orderItems.map(({ product }) => product) } }).select("name price image");
        if (products.length !== orderItems.length) return res.status(400).json({message:"One or more products do not exist"});

        const byId = new Map(products.map((product) => [String(product._id), product]));
        const verifiedItems = orderItems.map(({ product, qty }) => {
            const item = byId.get(String(product));
            return { product: item._id, name: item.name, qty, image: item.image, price: item.price };
        });
        const totalPrice = verifiedItems.reduce((total, item) => total + item.price * item.qty, 0);

        const order = new Order({
            user:req.user._id,
            orderItems: verifiedItems,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

const getMyOrders = async(req,res) =>{
    const orders = await Order.find({user:req.user._id});
    res.json(orders);
};

const getOrderById = async(req,res)=>{
    try {
    const order = await Order.findById(req.params.id);
    if(!order) return res.status(404).json({message:"Order not Found"});
    if (req.user.role !== "admin" && String(order.user) !== String(req.user._id)) return res.status(403).json({message:"Not authorized to access this order"});
    res.json(order);
    
    } catch (error) {
    res.status(500).json({message:error.message})    
    }
}

const markAsPaid = async(req,res) =>{
    try {
        const order = await Order.findById(req.params.id);

        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        if (String(order.user) !== String(req.user._id)) return res.status(403).json({message:"Not authorized to pay for this order"});

         order.isPaid = true;
         order.paidAt = Date.now();

         order.paymentResult = {
  id: req.body.razorpayPaymentId,
  status: "completed",
  update_time: new Date().toISOString(),
  email_address: req.user.email,
};
         
         const updatedOrder = await order.save();
         res.json(updatedOrder);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

const markAsDelivered = async(req,res) =>{
    try {
        const order = await Order.findById(req.params.id);

        if(!order){
            return res.status(404).json({message:"Order not found"});
        }

         order.isDelivered = true;
         order.deliveredAt = Date.now();
         
         const updatedOrder = await order.save();
         res.json(updatedOrder);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

const getAllOrders = async(req,res) =>{
    try {
        const orders = await Order.find({}).populate("user","name email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({message:error.message});

    }
};

const getTotalRevenue = async(req,res) =>{
    try {
        const orders = await Order.find({isPaid:true});

        const totalRevenue = orders.reduce((acc,order)=> acc+order.totalPrice,0);
        res.json({totalRevenue});
    } catch (error) {
        res.status(500).json({message:error.message});

    }
}


module.exports = { createOrder, getMyOrders,markAsPaid,markAsDelivered,getAllOrders,getTotalRevenue,getOrderById};