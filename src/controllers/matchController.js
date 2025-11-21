const Match = require('../models/Match');
const Player = require('../models/Player');

// @desc    Obtener todos los partidos
// @route   GET /api/matches
// @access  Public
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('team1Players', 'firstName lastName imageUrl')
      .populate('team2Players', 'firstName lastName imageUrl')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    console.error('Error al obtener partidos:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener partidos',
      error: error.message 
    });
  }
};

// @desc    Obtener un partido por ID
// @route   GET /api/matches/:id
// @access  Public
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('team1Players', 'firstName lastName age nationality imageUrl')
      .populate('team2Players', 'firstName lastName age nationality imageUrl')
      .populate('createdBy', 'name email');
    
    if (!match) {
      return res.status(404).json({ 
        success: false,
        message: 'Partido no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Error al obtener partido:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener partido',
      error: error.message 
    });
  }
};

// @desc    Obtener partidos de un jugador
// @route   GET /api/matches/player/:playerId
// @access  Public
const getMatchesByPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    
    // Verificar que el jugador exista
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ 
        success: false,
        message: 'Jugador no encontrado' 
      });
    }
    
    // Buscar partidos donde el jugador esté en cualquiera de los equipos
    const matches = await Match.find({
      $or: [
        { team1Players: playerId },
        { team2Players: playerId }
      ]
    })
      .populate('team1Players', 'firstName lastName imageUrl')
      .populate('team2Players', 'firstName lastName imageUrl')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    console.error('Error al obtener partidos del jugador:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener partidos del jugador',
      error: error.message 
    });
  }
};

// @desc    Crear un partido
// @route   POST /api/matches
// @access  Private
const createMatch = async (req, res) => {
  try {
    const { date, team1Players, team2Players, sets, notes } = req.body;

    console.log(date, team1Players, team2Players, sets, notes);
    
    // Validar datos requeridos
    if (!team1Players || !team2Players || !sets) {
      return res.status(400).json({ 
        success: false,
        message: 'Por favor proporciona todos los campos requeridos' 
      });
    }
    
    // Validar que cada equipo tenga 2 jugadores
    if (team1Players.length !== 2 || team2Players.length !== 2) {
      return res.status(400).json({ 
        success: false,
        message: 'Cada equipo debe tener exactamente 2 jugadores' 
      });
    }
    
    // Validar que todos los jugadores existan
    const allPlayerIds = [...team1Players, ...team2Players];
    const playersExist = await Player.find({ _id: { $in: allPlayerIds } });
    
    if (playersExist.length !== 4) {
      return res.status(400).json({ 
        success: false,
        message: 'Uno o más jugadores no existen' 
      });
    }
    
    // Crear partido
    const match = await Match.create({
      date: date || Date.now(),
      team1Players,
      team2Players,
      sets,
      notes,
      createdBy: req.user._id
    });
    
    // Poblar datos antes de retornar
    await match.populate('team1Players', 'firstName lastName imageUrl');
    await match.populate('team2Players', 'firstName lastName imageUrl');
    await match.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Error al crear partido:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear partido',
      error: error.message 
    });
  }
};

// @desc    Actualizar un partido
// @route   PUT /api/matches/:id
// @access  Private
const updateMatch = async (req, res) => {
  try {
    const { date, team1Players, team2Players, sets, notes } = req.body;
    
    let match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ 
        success: false,
        message: 'Partido no encontrado' 
      });
    }
    
    // Validar equipos si se proporcionan
    if (team1Players && team1Players.length !== 2) {
      return res.status(400).json({ 
        success: false,
        message: 'El equipo 1 debe tener exactamente 2 jugadores' 
      });
    }
    
    if (team2Players && team2Players.length !== 2) {
      return res.status(400).json({ 
        success: false,
        message: 'El equipo 2 debe tener exactamente 2 jugadores' 
      });
    }
    
    match = await Match.findByIdAndUpdate(
      req.params.id,
      { date, team1Players, team2Players, sets, notes },
      { new: true, runValidators: true }
    )
      .populate('team1Players', 'firstName lastName imageUrl')
      .populate('team2Players', 'firstName lastName imageUrl')
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Error al actualizar partido:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar partido',
      error: error.message 
    });
  }
};

// @desc    Eliminar un partido
// @route   DELETE /api/matches/:id
// @access  Private/Admin
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ 
        success: false,
        message: 'Partido no encontrado' 
      });
    }
    
    await Match.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Partido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar partido:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar partido',
      error: error.message 
    });
  }
};

module.exports = {
  getAllMatches,
  getMatchById,
  getMatchesByPlayer,
  createMatch,
  updateMatch,
  deleteMatch
};
