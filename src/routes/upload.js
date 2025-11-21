const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/players/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'player-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: fileFilter
});

// @desc    Subir imagen de jugador
// @route   POST /api/upload/player-image
// @access  Private
router.post('/player-image', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No se proporcionó ninguna imagen' 
      });
    }

    // Construir URL de la imagen
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/players/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        filename: req.file.filename,
        imageUrl: imageUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al subir imagen',
      error: error.message 
    });
  }
});

// Middleware de manejo de errores para multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB'
      });
    }
  }
  
  res.status(400).json({
    success: false,
    message: error.message
  });
});

module.exports = router;
