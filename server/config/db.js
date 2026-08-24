const mongoose = require("mongoose");

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
            minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE) || 2,
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB Connected");
        
    } catch (error) {
        console.error(error);
        process.exit(1);
        
    }
};

module.exports = connectDB;