const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const mongoose = require("mongoose");
const { requestContext, securityHeaders } = require("./middleware/requestContext");

const app = express();
app.disable("x-powered-by");
app.use(requestContext);
app.use(securityHeaders);
const allowedOrigins = (process.env.CORS_ORIGINS || (process.env.NODE_ENV === "production" ? "" : "http://localhost:5173"))
  .split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.get("/",(req,res)=>{
    res.send("api is running.....");
});
app.get("/healthz", (_req, res) => res.json({ status: "ok" }));
app.get("/readyz", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "not_ready" });
});

app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/payment",paymentRoutes);

app.use((err,req,res,next) =>{
    const status = err instanceof SyntaxError && "body" in err ? 400 : err.statusCode || 500;
    console.error(JSON.stringify({ level: "error", requestId: req.id, message: err.message, stack: process.env.NODE_ENV === "production" ? undefined : err.stack }));
    res.status(status).json({
        message: status === 500 ? "Internal server error" : err.message,
        requestId: req.id,
    });
});

const PORT = process.env.PORT || 5000;
let server;
const shutdown = async (signal) => {
  console.log(JSON.stringify({ level: "info", message: `${signal} received; shutting down` }));
  server?.close(() => mongoose.connection.close(false).finally(() => process.exit(0)));
  setTimeout(() => process.exit(1), 10000).unref();
};

const start = async () => {
  await connectDB();
  server = app.listen(PORT, () => console.log(JSON.stringify({ level: "info", message: `Server listening on ${PORT}` })));
  ["SIGTERM", "SIGINT"].forEach((signal) => process.once(signal, () => shutdown(signal)));
};

start().catch((error) => {
  console.error(JSON.stringify({ level: "fatal", message: error.message }));
  process.exit(1);
});
