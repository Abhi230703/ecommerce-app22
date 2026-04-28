const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cors = require("cors");

connectDB();

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true
}))

app.use(express.json());
app.get("/",(req,res)=>{
    res.send("api is running.....");
});

app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/orders",orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`Server is running on port ${PORT}`));

app.use((err,req,res,next) =>{
    res.status(500).json({
        message:err.message,
        stack:process.env.NODE_ENV === "Production" ? null :err.stack
    })
});
