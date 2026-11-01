const path = require("path");
const express = require("express");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const config = require("./config/entorno");
const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

// Importar el enrutador modular directo
const rutasReservas = require("./rutas/reservas");

function crearApp() {
  const app = express();

  // 1. Configuración de Motor de Plantillas (EJS y layouts)
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../views"));
  app.use(expressLayouts);
  app.set("layout", "layout");

  // 2. Logging dinámico según entorno y Middlewares personalizados
  app.use(morgan(config.morganFormat));
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  // 3. Archivos estáticos (CSS, JS cliente, imágenes)
  app.use(express.static(path.join(__dirname, "../public")));

  // 4. Parsers de cuerpo de petición
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // 5. Montaje de rutas (tanto API JSON como vistas)
  app.use("/", rutasReservas);

  // 6. Manejo global de rutas no encontradas (404)
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      seccion: "404",
      mensaje: "La ruta a la que intentas acceder no existe en el servidor.",
    });
  });

  return app;
}

module.exports = { crearApp };