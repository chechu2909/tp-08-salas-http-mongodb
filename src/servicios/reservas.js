const { Reserva } = require("../modelos/reservaModel");

const servicioReservas = {
  // Listar todas las reservas o filtrar por sala exacta si se proporciona
  listar: async (filtroSala = null) => {
    const query = filtroSala ? { sala: filtroSala } : {};
    return await Reserva.find(query);
  },

  // Buscar una reserva por su ID de MongoDB
  buscarPorId: async (id) => {
    return await Reserva.findById(id);
  },

  // Contar el total de reservas (utilizado por /estado)
  contar: async () => {
    return await Reserva.countDocuments();
  },

  // Crear una nueva reserva en la base de datos
  crear: async (nuevaReservaData) => {
    // Forzamos explícitamente los campos permitidos y el estado por defecto
    const reservaParaGuardar = {
      estudiante: nuevaReservaData.estudiante,
      email: nuevaReservaData.email,
      sala: nuevaReservaData.sala,
      fecha: nuevaReservaData.fecha,
      turno: nuevaReservaData.turno,
      personas: nuevaReservaData.personas,
      estado: "pendiente", // Default exigido
    };

    const nuevaReserva = new Reserva(reservaParaGuardar);
    return await nuevaReserva.save();
  },
};

module.exports = servicioReservas;
