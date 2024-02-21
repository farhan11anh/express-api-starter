const mongoose = require('mongoose');
const db = require('../db/db');
const router = require('express').Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');



const acc = new mongoose.Schema({
    username: String,
    role: String,
    password: String,
});
accTable=mongoose.model('Account',acc);

passport.use(
    new LocalStrategy(async(username, password, done) => {
        const acc = await accTable.findOne({ username : username })
        if (!acc) {
            return res.status(400).json({ message: 'No user with that username' });
        }
        if (!bcrypt.compareSync(password, acc.password)) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        return done(null, acc);
    })
)

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await accTable.create({
            username,
            password: hashedPassword,
            role,
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
    // console.log(res);
    const token = jwt.sign({ username: req.user.username, role: req.user.role }, process.env.TOKEN_SECRET);
    res.send({token});
})

module.exports = router;

