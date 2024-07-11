const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const requireAuth = async (req, res, next) => {
  const { token } = req.headers;
  console.log("authenticating user");
  if (!token) {
    return res.status(401).json({ error: "Auth token required" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Request is not authorisied" });
  }
};

module.exports = requireAuth;
