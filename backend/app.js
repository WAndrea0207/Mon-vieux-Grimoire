const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book');

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb+srv://will:grimoire@cluster0.in5va.mongodb.net/monvieuxgrimoire?appName=Cluster0',)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
}); 

app.use(express.json());

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Serveur connecté !' });
});

// Route pour récupérer les livres
app.get('/api/books', (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

// GET - Récupérer UN SEUL livre par ID
app.get('/api/books/:id', (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});

//  PUT - Modifier un livre
app.put('/api/books/:id', (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
});

//  DELETE - Supprimer un livre
app.delete('/api/books/:id', (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch(error => res.status(400).json({ error }));
});

// POST - Créer un nouveau livre
app.post('/api/books', (req, res) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;