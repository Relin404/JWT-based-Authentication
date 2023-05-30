const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token)
    return res.status(401).json({
      status: "failed",
      message: "Unauthenticated",
    });

  let decodedPayload;

  try {
    decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid token",
    });
  }

  try {
    const id = decodedPayload.id;
    // console.log(id);
    const user = await User.findById(id);

    if (!user)
      // DecodedPayload contains the token of a user that no longer exists
      // -> No saved document in the database
      return res.status(404).json({
        status: "failed",
        message: "User no longer exists",
      });

    req.user = user;

    next();
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports = protect;
