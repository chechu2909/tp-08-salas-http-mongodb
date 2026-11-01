const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  estudiante: {
    type: String,
    required: [true, 'El nombre del estudiante es obligatorio.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio.'],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'El formato del email no es válido. Debe contener @.']
  },
  sala: {
    type: String,
    required: [true, 'La sala es obligatoria.'],
    enum: {
      values: ['Sala Norte', 'Sala Sur', 'Sala Multimedia'],
      message: 'La sala seleccionada no es válida.'
    }
  },
  fecha: {
    type: String,
    required: [true, 'La fecha es obligatoria.'],
    trim: true
  },
  turno: {
    type: String,
    required: [true, 'El turno es obligatorio.'],
    enum: {
      values: ['Mañana', 'Tarde', 'Noche'],
      message: 'El turno seleccionado no es válido.'
    }
  },
  personas: {
    type: Number,
    required: [true, 'La cantidad de personas es obligatoria.'],
    min: [1, 'Debe haber al menos 1 persona.'],
    max: [6, 'No puede haber más de 6 personas.'],
    validate: {
      validator: Number.isInteger,
      message: 'La cantidad de personas debe ser un número entero.'
    }
  },
  estado: {
    type: String,
    default: 'pendiente',
    enum: ['pendiente', 'confirmada']
  }
}, {
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

const Reserva = mongoose.model('Reserva', reservaSchema);

const SALAS_VALIDAS = ['Sala Norte', 'Sala Sur', 'Sala Multimedia'];
const TURNOS_VALIDOS = ['Mañana', 'Tarde', 'Noche'];

module.exports = {
  Reserva,
  SALAS_VALIDAS,
  TURNOS_VALIDOS
};