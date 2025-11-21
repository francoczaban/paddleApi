const adminAuth = (req, res, next) => {
  // Verificar que el usuario esté autenticado (el middleware protect debe ejecutarse antes)
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'No autorizado' 
    });
  }

  // Verificar que el usuario sea admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ 
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador' 
    });
  }

  next();
};

module.exports = { adminAuth };
