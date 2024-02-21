const express = require('express');
const jwt = require('jsonwebtoken');

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

// Middleware for token verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({
    message: 'Unauthorized, please provide a token.'
  }); // if there isn't any token

  jwt.verify(token,process.env.TOKEN_SECRET , (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
};

module.exports = {
  notFound,
  errorHandler,
  authenticateToken
};
