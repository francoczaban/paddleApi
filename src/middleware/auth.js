const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Verificar si el token existe en el header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token (sin password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Usuario no encontrado' 
        });
      }

      next();
    } catch (error) {
      console.error('Error en autenticación:', error);
      return res.status(401).json({ 
        success: false,
        message: 'No autorizado, token inválido' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No autorizado, no se proporcionó token' 
    });
  }
};

module.exports = { protect };
