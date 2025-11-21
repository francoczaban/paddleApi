const express = require('express');
const router = express.Router();
const {
  getAllMatches,
  getMatchById,
  getMatchesByPlayer,
  createMatch,
  updateMatch,
  deleteMatch
} = require('../controllers/matchController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

// Rutas públicas
router.get('/', getAllMatches);
router.get('/:id', getMatchById);
router.get('/player/:playerId', getMatchesByPlayer);

// Rutas protegidas
router.post('/', protect, createMatch);
router.put('/:id', protect, updateMatch);

// Rutas de admin
router.delete('/:id', protect, adminAuth, deleteMatch);

module.exports = router;
