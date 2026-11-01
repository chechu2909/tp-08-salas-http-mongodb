require('dotenv').config();
const { crearApp } = require("./app");
const config = require("./config/entorno");
const { conectarDB } = require("./config/db");

const iniciarServidor = async () => {
  try {
    // 1. Conectar a MongoDB Atlas antes de levantar el servidor
    await conectarDB();

    // 2. Crear la aplicación de Express
    const app = crearApp();

    // 3. Iniciar el servidor HTTP
    app.listen(config.port, () => {
      console.log(
        `Servidor escuchando en http://localhost:${config.port} (${config.nodeEnv})`,
      );
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor debido a un error en la base de datos:", error.message);
    process.exit(1);
  }
};

iniciarServidor();