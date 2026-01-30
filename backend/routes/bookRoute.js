const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');

const bookController = require('../controllers/bookController');

// Routes CRUD
router.get('/', bookController.getAllBooks);
router.get('/bestrating', bookController.getBestRatedBooks);  // AVANT /:id !
router.get('/:id', bookController.getOneBook);
router.post('/', auth, multer, bookController.createBook);
router.put('/:id', auth, multer, bookController.updateBook);  
router.delete('/:id', auth, bookController.deleteBook);
router.post('/:id/rating', auth, bookController.rateBook);  // Route de notation

module.exports = router;
