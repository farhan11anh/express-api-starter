const mongoose = require('mongoose');
const db = require('../db/db');
const router = require('express').Router();
const {bookTable, detailsBookTable} = require('../model/Books');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    try {
        const book = await bookTable.find()
            .sort({ _id: 1 })
            .limit(limit)
            .skip(skipIndex)
            .exec();
        res.json(
            {
                message: 'Data fetched successfully',
                data: book,
                pagination: {
                    page: page,
                    limit: limit
                }
            }
        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
router.get('/detail', async (req, res) => {
    try {
        const id = req.query.id;
        const book = await detailsBookTable.findOne({book: id});
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
})
router.post('/add',[
    body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('description').isLength({ min: 3 }).withMessage('Description must be at least 3 characters long'),
    body('author').isLength({ min: 3 }).withMessage('Author must be at least 3 characters long')
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ 
            message: 'Validation error',
            errors: error.array()
         });
    }
    const { title, price, description, author } = req.body;
    try {
        const book = await bookTable.create({
            title,
            price,
        });
        const detailsBook = await detailsBookTable.create({
            description,
            author,
            book: book._id
        });
        res.status(200).json(
            {
                message: 'Data added successfully',
                data: {
                    book,
                    detailsBook
                }
            }
        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
router.put('/update', async (req, res) => {
    const { id, title, price, description, author } = req.body;
    const dataBook = {title, price}
    const dataDetailsBook = {description, author}
    try {
        const book = await bookTable.findByIdAndUpdate(id, dataBook, {new: true});
        const detailsBook = await detailsBookTable.findOneAndUpdate({book:id}, dataDetailsBook, {new: true});
        res.status(200).json({
            message: 'Data updated successfully',
            data: {
                book,
                detailsBook
            }
        });
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
})
router.delete('/delete', async (req, res) => {
    const id = req.query.id;
    try {
        const book = await bookTable.findByIdAndDelete(id);
        const detailsBook = await detailsBookTable.findOneAndDelete({book: id});
        res.status(200).json({
            message: 'Data deleted successfully',
            data: {
                book,
                detailsBook
            }
        });
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;