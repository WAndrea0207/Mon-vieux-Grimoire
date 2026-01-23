const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');

const bookController = require('../controllers/bookController');

// Routes CRUD
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getOneBook);
router.post('/', auth, multer, bookController.createBook);
router.put('/:id', auth, multer, bookController.updateBook);  
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
