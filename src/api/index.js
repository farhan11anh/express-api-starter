const express = require('express');
const emojis = require('./emojis');
const users = require('./users');
const book = require('./book');
const auth = require('./auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.get('/hello', (req, res) => {
  res.json({
    message: 'Hello, World!',
  });
});

// router.get('/AllUser', (req, res) => {
//   res.json({
//     message: 'Hai, World!',
//   });
// });

router.post('/hai', (req, res) => {
  const { a, b } = req.body;
  res.json({
    message: `Hello, ${a}!`,
    data : {
              full : req.body,
              name : a,
              class : b
            }
  });
});

router.use('/emojis', emojis);
router.use('/users', users);
router.use('/auth', auth);
router.use('/book', book);

module.exports = router;
