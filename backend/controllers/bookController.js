const fs = require('fs');
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
  // Vérifier que l'image existe
  if (!req.file) {
    return res.status(400).json({ error: 'Aucune image fournie' });
  }

  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  
  // Vérifier que tous les champs obligatoires sont remplis
  if (!bookObject.title || !bookObject.author || !bookObject.genre || !bookObject.year) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }
  
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  
  book.save()
    .then(() => res.status(201).json({ message: 'Livre créé !' }))
    .catch(error => res.status(400).json({ error }));
};

// PUT - Modifier un livre
exports.updateBook = (req, res) => {
  // Regarde s'il y a une nouvelle image ou pas
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  
  // Ne pas faire confiance au userId du client
  delete bookObject._id;
  delete bookObject.userId;
  
  // Vérifie que c'est bien le propriétaire du livre
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(403).json({ message: 'Non autorisé' });
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre modifié !' }))
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// DELETE - Supprimer un livre
exports.deleteBook = (req, res) => {
  // Étape 1 : Récupère le livre
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Étape 2 : Vérifie que c'est le propriétaire
      if (book.userId !== req.auth.userId) {
        res.status(403).json({ message: 'Non autorisé' });
      } else {
        // Étape 3 : Extrait le nom du fichier de l'URL
        // Exemple : http://localhost:4000/images/book123.jpg
        // → Récupère : book123.jpg
        const filename = book.imageUrl.split('/images/')[1];
        
        // Étape 4 : Supprime le fichier du serveur
        fs.unlink(`images/${filename}`, () => {
          // Étape 5 : Une fois l'image supprimée, supprime le livre de MongoDB
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
            .catch(error => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// POST - Noter un livre

// Étape 1 : Récupérer userId et rating du body
exports.rateBook = (req, res) => {
  const { rating } = req.body;
  const userId = req.auth.userId; 
  
  // Étape 2 : Vérifier que la note est entre 0 et 5
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'La note doit être entre 0 et 5' });
  }
  
  // Étape 3 : Récupérer le livre
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Étape 4 : Vérifier que l'utilisateur n'a pas déjà noté ce livre
      const userAlreadyRated = book.ratings.find(r => r.userId === userId);
      if (userAlreadyRated) {
        return res.status(400).json({ error: 'Vous avez déjà noté ce livre' });
      }
      
      // Étape 5 : Ajouter la nouvelle note au tableau ratings
      book.ratings.push({ userId, grade: rating });
      
      // Étape 6 : Calculer la nouvelle moyenne
      const totalRating = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = totalRating / book.ratings.length;
      
      // Étape 7 : Sauvegarder et retourner le livre mis à jour
      book.save()
        .then(() => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
};

// GET - Récupérer les 3 meilleurs livres
exports.getBestRatedBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })  // Trie par note décroissante
    .limit(3)                      // Limite à 3 livres
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};