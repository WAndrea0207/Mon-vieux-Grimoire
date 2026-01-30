const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Stockage en mémoire pour traitement avec Sharp
const storage = multer.memoryStorage();

const upload = multer({ storage }).single('image');

// Middleware pour optimiser l'image avec Sharp
const optimizeImage = (req, res, next) => {
  // Si pas de fichier, on passe au middleware suivant
  if (!req.file) {
    return next();
  }

  // Génération du nom de fichier 
  const name = req.file.originalname.split(' ').join('_');
  const extension = MIME_TYPES[req.file.mimetype];
  const filename = name.replace(/\.[^/.]+$/, '') + Date.now() + '.' + extension;
  const filepath = path.join('images', filename);

  // Optimisation avec Sharp
  sharp(req.file.buffer)
    .resize({ width: 463, height: 595, fit: 'cover' })  // Redimensionne au format livre
    .jpeg({ quality: 80 })  // Compresse en JPEG qualité 80%
    .toFile(filepath)
    .then(() => {
      // Ajoute le filename à req.file pour que le controller puisse l'utiliser
      req.file.filename = filename;
      next();
    })
    .catch(error => {
      console.error('Erreur Sharp:', error);
      res.status(500).json({ error });
    });
};

// Export du middleware combiné : upload + optimisation
module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    optimizeImage(req, res, next);
  });
};