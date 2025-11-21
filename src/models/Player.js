const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'La edad es requerida'],
    min: [1, 'La edad debe ser mayor a 0'],
    max: [120, 'La edad no puede ser mayor a 120']
  },
  nationality: {
    type: String,
    required: [true, 'La nacionalidad es requerida'],
    trim: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para búsquedas
playerSchema.index({ firstName: 1, lastName: 1 });

// Virtual para nombre completo
playerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Incluir virtuals en JSON
playerSchema.set('toJSON', { virtuals: true });
playerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Player', playerSchema);
