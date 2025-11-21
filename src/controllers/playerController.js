const Player = require('../models/Player');

// @desc    Obtener todos los jugadores
// @route   GET /api/players
// @access  Public
const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener jugadores',
      error: error.message 
    });
  }
};

// @desc    Obtener un jugador por ID
// @route   GET /api/players/:id
// @access  Public
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    
    if (!player) {
      return res.status(404).json({ 
        success: false,
        message: 'Jugador no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Error al obtener jugador:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener jugador',
      error: error.message 
    });
  }
};

// @desc    Crear un jugador
// @route   POST /api/players
// @access  Private
const createPlayer = async (req, res) => {
  try {
    const { firstName, lastName, age, nationality, imageUrl } = req.body;

    console.log(firstName, lastName, age,     nationality, imageUrl);
    
    // Validar datos requeridos
    if (!firstName || !lastName || !age || !nationality) {
      return res.status(400).json({ 
        success: false,
        message: 'Por favor proporciona todos los campos requeridos' 
      });
    }
    
    const player = await Player.create({
      firstName,
      lastName,
      age,
      nationality,
      imageUrl
    });
    
    res.status(201).json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Error al crear jugador:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear jugador',
      error: error.message 
    });
  }
};

// @desc    Actualizar un jugador
// @route   PUT /api/players/:id
// @access  Private
const updatePlayer = async (req, res) => {
  try {
    const { firstName, lastName, age, nationality, imageUrl } = req.body;
    
    let player = await Player.findById(req.params.id);
    
    if (!player) {
      return res.status(404).json({ 
        success: false,
        message: 'Jugador no encontrado' 
      });
    }
    
    player = await Player.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, age, nationality, imageUrl },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Error al actualizar jugador:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar jugador',
      error: error.message 
    });
  }
};

// @desc    Eliminar un jugador
// @route   DELETE /api/players/:id
// @access  Private/Admin
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    
    if (!player) {
      return res.status(404).json({ 
        success: false,
        message: 'Jugador no encontrado' 
      });
    }
    
    await Player.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Jugador eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar jugador',
      error: error.message 
    });
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};
