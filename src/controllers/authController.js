const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log(email, password, name);

    // Validar datos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Por favor proporciona email y contraseña' 
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'El usuario ya existe' 
      });
    }

    // Crear usuario
    const user = await User.create({
      email,
      password,
      name
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar usuario',
      error: error.message 
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Por favor proporciona email y contraseña' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });

    // Verificar usuario y contraseña
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message 
    });
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener información del usuario',
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
