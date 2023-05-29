const jwt = require("jsonwebtoken");

const User = require("../models/user");

const createJwtToken = (id) => {
  const jwtPrivateKey = process.env.JWT_SECRET;
  //   const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign({ id }, jwtPrivateKey);
};

const createSendToken = (user, statusCode, res) => {
  const token = createJwtToken(user.id);
  user.password = undefined;

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signup = async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).json({
        status: "failed",
        message: "User with this email already exists",
      });
    }

    const user = await User.create(req.body);

    createSendToken(user, 201, res);
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate({
      path: "invitations",
      select: "name",
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid password",
      });
    }

    createSendToken(user, 201, res);
  } catch (err) {
    res.status(400).json({
      status: "failed",
      error: err.message,
    });
  }
};

module.exports = { login, signup };
