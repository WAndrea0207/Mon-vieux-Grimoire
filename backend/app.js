const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb+srv://will:grimoire@cluster0.in5va.mongodb.net/monvieuxgrimoire?appName=Cluster0',)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Active les requêtes depuis le frontend React
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
  res.json({ books: [] });
});

// Route pour créer un livre
app.post('/api/books', (req, res) => {
  console.log('Nouveau livre reçu :', req.body);
  res.status(201).json({
    message: 'Livre créé avec succès !',
    book: req.body,
  });
});

module.exports = app;