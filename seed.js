require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/database');

const seedAdmin = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Verificar si el admin ya existe
    const adminExists = await User.findOne({ email: 'admin@paddle.com' });
    
    if (adminExists) {
      console.log('⚠️  El usuario admin ya existe');
      process.exit(0);
    }

    // Crear usuario admin
    const admin = await User.create({
      email: 'admin@paddle.com',
      password: 'admin123',
      name: 'Administrador',
      isAdmin: true
    });

    console.log('✅ Usuario admin creado exitosamente');
    console.log('📧 Email: admin@paddle.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña en producción');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    process.exit(1);
  }
};

seedAdmin();
