const mongoose = require('mongoose');
const db = require('../db/db');

const bookSchema = new mongoose.Schema({
    title: String,
    price: String
})

const detailsBookSchema = new mongoose.Schema({
    description: String,
    author: String,
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
})

const bookTable=mongoose.model('Book',bookSchema);
const detailsBookTable=mongoose.model('DetailsBook',detailsBookSchema);

module.exports = {bookTable,detailsBookTable}