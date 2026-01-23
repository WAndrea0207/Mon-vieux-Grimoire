const Book = require('../models/book');

// GET - Récupérer tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// GET - Récupérer UN livre par ID
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// POST - Créer un livre
exports.createBook = (req, res) => {
  // Récupère les données du livre envoyées en form-data (c'est une string)
  const bookObject = JSON.parse(req.body.book);
  
  // Ne pas faire confiance aux données du client
  delete bookObject._id;
  delete bookObject.userId;
  
  // Crée le livre avec les vraies données
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,  // ← Le vrai userId du token
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // ← URL complète de l'image
  });
  
  book.save()
    .then(() => res.status(201).json({ message: 'Livre créé !' }))
    .catch(error => res.status(400).json({ error }));
};

// PUT - Modifier un livre
exports.updateBook = (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

// DELETE - Supprimer un livre
exports.deleteBook = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};