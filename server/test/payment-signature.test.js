const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");

process.env.RAZORPAY_KEY_SECRET = "test-secret";
const { verifyPaymentSignature } = require("../controllers/orderController");

test("accepts only the Razorpay signature for the payment", () => {
  const signature = crypto.createHmac("sha256", "test-secret").update("order_1|payment_1").digest("hex");
  assert.equal(verifyPaymentSignature("order_1", "payment_1", signature), true);
  assert.equal(verifyPaymentSignature("order_1", "payment_2", signature), false);
});
