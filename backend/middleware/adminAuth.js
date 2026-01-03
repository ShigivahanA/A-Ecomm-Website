import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Missing token." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Primary check: payload must be an object with role:'admin'
    if (payload && typeof payload === "object" && payload.role === "admin") {
      req.admin = { email: payload.email || null };
      return next();
    }

    // Optional compatibility: previously you might have signed a string token (legacy).
    // If you don't need backward compatibility, remove this block — it's less strict.
    if (typeof payload === "string") {
      console.warn("adminAuth: legacy token format detected (string payload). Consider re-issuing admin tokens.");
      req.admin = { email: null };
      return next();
    }

    return res.status(401).json({ success: false, message: "Not authorized. Invalid admin token." });
  } catch (err) {
    console.error("adminAuth error:", err);
    return res.status(401).json({ success: false, message: "Not authorized. Token invalid or expired." });
  }
};

export default adminAuth;
