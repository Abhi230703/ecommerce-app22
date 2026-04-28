const Order = require("../models/orderModel");

const createOrder =  async(req,res) =>{
    try {
        const { orderItems, totalPrice} = req.body;

        if(orderItems === 0){
            res.status(400).json({message:"No order items"});
        }

        const order = new Order({
            user:req.user._id,
            orderItems,
            totalPrice,
        });

        const createOrder = await order.save();
        res.status(201).json(createOrder);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

const getMyOrders = async(req,res) =>{
    const orders = await Order.find({user:req.user._id});
    res.json(orders);
};

const markAsPaid = async(req,res) =>{
    try {
        const order = await Order.findById(req.params.id);

        if(!order){
            return res.status(404).json({message:"Order not found"});
        }

         order.isPaid = true;
         order.paidAt = Date.now();
         
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


module.exports = { createOrder, getMyOrders,markAsPaid,markAsDelivered,getAllOrders,getTotalRevenue};