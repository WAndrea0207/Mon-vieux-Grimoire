const express = require('express');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/bookRoute');
const userRoutes = require('./routes/userRoute');

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

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;