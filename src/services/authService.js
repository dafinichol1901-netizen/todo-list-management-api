const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { config } = require('../config/env');

function createAccessToken(user) {
  return jwt.sign(
    { sub: user.id }, 
    config.jwtSecret, 
    { expiresIn: config.jwtExpiresIn }
  );
}

function buildAuthResponse(user) {
  return {
    user,
    accessToken: createAccessToken(user),
    tokenType: 'Bearer',
    expiresIn: config.jwtExpiresIn,
  };
}

async function register({ name, email, password }) {
  const user = await User.create({ name, email, password, role: 'user' });
  return buildAuthResponse(user);
}

async function login({ email, password }) {
  const user = await User.findOne({ email, archived: false }).select('+password');
  const passwordMatches = user ? await user.comparePassword(password) : false;

  if (!passwordMatches) {
    throw new AppError('Email atau password salah.', 401, 'INVALID_CREDENTIALS');
  }

  return buildAuthResponse(user);
}

module.exports = { register, login, createAccessToken };
