// middlewares/checkSecretKey.js
const crypto = require("crypto");

module.exports = function (req, res, next) {
    const receivedSignature = req.headers["x-secret-key"];

    if (!receivedSignature) {
        return res.status(401).json({ message: "No signature provided" });
    }

    // Create expected signature using backend secret
    const expectedSignature = crypto
        .createHmac("sha256", process.env.MY_SECRET_KEY)
        .update(process.env.SIGNATURE_PHRASE)
        .digest("hex");

    if (receivedSignature !== expectedSignature) {
        return res.status(401).json({ message: "Invalid signature" });
    }

    next();
};
