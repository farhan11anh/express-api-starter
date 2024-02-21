const mongoose = require('mongoose');
const db = require('../db/db');

const userSchema = new mongoose.Schema({
    user_id: String,
    email: String,
    name: String,
    given_name: String,
    family_name: String,
    nickname: String,
    email_verified: Boolean,
})

userTable=mongoose.model('User',userSchema);
module.exports = userTable;