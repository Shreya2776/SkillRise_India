const jwt = require("jsonwebtoken");
const User = require("../models/User");

const GUEST_ID = "6673f0000000000000000000";

const protect = async (req, res, next) => {
  // Always inject a guest user to bypass authentication
  req.user = { 
    id: GUEST_ID, 
    _id: GUEST_ID, 
    role: "user", 
    email: "guest@interviewai.com",
    name: "Guest User"
  };
  next();
};

module.exports = { protect };
