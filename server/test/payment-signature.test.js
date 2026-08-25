const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");

process.env.RAZORPAY_KEY_SECRET = "test-secret";
process.env.RAZORPAY_WEBHOOK_SECRET = "webhook-secret";
const { verifyPaymentSignature } = require("../controllers/orderController");
const { verifyWebhookSignature } = require("../controllers/paymentController");
const { parsePrice } = require("../controllers/productController");

test("accepts only the Razorpay signature for the payment", () => {
  const signature = crypto.createHmac("sha256", "test-secret").update("order_1|payment_1").digest("hex");
  assert.equal(verifyPaymentSignature("order_1", "payment_1", signature), true);
  assert.equal(verifyPaymentSignature("order_1", "payment_2", signature), false);
});

test("accepts only the signed webhook payload", () => {
  const body = Buffer.from('{"event":"payment.captured"}');
  const signature = crypto.createHmac("sha256", "webhook-secret").update(body).digest("hex");
  assert.equal(verifyWebhookSignature(body, signature), true);
  assert.equal(verifyWebhookSignature(Buffer.from('{"event":"payment.failed"}'), signature), false);
});

test("rejects invalid product prices", () => {
  assert.equal(parsePrice(0), 0);
  assert.equal(parsePrice("19.99"), 19.99);
  assert.equal(parsePrice(-1), null);
  assert.equal(parsePrice(""), null);
});
