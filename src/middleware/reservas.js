const SALAS_PERMITIDAS = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const TURNOS_PERMITIDOS = ["Mañana", "Tarde", "Noche"];

function validarReserva(req, res, next) {
  let { estudiante, email, sala, fecha, turno, personas } = req.body;

  estudiante = estudiante ? estudiante.trim() : "";
  email = email ? email.trim() : "";
  sala = sala ? sala.trim() : "";
  fecha = fecha ? fecha.trim() : "";
  turno = turno ? turno.trim() : "";
  const personasNum = Number(personas);

  let error = null;

  if (!estudiante || !email || !sala || !fecha || !turno || !personas) {
    error = "Todos los campos obligatorios deben estar completos.";
  } else if (!email.includes("@")) {
    error = "El correo electrónico debe ser válido y contener un carácter '@'.";
  } else if (!SALAS_PERMITIDAS.includes(sala)) {
    error = "La sala seleccionada no es válida.";
  } else if (!TURNOS_PERMITIDOS.includes(turno)) {
    error = "El turno seleccionado no es válido.";
  } else if (
    isNaN(personasNum) ||
    !Number.isInteger(personasNum) ||
    personasNum < 1 ||
    personasNum > 6
  ) {
    error = "La cantidad de personas debe ser un número entero entre 1 y 6.";
  }

  if (error) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva Reserva",
      seccion: "Reservas",
      valores: { estudiante, email, sala, fecha, turno, personas },
      valoresPrevios: { estudiante, email, sala, fecha, turno, personas },
      error,
      salasPermitidas: SALAS_PERMITIDAS,
      turnosPermitidos: TURNOS_PERMITIDOS,
      idSolicitud: req.idSolicitud,
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: personasNum,
  };

  next();
}

module.exports = { validarReserva };
