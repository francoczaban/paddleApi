const express = require('express');
const router = express.Router();
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/playerController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

// Rutas públicas
router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);

// Rutas protegidas
router.post('/', protect, createPlayer);
router.put('/:id', protect, updatePlayer);

// Rutas de admin
router.delete('/:id', protect, adminAuth, deletePlayer);

module.exports = router;
