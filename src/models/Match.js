const mongoose = require("mongoose");

const setSchema = new mongoose.Schema(
  {
    team1Score: {
      type: Number,
      required: true,
      min: 0,
    },
    team2Score: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "La fecha del partido es requerida"],
    default: Date.now,
  },
  team1Players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
  ],
  team2Players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
  ],
  sets: {
    type: [setSchema],
    validate: {
      validator: function (sets) {
        return sets.length > 0 && sets.length <= 5;
      },
      message: "Debe haber entre 1 y 5 sets",
    },
  },
  notes: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Validar que cada equipo tenga exactamente 2 jugadores
matchSchema.pre("save", function (next) {
  if (this.team1Players.length !== 2) {
    return next(new Error("El equipo 1 debe tener exactamente 2 jugadores"));
  }
  if (this.team2Players.length !== 2) {
    return next(new Error("El equipo 2 debe tener exactamente 2 jugadores"));
  }

  // Validar que no haya jugadores duplicados
  const allPlayers = [...this.team1Players, ...this.team2Players];
  const uniquePlayers = new Set(allPlayers.map((p) => p.toString()));
  if (uniquePlayers.size !== 4) {
    return next(new Error("No puede haber jugadores duplicados en el partido"));
  }

  next();
});

// Índices para mejorar búsquedas
matchSchema.index({ date: -1 });
matchSchema.index({ team1Players: 1 });
matchSchema.index({ team2Players: 1 });
matchSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Match", matchSchema);
