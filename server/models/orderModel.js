const mongoose = require("mongoose");
const { image } = require("../config/cloudinary");
const Product = require("./Product");

const orderSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    orderItems:[{
        name:String,
        qty:Number,
        image:String,
        price:Number,
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
    },
],

totalPrice:{
    type:Number,
    required:true,
},

isPaid:{
    type:Boolean,
    default:false,
},

paidAt:{
    type:Date,
},

isDelivered:{
type:Boolean,
default:false
},

deliveredAt:{
    type:Date
}
},
{
    timestamps:true,
}
);

module.exports = mongoose.model("Order",orderSchema);