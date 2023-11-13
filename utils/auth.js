const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyUser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};
const checkUserExistence = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send('User not found');
  next();
};
module.exports = { verifyUser, checkUserExistence };
