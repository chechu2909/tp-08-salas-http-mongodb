const mongoose = require('mongoose');
const { Reserva } = require('../modelos/reservaModel');

// Validador auxiliar de ID de MongoDB
const validarObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Validador y parser seguro para el campo personas
const parsearPersonas = (val) => {
  if (typeof val === 'boolean' || Array.isArray(val) || val === null) return NaN;
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.trim() !== '') return Number(val);
  return NaN;
};

// 1. Listar todas las reservas (compatible con vistas y API)
const listar = async (salaFiltro) => {
  const query = salaFiltro ? { sala: salaFiltro } : {};
  return await Reserva.find(query);
};

// 2. Buscar por ID (retorna el documento o null, compatible con vistas y API)
const buscarPorId = async (id) => {
  if (!validarObjectId(id)) return null;
  return await Reserva.findById(id);
};

// 3. Contar total de documentos (requerido para /estado)
const contar = async () => {
  return await Reserva.countDocuments({});
};

// 4. Crear nueva reserva (por defecto estado: pendiente)
const crear = async (datos) => {
  const { estudiante, email, sala, fecha, turno, personas } = datos;
  const numPersonas = parsearPersonas(personas);

  const nuevaReserva = new Reserva({
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: numPersonas,
  });

  return await nuevaReserva.save();
};

// 5. Reemplazo completo (PUT exige los 7 campos editables)
const reemplazar = async (id, datos) => {
  if (!validarObjectId(id)) {
    return { status: 400, error: 'ID mal formado' };
  }
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return { status: 400, error: 'Cuerpo de solicitud inválido' };
  }

  const permitidos = ['estudiante', 'email', 'sala', 'fecha', 'turno', 'personas', 'estado'];
  const llavesEnviadas = Object.keys(datos);

  const tieneTodos = permitidos.every((campo) => llavesEnviadas.includes(campo));
  const soloPermitidos = llavesEnviadas.every((campo) => permitidos.includes(campo));

  if (!tieneTodos || !soloPermitidos) {
    return { status: 400, error: 'PUT exige exactamente los 7 campos editables y sin campos extra' };
  }

  const numPersonas = parsearPersonas(datos.personas);
  const updateData = {
    estudiante: datos.estudiante,
    email: datos.email,
    sala: datos.sala,
    fecha: datos.fecha,
    turno: datos.turno,
    personas: numPersonas,
    estado: datos.estado,
  };

  const actualizada = await Reserva.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    overwrite: true,
    upsert: false,
  });

  if (!actualizada) {
    return { status: 404, error: 'Reserva no encontrada' };
  }
  return { status: 200, data: actualizada };
};

// 6. Actualización parcial (PATCH solo permite personas y/o estado)
const actualizarParcial = async (id, datos) => {
  if (!validarObjectId(id)) {
    return { status: 400, error: 'ID mal formado' };
  }
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return { status: 400, error: 'Cuerpo de solicitud inválido' };
  }

  const llaves = Object.keys(datos);
  const permitidos = ['personas', 'estado'];
  const tieneDesconocidos = llaves.some((k) => !permitidos.includes(k));

  if (llaves.length === 0 || tieneDesconocidos) {
    return { status: 400, error: 'PATCH solo admite personas y/o estado' };
  }

  const setUpdate = {};
  if ('personas' in datos) {
    setUpdate.personas = parsearPersonas(datos.personas);
  }
  if ('estado' in datos) {
    setUpdate.estado = datos.estado;
  }

  const actualizada = await Reserva.findByIdAndUpdate(
    id,
    { $set: setUpdate },
    { new: true, runValidators: true, upsert: false }
  );

  if (!actualizada) {
    return { status: 404, error: 'Reserva no encontrada' };
  }
  return { status: 200, data: actualizada };
};

// 7. Eliminación física por ID
const eliminar = async (id) => {
  if (!validarObjectId(id)) {
    return { status: 400, error: 'ID mal formado' };
  }
  const eliminada = await Reserva.findByIdAndDelete(id);
  if (!eliminada) {
    return { status: 404, error: 'Reserva no encontrada' };
  }
  return { status: 204 };
};

module.exports = {
  listar,
  buscarPorId,
  contar,
  crear,
  reemplazar,
  actualizarParcial,
  eliminar,
};