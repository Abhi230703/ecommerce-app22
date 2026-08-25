const mongoose = require("mongoose");

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

paymentResult: {
  orderId: { type: String },
  id: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String },
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

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ isPaid: 1, createdAt: -1 });

module.exports = mongoose.model("Order",orderSchema);