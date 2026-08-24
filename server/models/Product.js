const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        default:null
    },
},{timestamps:true});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product",productSchema);