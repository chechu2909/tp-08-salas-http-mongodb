const express = require("express");
const router = express.Router();
const controladorReservas = require("../controladores/reservas");

// ============================================
// RUTAS DE LA API JSON (/api/reservas)
// ============================================
router.get("/api/reservas", controladorReservas.listarApi);
router.get("/api/reservas/:id", controladorReservas.obtenerPorIdApi);
router.post("/api/reservas", controladorReservas.crearApi);

// ============================================
// ==========================================
// RUTA DE VISTAS HTML Y FORMULARIOS
// ==========================================

// Vista principal / Inicio
router.get("/", controladorReservas.inicioVista);

// Vista para ver el listado completo de reservas (enlace "Ver Reservas")
router.get("/reservas", controladorReservas.listarVista);

// IMPORTANTE: /nueva debe ir ANTES de /:id para que Express no confunda "nueva" con un ID
// Vista para mostrar el formulario de carga de una nueva reserva (enlace "Nueva Reserva")
router.get("/reservas/nueva", controladorReservas.mostrarFormulario);

// Vista para ver el detalle de una reserva específica
router.get("/reservas/:id", controladorReservas.detalleVista);

// Recepción de los datos del formulario para crear la reserva vía POST
router.post("/reservas", controladorReservas.crearVista);

// Vista de estado del sistema o de la API (enlace "Estado API")
router.get("/estado", controladorReservas.estadoSistema);

module.exports = router;
