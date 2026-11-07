const { crearApp } = require("./app");
const app = crearApp(); // <-- Llamamos a la función para inicializar la app
const { conectarDB } = require("./config/base-datos");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    // 1. Esperamos a que la conexión a MongoDB se establezca ANTES de abrir el puerto
    await conectarDB();
    console.log("Base de datos conectada correctamente.");

    const servidor = app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

    // 2. Cierre ordenado por señales del sistema (SIGINT / SIGTERM)
    const cerrarServidorOrdenado = async (senal) => {
      console.log(
        `\nRecibida señal ${senal}. Cerrando servidor y conexión a base de datos...`,
      );
      servidor.close(async () => {
        try {
          await mongoose.connection.close(false);
          console.log("Conexión a MongoDB cerrada correctamente.");
          process.exit(0);
        } catch (err) {
          console.error("Error al cerrar la conexión de MongoDB:", err);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => cerrarServidorOrdenado("SIGINT"));
    process.on("SIGTERM", () => cerrarServidorOrdenado("SIGTERM"));
  } catch (error) {
    console.error("Error crítico al iniciar la aplicación:", error);
    process.exit(1);
  }
}

iniciarServidor();
