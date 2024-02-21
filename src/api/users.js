const express = require('express');
const router = express.Router();
const Model = require('../model/users');
const { v4: uuidv4 } = require('uuid');
const Users = Model;
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middlewares');

router.post('/', async (req, res) => {
  console.log(req.body);
  const given_name = req?.body?.given_name;

  const searchLike = new RegExp(given_name, 'i');
  try {
    const data = await Users.find({
      given_name: searchLike
    });
    res.json({
      message: 'Data fetched successfully',
      data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/all', authenticateToken, async (req, res) => {
  try {
    const data = await Users.find();
    res.json({
      message: 'Data fetched successfully',
      data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.post('/create',[
  body('given_name').isLength({ min: 3 }).withMessage('Given name must be at least 3 characters long'),
  body('family_name').isLength({ min: 3 }).withMessage('Family name must be at least 3 characters long'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('nickname').isLength({ min: 3 }).withMessage('Nickname must be at least 3 characters long'),
  body('email_verified').isBoolean().withMessage('Email verified must be a boolean')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  console.log(req.body);
  const { given_name, family_name, email, nickname, email_verified } = req.body;
  const user_id = uuidv4(); // Generate a unique user_id

  try {
    const data = await Users.create({
      user_id,
      given_name,
      family_name,
      email,
      nickname,
      email_verified
    });
    res.json({
      message: 'Data created successfully',
      data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

