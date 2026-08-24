const { randomUUID } = require("crypto");

const requestContext = (req, res, next) => {
  const startedAt = Date.now();
  req.id = /^[a-zA-Z0-9-]{1,128}$/.test(req.get("x-request-id") || "")
    ? req.get("x-request-id")
    : randomUUID();
  res.setHeader("x-request-id", req.id);

  res.on("finish", () => {
    console.log(JSON.stringify({ level: "info", requestId: req.id, method: req.method, path: req.path, status: res.statusCode, durationMs: Date.now() - startedAt }));
  });
  next();
};

const securityHeaders = (_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  if (process.env.NODE_ENV === "production") res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
};

module.exports = { requestContext, securityHeaders };
