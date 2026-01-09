const express = require('express');

const app = express();

// Active les requêtes depuis le frontend React
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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

module.exports = app;