const mongoose = require("mongoose");
const servicioReservas = require("../servicios/reservas");

const controladorReservas = {
  // ==========================================
  // CONTROLADORES PARA LA API JSON (/api/reservas)
  // ==========================================

  listarApi: async (req, res, next) => {
    try {
      const { sala } = req.query;

      // Validar si el parámetro sala viene repetido como arreglo (ej: ?sala=A&sala=B)
      if (Array.isArray(sala)) {
        return res.status(400).json({ error: "Parámetro de sala repetido." });
      }

      const reservas = await servicioReservas.listar(sala);
      return res.status(200).json(reservas);
    } catch (error) {
      next(error);
    }
  },

  obtenerPorIdApi: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Validar formato del ID de MongoDB
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID mal formado." });
      }

      const reserva = await servicioReservas.buscarPorId(id);
      if (!reserva) {
        return res.status(404).json({ error: "Recurso no encontrado." });
      }

      return res.status(200).json(reserva);
    } catch (error) {
      next(error);
    }
  },

  crearApi: async (req, res, next) => {
    try {
      // Verificar si el cuerpo está ausente o vacío
      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ error: "Cuerpo de la solicitud ausente o inválido." });
      }

      const nuevaReserva = await servicioReservas.crear(req.body);

      // Configurar cabecera Location y responder 201
      res.setHeader("Location", `/api/reservas/${nuevaReserva.id}`);
      return res.status(201).json(nuevaReserva);
    } catch (error) {
      // Si hay error de validación de Mongoose, devolver 400
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  },

  // ==========================================
  // CONTROLADORES PARA VISTAS HTML / FORMULARIOS
  // ==========================================

  inicioVista: async (req, res, next) => {
    try {
      return res.render("inicio");
    } catch (error) {
      next(error);
    }
  },

  listarVista: async (req, res, next) => {
    try {
      const reservas = await servicioReservas.listar();
      return res.render("reservas/lista", {
        reservas,
        seccion: "Listado de Reservas",
      });
    } catch (error) {
      next(error);
    }
  },

  // Muestra el detalle de una reserva específica en HTML
  detalleVista: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .render("no-encontrado", { error: "ID de reserva inválido" });
      }
      const reserva = await servicioReservas.buscarPorId(id);
      if (!reserva) {
        return res
          .status(404)
          .render("no-encontrado", { error: "Reserva no encontrada" });
      }
      return res.render("reservas/detalle", { reserva });
    } catch (error) {
      next(error);
    }
  },

  // Muestra el formulario vacío para crear una reserva
  mostrarFormulario: async (req, res, next) => {
    try {
      return res.render("reservas/nuevo", { valores: {}, error: null });
    } catch (error) {
      next(error);
    }
  },

  crearVista: async (req, res) => {
    try {
      await servicioReservas.crear(req.body);
      return res.redirect("/reservas"); // Redirige al listado tras crear con éxito
    } catch (error) {
      return res.status(400).render("reservas/nuevo", {
        error: error.message,
        valores: req.body,
      });
    }
  },

  estadoSistema: async (req, res, next) => {
    try {
      const total = await servicioReservas.contar();
      return res.render("estado", { total });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = controladorReservas;
